const EXACT_COPY = new Map([
  ["Synthetic matter", "Practice matter"],
  ["JCC preparation demo", "Preparing for a JCC"],
  ["Saskatoon · no real client data", "Practice information only"],
  ["Private matter", "Private case"],
  ["Loopback only · not committed", "Private on this computer"],
  ["Work to complete", "Your next steps"],
  ["JCC preparation", "Preparing for your JCC"],
  ["Mail", "Messages"],
  ["Guided questions", "Questions"],
  ["Section review", "Review answers"],
  ["Page preview", "View form"],
  ["Package preview", "Prepare package"],
  ["Continue wizard", "Continue"],
  ["Validate", "Check my work"],
  ["Preview pages", "View form"],
  ["Questions", "Steps"],
  ["Answered", "Done"],
  ["Needs review", "Need help"],
  ["Current section", "This section"],
  ["Save answer", "Save and continue"],
  ["Source and audit details", "Official form details"],
  ["Hide source and audit details", "Hide official form details"],
  ["Current state", "Status"],
  ["Next safe action", "What to do next"],
  ["Matter task", "Task"],
  ["Correspondence ingress", "Message"],
  ["Create intake proposal", "Review message"],
  ["Mark reviewed", "Mark as reviewed"],
  ["Preview only", "Not available yet"]
]);

const QUESTION_COPY = new Map([
  ["Are you asking the court for this: Interim Decision-making Responsibility?", "Are you asking the court to make a temporary decision about who is responsible for major decisions?"],
  ["Are you asking the court for this: Interim Parenting Time?", "Are you asking for a temporary parenting schedule?"],
  ["Are you asking the court for this: Interim Child Support payable by the Respondent?", "Are you asking for temporary child support to be paid by the respondent?"],
  ["Are you asking the court for this: Interim Spousal Support payable by the Respondent?", "Are you asking for temporary spousal support to be paid by the respondent?"],
  ["Are you asking the court for this: Other relief?", "Are you asking the court for any other temporary order?"],
  ["An order for costs of this application", "Are you asking the court to order the other party to pay some of your legal costs?"],
  ["A draft order/judgment setting out the precise relief or remedy sought is attached", "Have you attached a draft order that says exactly what you are asking the court to order?"],
  ["I am asking that a judicial case conference be set on an expedited basis", "Are you asking for the Judicial Case Conference to happen sooner?"],
  ["If yes, explain", "Why does it need to happen sooner?"]
]);

function replaceProgressCopy(text) {
  return text
    .replace(/(\d+) of (\d+) applicable questions (?:completed|done)/gi, "$1 of $2 steps complete")
    .replace(/(\d+) of (\d+) applicable questions answered/gi, "$1 of $2 answered")
    .replace(/(\d+) applicable questions/gi, "$1 questions")
    .replace(/(\d+) applicable/gi, "$1 questions")
    .replace(/(\d+) unresolved/gi, "$1 need attention")
    .replace(/ready for review/gi, "ready to check")
    .replace(/in progress/gi, "started")
    .replace(/later stage/gi, "later")
    .replace(/current workflow/gi, "current step")
    .replace(/source review pending/gi, "form version needs checking");
}

function updateText(element) {
  if (!(element instanceof HTMLElement)) return;
  if (element.closest(".page-sheet, .inspector-source-label, .inspector-panel--audit")) return;

  const original = element.textContent?.trim();
  if (!original) return;

  if (element.matches(".question-label") && QUESTION_COPY.has(original)) {
    element.textContent = QUESTION_COPY.get(original);
    return;
  }

  if (EXACT_COPY.has(original)) {
    element.textContent = EXACT_COPY.get(original);
    return;
  }

  if (element.childElementCount === 0) {
    const replacement = replaceProgressCopy(original);
    if (replacement !== original) element.textContent = replacement;
  }
}

function simplifyPrivateBanner() {
  // Mode copy is owned by #matter-mode-banner. Never inject a second
  // "Private on this computer" banner that competes with locked/practice state.
  const banner = document.querySelector("#private-lock-banner");
  if (!banner) return;
  banner.classList.add("is-hidden");
  banner.innerHTML = "";
  delete banner.dataset.userCopyApplied;
}

function simplifyPlaceholders() {
  document.querySelectorAll("input, textarea").forEach((field) => {
    if (field.placeholder === "Synthetic preview answer") field.placeholder = "Type your answer";
    if (field.placeholder === "Governed workflow not implemented") field.placeholder = "Add this later";
  });
}

function simplifyIbalDemo() {
  document.querySelectorAll(".ibal-message--assistant").forEach((message) => {
    const heading = message.querySelector("strong");
    if (heading?.textContent === "Ibal demonstration proposal") {
      heading.textContent = "Here is how I can help";
      const paragraph = message.querySelector("p");
      if (paragraph) paragraph.textContent = "I can explain this question, help you work out your answer, or show what information is still missing.";
    }
  });
}

function applyUserLanguage(root = document) {
  const elements = root instanceof HTMLElement ? [root, ...root.querySelectorAll("*")] : [...document.querySelectorAll("*")];
  elements.forEach(updateText);
  simplifyPrivateBanner();
  simplifyPlaceholders();
  simplifyIbalDemo();
}

let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    applyUserLanguage();
  });
});

window.addEventListener("DOMContentLoaded", () => {
  applyUserLanguage();
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
});
