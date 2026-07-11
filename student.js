(function () {
  "use strict";

  if (!window.StudentAuth?.isSessionActive()) {
    window.location.replace("./index.html?studentLogin=1&return=student.html");
    return;
  }

  const storageKey = "brightEnglishStudyV1";
  let state = {};

  try {
    state = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (_) {
    state = {};
  }

  const totals = {
    known: Array.isArray(state.known) ? state.known.length : 0,
    review: Array.isArray(state.review) ? state.review.length : 0,
    saved: Array.isArray(state.saved) ? state.saved.length : 0,
    grammarDone: Array.isArray(state.grammarDone) ? state.grammarDone.length : 0
  };

  document.querySelector("#studentName").textContent = window.StudentAuth.getSession()?.username || "FJW";
  document.querySelector("#knownTotal").textContent = totals.known;
  document.querySelector("#reviewTotal").textContent = totals.review;
  document.querySelector("#savedTotal").textContent = totals.saved;
  document.querySelector("#knowledgeTotal").textContent = totals.grammarDone;

  document.querySelector("#studentLogout").addEventListener("click", () => {
    window.StudentAuth.endSession();
    window.location.replace("./index.html");
  });
})();
