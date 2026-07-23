#!/usr/bin/env python3
"""Overlay matter answers onto an archived official blank PDF using a fill-map.

Outputs are intended for data/private/filled-packages/ (gitignored).
Does not invent missing facts; empty/unknown answers are skipped when configured.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def is_unknown(value) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return True
        upper = text.upper()
        return upper.startswith("UNKNOWN") or upper == "[UNKNOWN]"
    if isinstance(value, list):
        return len(value) == 0 or all(is_unknown(v) for v in value)
    return False


def format_value(value, fmt: str | None) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return "; ".join(str(v) for v in value if not is_unknown(v))
    text = str(value).strip()
    if not fmt:
        return text
    if fmt == "two_digit_year":
        digits = re.sub(r"\D", "", text)
        if len(digits) >= 2:
            return digits[-2:]
        return text
    if fmt == "long_date":
        for candidate in (text, text.replace("/", "-")):
            try:
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", candidate):
                    dt = datetime.strptime(candidate, "%Y-%m-%d")
                    return dt.strftime("%B %-d, %Y")
            except ValueError:
                pass
        return text
    return text


def wrap_words(text: str, max_width: float, font_name: str, font_size: float, c: canvas.Canvas) -> list[str]:
    words = text.split()
    if not words:
        return []
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        trial = f"{current} {word}"
        if c.stringWidth(trial, font_name, font_size) <= max_width:
            current = trial
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def y_pdf(page_height: float, y_top: float, font_size: float = 9) -> float:
    # pdftotext y_top ~ glyph bottom in top-left space; place baseline slightly above underline.
    return page_height - y_top + 1


def draw_checkbox(c: canvas.Canvas, x: float, y_top: float, page_height: float, size: float = 10) -> None:
    c.setFont("Helvetica-Bold", size)
    c.drawString(x + 0.5, y_pdf(page_height, y_top, size) - 1, "X")


def draw_strike(c: canvas.Canvas, x1: float, x2: float, y_top: float, page_height: float) -> None:
    y = y_pdf(page_height, y_top) + 3
    c.setStrokeColorRGB(0, 0, 0)
    c.setLineWidth(0.8)
    c.line(x1, y, x2, y)


def ensure_page_canvas(overlays: dict[int, canvas.Canvas], buffers: dict[int, BytesIO], page: int, width: float, height: float) -> canvas.Canvas:
    if page not in overlays:
        buf = BytesIO()
        buffers[page] = buf
        overlays[page] = canvas.Canvas(buf, pagesize=(width, height))
    return overlays[page]


def apply_placement(
    placement: dict,
    answers: dict,
    unknown_answers: set[str],
    overlays: dict[int, canvas.Canvas],
    buffers: dict[int, BytesIO],
    page_width: float,
    page_height: float,
    font_name: str,
    font_size: float,
) -> dict:
    line_id = placement["line_item_id"]
    answer_id = placement.get("source_line_item_id", line_id)
    kind = placement["kind"]
    result = {"line_item_id": line_id, "kind": kind, "status": "skipped"}

    if kind == "human_only":
        result["status"] = "human_only"
        return result

    value = answers.get(answer_id)
    if answer_id in unknown_answers or is_unknown(value):
        if placement.get("skip_if_empty", True) or kind in {"text", "wrapped_text", "repeatable_text_lines", "checkbox_choice", "strike_pair"}:
            result["status"] = "left_blank_unknown_or_empty"
            return result

    if kind == "text":
        page = placement["page"]
        c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
        text = format_value(value, placement.get("format"))
        if not text and placement.get("skip_if_empty", True):
            result["status"] = "left_blank"
            return result
        c.setFont(font_name, font_size)
        c.drawString(placement["x"], y_pdf(page_height, placement["y_top"], font_size), text[:200])
        result["status"] = "filled"
        result["value_preview"] = text[:80]
        return result

    if kind == "wrapped_text":
        page = placement["page"]
        c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
        text = format_value(value, placement.get("format"))
        if not text and placement.get("skip_if_empty", True):
            result["status"] = "left_blank"
            return result
        use_size = float(placement.get("font_size", font_size))
        # Shrink long answers slightly so more fits on the printed lines.
        if len(text) > 220:
            use_size = min(use_size, 7.5)
        remaining_words = text.split()
        rendered = []
        for line_spec in placement["lines"]:
            if not remaining_words:
                break
            line_words = []
            while remaining_words:
                trial = " ".join(line_words + [remaining_words[0]])
                if line_words and c.stringWidth(trial, font_name, use_size) > line_spec["max_width"]:
                    break
                line_words.append(remaining_words.pop(0))
            line = " ".join(line_words)
            c.setFont(font_name, use_size)
            c.drawString(line_spec["x"], y_pdf(page_height, line_spec["y_top"], use_size), line)
            rendered.append(line)
        result["status"] = "filled" if rendered else "left_blank"
        result["value_preview"] = " / ".join(rendered)[:120]
        if remaining_words:
            result["overflow"] = " ".join(remaining_words)[:200]
            result["status"] = "filled_with_overflow"
        return result

    if kind == "repeatable_text_lines":
        page = placement["page"]
        c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
        items = value if isinstance(value, list) else [value]
        items = [format_value(v, None) for v in items if not is_unknown(v)]
        filled = 0
        for item, line_spec in zip(items, placement["lines"]):
            c.setFont(font_name, font_size)
            # truncate to width
            text = item
            while c.stringWidth(text, font_name, font_size) > line_spec["max_width"] and len(text) > 3:
                text = text[:-4] + "..."
            c.drawString(line_spec["x"], y_pdf(page_height, line_spec["y_top"], font_size), text)
            filled += 1
        result["status"] = "filled" if filled else "left_blank"
        result["items_filled"] = filled
        return result

    if kind == "checkbox_choice":
        if "page_by_choice" in placement:
            choice = placement["page_by_choice"].get(str(value))
            if not choice:
                result["status"] = "unmatched_choice"
                result["value"] = value
                return result
            page = choice["page"]
            c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
            draw_checkbox(c, choice["x"], choice["y_top"], page_height)
            result["status"] = "checked"
            result["value"] = value
            return result
        page = placement["page"]
        choice = placement["choices"].get(str(value))
        if not choice:
            result["status"] = "unmatched_choice"
            result["value"] = value
            return result
        c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
        draw_checkbox(c, choice["x"], choice["y_top"], page_height)
        result["status"] = "checked"
        result["value"] = value
        return result

    if kind == "strike_pair":
        page = placement["page"]
        pair = placement["pairs"].get(str(value))
        if not pair:
            result["status"] = "unmatched_choice"
            result["value"] = value
            return result
        c = ensure_page_canvas(overlays, buffers, page, page_width, page_height)
        strike = pair["strike"]
        draw_strike(c, strike["x1"], strike["x2"], strike["y_top"], page_height)
        result["status"] = "struck_unused_role"
        result["value"] = value
        return result

    result["status"] = f"unsupported_kind:{kind}"
    return result


def fill_form(fill_map_path: Path, matter_path: Path, out_pdf: Path, out_receipt: Path) -> int:
    fill_map = load_json(fill_map_path)
    matter = load_json(matter_path)
    answers = matter.get("answers", {}).get(fill_map["form_id"], {})
    unknown_list = matter.get("unknown_answers", {}).get(fill_map["form_id"], [])
    unknown_answers = set(unknown_list)

    blank_path = ROOT / fill_map["blank_pdf"]
    if not blank_path.exists():
        print(f"missing blank: {blank_path}", file=sys.stderr)
        return 2

    blank_sha = sha256_file(blank_path)
    fill_map["blank_sha256"] = blank_sha

    reader = PdfReader(str(blank_path))
    page_width = float(fill_map["coordinate_system"]["page_size"]["width"])
    page_height = float(fill_map["coordinate_system"]["page_size"]["height"])
    font_name = fill_map.get("font", {}).get("name", "Helvetica")
    font_size = float(fill_map.get("font", {}).get("size", 9))

    overlays: dict[int, canvas.Canvas] = {}
    buffers: dict[int, BytesIO] = {}
    receipt_rows = []

    for placement in fill_map["placements"]:
        row = apply_placement(
            placement,
            answers,
            unknown_answers,
            overlays,
            buffers,
            page_width,
            page_height,
            font_name,
            font_size,
        )
        receipt_rows.append(row)

    for c in overlays.values():
        c.save()

    writer = PdfWriter()
    for index, page in enumerate(reader.pages, start=1):
        if index in buffers:
            overlay_reader = PdfReader(buffers[index])
            page.merge_page(overlay_reader.pages[0])
        writer.add_page(page)

    out_pdf.parent.mkdir(parents=True, exist_ok=True)
    with out_pdf.open("wb") as f:
        writer.write(f)

    receipt = {
        "form_id": fill_map["form_id"],
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "blank_pdf": str(fill_map["blank_pdf"]),
        "blank_sha256": blank_sha,
        "output_pdf": str(out_pdf.relative_to(ROOT)) if out_pdf.is_relative_to(ROOT) else str(out_pdf),
        "output_sha256": sha256_file(out_pdf),
        "matter_fixture_version": matter.get("fixture_version"),
        "privacy": matter.get("privacy"),
        "court_ready": False,
        "disclaimer": "Draft overlay on official blank. Not court-ready. Human verification and wet-ink signature required.",
        "placements": receipt_rows,
        "answer_keys_present": sorted(answers.keys()),
        "unknown_answer_keys": sorted(unknown_answers),
    }
    out_receipt.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {out_pdf}")
    print(f"wrote {out_receipt}")
    filled = sum(
        1
        for r in receipt_rows
        if r["status"] in {"filled", "filled_with_overflow", "checked", "struck_unused_role"}
    )
    blanked = sum(1 for r in receipt_rows if "blank" in r["status"] or r["status"] == "human_only")
    overflows = [r["line_item_id"] for r in receipt_rows if r["status"] == "filled_with_overflow"]
    print(f"placements filled/checked={filled} blank_or_human={blanked} total={len(receipt_rows)}")
    if overflows:
        print("OVERFLOW (text exceeds printed lines):", ", ".join(overflows))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fill-map", required=True, type=Path)
    parser.add_argument("--matter", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--receipt", type=Path)
    args = parser.parse_args()
    receipt = args.receipt or args.out.with_suffix(".receipt.json")
    return fill_form(args.fill_map.resolve(), args.matter.resolve(), args.out.resolve(), receipt.resolve())


if __name__ == "__main__":
    raise SystemExit(main())
