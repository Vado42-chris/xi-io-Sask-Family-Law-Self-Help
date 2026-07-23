/**
 * Required-document diagnosis + matter readiness helpers.
 * Consumes workflows/.../required-document-diagnosis.json only.
 * Does not invent court requirements beyond recorded diagnosis rows.
 */

export const QUESTION_SOURCE_HINTS = {
  "header.court_file_number": {
    where_to_find: [
      "Court-issued Notice of JCC",
      "Previously filed court forms",
      "Court correspondence carrying the file number"
    ]
  },
  "header.judicial_centre": {
    where_to_find: [
      "Court-issued Notice of JCC",
      "Caption on previously filed forms"
    ]
  },
  "header.petitioner": {
    where_to_find: [
      "Caption on previously filed forms",
      "Court-issued Notice of JCC"
    ]
  },
  "header.respondent": {
    where_to_find: [
      "Caption on previously filed forms",
      "Court-issued Notice of JCC"
    ]
  },
  "schedule.date": {
    where_to_find: [
      "Court-issued Notice of JCC",
      "Any court correspondence confirming the conference date"
    ]
  },
  "schedule.time_and_location": {
    where_to_find: [
      "Court-issued Notice of JCC",
      "Any court correspondence confirming time and location"
    ]
  }
};

export function progressStateFromAnswers(progress) {
  if (!progress || progress.total === 0) return "not_started";
  if (progress.percent === 100 && progress.unknown === 0) return "complete";
  if (progress.unknown > 0 && progress.answered > 0) return "needs_review";
  if (progress.answered > 0) return "in_progress";
  return "not_started";
}

export function workBlockersForDocument(doc, progress) {
  const blockers = [];
  if (doc.requirement_class === "source_missing" || doc.verification_state === "blocked" && !doc.form_id) {
    blockers.push("source_missing");
  }
  if (doc.requirement_class === "court_issued" && doc.verification_state === "blocked") {
    blockers.push("external_document_pending");
  }
  if (progress?.unknown > 0) blockers.push("information_missing");
  if (progress?.blockers > 0 && progress.answered === 0 && doc.form_id) {
    // unanswered required questions are information gaps, not a hard work stop
    blockers.push("information_missing");
  }
  return blockers.length ? [...new Set(blockers)] : ["none"];
}

export function resolveProceduralStage(diagnosis, fixture) {
  const matterStage = String(fixture?.matter?.stage || "").toLowerCase();
  if (matterStage.includes("appearance memo") || matterStage.includes("scheduled jcc")) {
    return diagnosis.procedural_stages.find((stage) => stage.stage_id === "preparing_appearance_memo")
      || { stage_id: "preparing_appearance_memo", label: "Preparing Appearance Memo" };
  }
  if (matterStage.includes("request")) {
    return diagnosis.procedural_stages.find((stage) => stage.stage_id === "requesting_jcc")
      || { stage_id: "requesting_jcc", label: "Requesting a JCC" };
  }
  // Default live-track proof focuses on Appearance Memo.
  return diagnosis.procedural_stages.find((stage) => stage.stage_id === "preparing_appearance_memo")
    || { stage_id: "preparing_appearance_memo", label: "Preparing Appearance Memo" };
}

export function identifiedRequiredDocuments(diagnosis) {
  return (diagnosis?.documents || []).filter((doc) =>
    ["required_now", "required_later", "needs_human_confirmation"].includes(doc.requirement_class)
  );
}

export function buildMatterReadiness({ diagnosis, fixture, formProgressById }) {
  const stage = resolveProceduralStage(diagnosis, fixture);
  const identified = identifiedRequiredDocuments(diagnosis);
  const documentStates = (diagnosis.documents || []).map((doc) => {
    const progress = doc.form_id ? (formProgressById[doc.form_id] || null) : null;
    const progress_state = doc.form_id
      ? progressStateFromAnswers(progress || { total: 0, answered: 0, percent: 0, unknown: 0, blockers: 0 })
      : "not_started";
    const work_blockers = workBlockersForDocument(doc, progress);
    const package_blockers = [];
    if (doc.requirement_class === "source_missing") {
      package_blockers.push("Official source catalog missing from current snapshot");
    }
    if (doc.requirement_class === "court_issued" && doc.verification_state === "blocked") {
      package_blockers.push("Court-issued document not yet archived in this matter");
    }
    if (doc.form_id && progress_state !== "complete") {
      package_blockers.push(`${doc.official_number || doc.title} incomplete`);
    }
    if (doc.requirement_class === "needs_human_confirmation") {
      package_blockers.push("Human confirmation still required for applicability");
    }
    return {
      document_id: doc.document_id,
      form_id: doc.form_id,
      progress_state,
      work_blockers,
      package_blockers,
      answered: progress?.answered || 0,
      total: progress?.total || 0,
      percent: progress?.percent || 0
    };
  });

  const checklist = (diagnosis.readiness_checklist || []).map((item) => {
    const docState = documentStates.find((row) => row.document_id === item.document_id);
    let state = "not_ready";
    let reason = "Not complete";
    if (item.document_id && docState) {
      if (docState.work_blockers.includes("source_missing") || docState.work_blockers.includes("external_document_pending")) {
        state = "blocked";
        reason = docState.package_blockers[0] || "Blocked";
      } else if (docState.progress_state === "complete") {
        state = "ready";
        reason = "Complete";
      } else {
        state = "not_ready";
        reason = `${docState.progress_state.replaceAll("_", " ")} · ${docState.percent}%`;
      }
    } else if (!item.document_id) {
      state = "not_ready";
      reason = "Not yet evidenced in this preview";
    }
    return {
      item_id: item.item_id,
      label: item.label,
      category: item.category,
      state,
      reason
    };
  });

  const package_blockers = [];
  if (diagnosis.verification_state !== "human_verified") {
    package_blockers.push("Requirement review is not complete");
  }
  for (const row of checklist.filter((item) => item.state !== "ready")) {
    package_blockers.push(`${row.label}: ${row.reason}`);
  }
  package_blockers.push("Court transmission is not implemented");

  return {
    schema_version: 1,
    snapshot_id: diagnosis.snapshot_id,
    diagnosis_id: diagnosis.diagnosis_id,
    procedural_stage: stage.stage_id,
    procedural_stage_label: stage.label,
    requirement_review_complete: diagnosis.verification_state === "human_verified",
    identified_required_count: identified.length,
    package_ready: false,
    package_blockers,
    checklist,
    document_states: documentStates
  };
}
