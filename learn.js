const middleKnowledge = Array.isArray(window.GRAMMAR_DATA)
  ? window.GRAMMAR_DATA.map((topic) => ({ ...topic, stage: "middle" }))
  : [];
const extraKnowledge = Array.isArray(window.STAGE_KNOWLEDGE_DATA) ? window.STAGE_KNOWLEDGE_DATA : [];
const wordSets = {
  primary: Array.isArray(window.PRIMARY_VOCABULARY_DATA) ? window.PRIMARY_VOCABULARY_DATA : [],
  middle: Array.isArray(window.MIDDLE_SCHOOL_VOCABULARY_DATA) ? window.MIDDLE_SCHOOL_VOCABULARY_DATA : [],
  high: Array.isArray(window.HIGH_SCHOOL_VOCABULARY_DATA) ? window.HIGH_SCHOOL_VOCABULARY_DATA : [],
  postgraduate: Array.isArray(window.POSTGRADUATE_VOCABULARY_DATA) ? window.POSTGRADUATE_VOCABULARY_DATA : [],
  ielts: Array.isArray(window.IELTS_VOCABULARY_DATA) ? window.IELTS_VOCABULARY_DATA : []
};
const knowledgeSets = {
  primary: extraKnowledge.filter((topic) => topic.stage === "primary"),
  middle: middleKnowledge,
  high: extraKnowledge.filter((topic) => topic.stage === "high"),
  postgraduate: [],
  ielts: []
};
const wordCollisionCounts = Object.values(wordSets).flat().reduce((counts, word) => {
  const key = `${word.stage || "middle"}:${String(word.word || "").trim().toLowerCase()}`;
  counts.set(key, (counts.get(key) || 0) + 1);
  return counts;
}, new Map());
const storageKey = "brightEnglishStudyV1";
const pronunciationKey = "brightEnglishPronunciationV1";
const pageSize = 24;

const gradeLabels = {
  primary: "小学课标二级",
  middle: "义务教育课标三级",
  "primary-lower": "小学低年级",
  "primary-upper": "小学高年级",
  grade7: "七年级知识",
  grade8: "八年级知识",
  grade9: "九年级知识",
  high0: "义务教育基础",
  high1: "高中必修",
  high2: "选择性必修",
  high3: "高考拓展",
  postgraduate: "考研词汇",
  ielts: "雅思备考词汇"
};

const stageConfig = {
  primary: {
    eyebrow: "PRIMARY SCHOOL",
    heading: "小学英语知识库",
    description: "从自然拼读和生活词汇开始，在听、读、说、练中建立英语基础。",
    vocabularyTitle: "小学课标词汇",
    knowledgeTitle: "小学知识库",
    vocabularyLabel: "小学单词",
    knowledgeLabel: "知识主题",
    wordFilters: [["all", "课标 505 词"], ["saved", "已收藏"]],
    knowledgeFilters: [["all", "全部主题"], ["primary-lower", "低年级"], ["primary-upper", "高年级"]],
    legend: "《义务教育英语课程标准（2022年版）》二级词汇"
  },
  middle: {
    eyebrow: "MIDDLE SCHOOL",
    heading: "初中英语知识库",
    description: "系统梳理核心词汇与语法，在搜索、练习和复习中逐步掌握。",
    vocabularyTitle: "义务教育课标词汇",
    knowledgeTitle: "初中语法与知识",
    vocabularyLabel: "初中单词",
    knowledgeLabel: "知识主题",
    wordFilters: [["all", "课标三级 1600 词"], ["saved", "已收藏"]],
    knowledgeFilters: [["all", "全部主题"], ["grade7", "七年级"], ["grade8", "八年级"], ["grade9", "九年级"]],
    legend: "《义务教育英语课程标准（2022年版）》三级词汇"
  },
  high: {
    eyebrow: "HIGH SCHOOL",
    heading: "高中英语知识库",
    description: "积累高频词汇，拆解长难句，并练习阅读、语篇与写作方法。",
    vocabularyTitle: "高中课标词汇",
    knowledgeTitle: "高中知识库",
    vocabularyLabel: "高中课标词汇",
    knowledgeLabel: "知识主题",
    wordFilters: [["all", "课标 3000 词"], ["high0", "基础"], ["high1", "必修"], ["high2", "选择性必修"], ["saved", "已收藏"]],
    knowledgeFilters: [["all", "全部主题"], ["high1", "高中基础"], ["high2", "高中进阶"], ["high3", "高考拓展"]],
    legend: "《普通高中英语课程标准（2017年版2020年修订）》完整 3000 词"
  },
  postgraduate: {
    eyebrow: "POSTGRADUATE ENTRANCE EXAM",
    heading: "考研英语词库",
    description: "覆盖阅读、完形、翻译与写作中常见的考研英语词汇。",
    vocabularyTitle: "考研英语词汇",
    knowledgeTitle: "考研备考",
    vocabularyLabel: "考研单词",
    knowledgeLabel: "备考专题",
    wordFilters: [["all", "考研 4801 词"], ["saved", "已收藏"]],
    knowledgeFilters: [],
    legend: "ECDICT 考研考试标签词汇（MIT License）"
  },
  ielts: {
    eyebrow: "IELTS PREPARATION",
    heading: "雅思备考词库",
    description: "面向雅思阅读、听力、口语与写作的综合备考词汇。",
    vocabularyTitle: "雅思备考词汇",
    knowledgeTitle: "雅思备考",
    vocabularyLabel: "雅思单词",
    knowledgeLabel: "备考专题",
    wordFilters: [["all", "雅思备考 5040 词"], ["saved", "已收藏"]],
    knowledgeFilters: [],
    legend: "ECDICT 雅思标签词汇；并非 IELTS 官方唯一词表"
  }
};

const requestedStage = new URLSearchParams(window.location.search).get("stage");
let activeStage = Object.hasOwn(stageConfig, requestedStage) ? requestedStage : "middle";
let words = wordSets[activeStage];
let grammarTopics = knowledgeSets[activeStage];

let activeView = "vocabulary";
let activeWordFilter = "all";
let activeGrammarFilter = "all";
let selectedGrammarId = grammarTopics[0]?.id || "";
let visibleWordCount = pageSize;
let currentQuiz = null;
let pronunciationAccent = localStorage.getItem(pronunciationKey) === "gb" ? "gb" : "us";
let availableVoices = [];

function loadState() {
  const empty = { known: [], review: [], saved: [], seen: [], grammarDone: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    return { ...empty, ...(parsed || {}) };
  } catch (_error) {
    return empty;
  }
}

let studyState = loadState();

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(studyState));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function unique(items) {
  return [...new Set(items)];
}

function setMembership(listName, id, enabled) {
  const current = new Set(studyState[listName]);
  enabled ? current.add(id) : current.delete(id);
  studyState[listName] = [...current];
}

function wordId(word) {
  const stage = word.stage || "middle";
  const normalized = normalize(word.word);
  const collisionKey = `${stage}:${normalized}`;
  const baseId = wordCollisionCounts.get(collisionKey) > 1 ? `${normalized}:${word.word}` : normalized;
  return stage !== "middle" ? `${stage}:${baseId}` : baseId;
}

function updateLocation(view = activeView) {
  const url = new URL(window.location.href);
  url.searchParams.set("stage", activeStage);
  url.hash = view;
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function renderStageControls() {
  const config = stageConfig[activeStage];
  const hasKnowledge = grammarTopics.length > 0;
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.classList.toggle("active", button.dataset.stage === activeStage);
  });
  document.querySelector("#stageEyebrow").textContent = config.eyebrow;
  document.querySelector("#stageHeading").textContent = config.heading;
  document.querySelector("#stageDescription").textContent = config.description;
  document.querySelector("#vocabTitle").textContent = config.vocabularyTitle;
  document.querySelector("#grammarTitle").textContent = config.knowledgeTitle;
  document.querySelector("#vocabLabel").textContent = config.vocabularyLabel;
  document.querySelector("#grammarLabel").textContent = config.knowledgeLabel;
  document.querySelector('[data-view="grammar"]').hidden = !hasKnowledge;
  document.querySelector("#grammarTotal").closest("div").hidden = !hasKnowledge;
  document.querySelector("#introStats").classList.toggle("two-stats", !hasKnowledge);
  document.querySelector("#levelLegend").textContent = config.legend;
  document.querySelector("#wordFilters").innerHTML = config.wordFilters.map(([value, label], index) => (
    `<button class="filter-tab ${index === 0 ? "active" : ""}" type="button" data-word-filter="${value}">${label}</button>`
  )).join("");
  document.querySelector("#grammarFilters").innerHTML = config.knowledgeFilters.map(([value, label], index) => (
    `<button class="grammar-filter ${index === 0 ? "active" : ""}" type="button" data-grammar-filter="${value}">${label}</button>`
  )).join("");
  if (!hasKnowledge && activeView === "grammar") switchView("vocabulary", false);
}

function setStage(stage, updateUrl = true) {
  if (!Object.hasOwn(stageConfig, stage)) return;
  activeStage = stage;
  words = wordSets[stage];
  grammarTopics = knowledgeSets[stage];
  activeWordFilter = "all";
  activeGrammarFilter = "all";
  selectedGrammarId = grammarTopics[0]?.id || "";
  visibleWordCount = pageSize;
  document.querySelector("#wordSearch").value = "";
  renderStageControls();
  updateSummary();
  renderWords();
  renderGrammarList();
  renderReviewWords();
  if (updateUrl) updateLocation();
}

function getDaySeed() {
  const now = new Date();
  return Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
}

function getDailyWords() {
  if (!words.length) return [];
  const start = (getDaySeed() * 17) % words.length;
  return Array.from({ length: Math.min(10, words.length) }, (_value, index) => words[(start + index * 37) % words.length]);
}

function getDailyGrammar() {
  return grammarTopics[getDaySeed() % Math.max(grammarTopics.length, 1)];
}

function updateSummary() {
  const currentWordIds = new Set(words.map(wordId));
  const currentKnowledgeIds = new Set(grammarTopics.map((topic) => topic.id));
  const knownCount = studyState.known.filter((id) => currentWordIds.has(id)).length;
  const reviewCount = studyState.review.filter((id) => currentWordIds.has(id)).length;
  const savedCount = studyState.saved.filter((id) => currentWordIds.has(id)).length;
  const knowledgeDoneCount = studyState.grammarDone.filter((id) => currentKnowledgeIds.has(id)).length;
  document.querySelector("#vocabTotal").textContent = words.length;
  document.querySelector("#grammarTotal").textContent = grammarTopics.length;
  document.querySelector("#masteredTotal").textContent = knownCount;
  document.querySelector("#knownCount").textContent = knownCount;
  document.querySelector("#reviewCount").textContent = reviewCount;
  document.querySelector("#savedCount").textContent = savedCount;
  document.querySelector("#grammarCount").textContent = knowledgeDoneCount;
  document.querySelector("#grammarDoneCount").textContent = knowledgeDoneCount;
  const reviewButton = document.querySelector("#reviewQuiz");
  reviewButton.disabled = reviewCount === 0;
  reviewButton.textContent = reviewCount ? "复习不会的词" : "暂无待复习词";

  const date = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
  document.querySelector("#todayDate").textContent = date;

  const dailyWords = getDailyWords();
  const seen = new Set(studyState.seen);
  const wordDone = dailyWords.filter((word) => seen.has(wordId(word))).length;
  const dailyGrammar = getDailyGrammar();
  const grammarDone = dailyGrammar && studyState.grammarDone.includes(dailyGrammar.id) ? 1 : 0;
  const total = dailyWords.length + (dailyGrammar ? 1 : 0);
  const done = wordDone + grammarDone;
  document.querySelector("#todayProgressText").textContent = `${done} / ${total}`;
  document.querySelector("#todayProgressBar").style.width = `${total ? (done / total) * 100 : 0}%`;
  document.querySelector("#todayMessage").textContent = done === total && total > 0
    ? "今天的相遇已经完成，明天会有新的十个词。"
    : dailyGrammar
      ? `认识 ${dailyWords.length} 个词，再读懂“${dailyGrammar.title}”。`
      : `认识并复习今天的 ${dailyWords.length} 个词。`;
}

function getFilteredWords() {
  const query = normalize(document.querySelector("#wordSearch")?.value);
  const saved = new Set(studyState.saved);
  let filtered;

  if (activeWordFilter === "today") {
    filtered = getDailyWords();
  } else if (activeWordFilter === "saved") {
    filtered = words.filter((word) => saved.has(wordId(word)));
  } else if (activeWordFilter === "all") {
    filtered = words;
  } else {
    filtered = words.filter((word) => word.grade === activeWordFilter);
  }

  if (!query) return filtered;
  return filtered.filter((word) => {
    return normalize(word.word).includes(query) || normalize(word.meaning).includes(query);
  });
}

function wordCard(word) {
  const id = wordId(word);
  const known = studyState.known.includes(id);
  const review = studyState.review.includes(id);
  const saved = studyState.saved.includes(id);
  const level = word.level || "-";
  const gradeLabel = gradeLabels[word.grade] || "词汇";
  const stageLabel = level === "-" || level === gradeLabel ? gradeLabel : `${gradeLabel} · ${level}`;
  return `
    <article class="word-card" data-level="${escapeHtml(level)}" data-word-id="${escapeHtml(id)}">
      <div class="word-top">
        <div class="word-title">
          <strong>${escapeHtml(word.word)}</strong>
          <span>${escapeHtml(word.phonetic || "音标整理中")}</span>
        </div>
        <div>
          <button class="icon-command" type="button" data-action="speak" title="朗读单词" aria-label="朗读 ${escapeHtml(word.word)}">▶</button>
          <button class="icon-command ${saved ? "active" : ""}" type="button" data-action="save" title="收藏单词" aria-label="${saved ? "取消收藏" : "收藏"} ${escapeHtml(word.word)}">${saved ? "★" : "☆"}</button>
        </div>
      </div>
      <p class="word-meaning">${escapeHtml(word.meaning)}</p>
      <span class="word-stage">${escapeHtml(stageLabel)}</span>
      <div class="word-actions">
        <button class="${known ? "active" : ""}" type="button" data-action="known">${known ? "已掌握" : "我认识"}</button>
        <button class="${review ? "active" : ""}" type="button" data-action="review">${review ? "复习中" : "还不熟"}</button>
      </div>
    </article>
  `;
}

function renderWords() {
  const grid = document.querySelector("#wordGrid");
  const result = getFilteredWords();
  const visible = result.slice(0, visibleWordCount);
  const label = activeWordFilter === "today" ? "今日 10 词" : activeWordFilter === "saved" ? "收藏词汇" : "符合条件";

  document.querySelector("#wordResultCount").textContent = `${label} ${result.length} 个`;
  grid.innerHTML = visible.length
    ? visible.map(wordCard).join("")
    : '<p class="empty-state">这里暂时没有词汇。可以换一个范围，或者试试别的关键词。</p>';
  document.querySelector("#loadMoreWords").classList.toggle("hidden", visible.length >= result.length);
}

function renderReviewWords() {
  const ids = new Set(studyState.review);
  const reviewWords = words.filter((word) => ids.has(wordId(word)));
  const grid = document.querySelector("#reviewWordGrid");
  document.querySelector("#reviewHint").textContent = reviewWords.length ? `共 ${reviewWords.length} 个，先从眼前几个开始` : "还没有待复习词汇";
  grid.innerHTML = reviewWords.length
    ? reviewWords.slice(0, 24).map(wordCard).join("")
    : '<p class="empty-state">遇到不熟悉的词时，点一下“还不熟”，它就会来到这里。</p>';
}

function switchView(view, updateHash = true) {
  if (!document.querySelector(`[data-panel="${view}"]`)) return;
  if (view === "grammar" && grammarTopics.length === 0) return;
  activeView = view;
  document.querySelectorAll(".view-tab").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".study-view").forEach((panel) => {
    const active = panel.dataset.panel === view;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  if (view === "review") renderReviewWords();
  if (updateHash) updateLocation(view);
}

function renderGrammarList() {
  const list = document.querySelector("#grammarList");
  const filtered = activeGrammarFilter === "all"
    ? grammarTopics
    : grammarTopics.filter((topic) => topic.grade === activeGrammarFilter);
  if (!filtered.some((topic) => topic.id === selectedGrammarId)) selectedGrammarId = filtered[0]?.id || "";

  const groups = new Map();
  filtered.forEach((topic) => {
    if (!groups.has(topic.category)) groups.set(topic.category, []);
    groups.get(topic.category).push(topic);
  });

  let number = 0;
  list.innerHTML = [...groups.entries()].map(([category, topics]) => {
    const topicHtml = topics.map((topic) => {
      number += 1;
      const done = studyState.grammarDone.includes(topic.id);
      return `
        <button class="grammar-item ${topic.id === selectedGrammarId ? "active" : ""}" type="button" data-grammar-id="${escapeHtml(topic.id)}">
          <span class="grammar-number">${String(number).padStart(2, "0")}</span>
          <span class="grammar-name"><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(gradeLabels[topic.grade])}</span></span>
          <span class="grammar-check">${done ? "✓" : ""}</span>
        </button>
      `;
    }).join("");
    return `<p class="grammar-group-title">${escapeHtml(category)}</p>${topicHtml}`;
  }).join("");
  renderGrammarLesson();
}

function renderGrammarLesson() {
  const lesson = document.querySelector("#grammarLesson");
  const topic = grammarTopics.find((item) => item.id === selectedGrammarId);
  if (!topic) {
    lesson.innerHTML = '<p class="empty-state">请选择一个语法主题。</p>';
    return;
  }

  lesson.innerHTML = `
    <div class="lesson-meta"><span>${escapeHtml(gradeLabels[topic.grade])}</span><span>${escapeHtml(topic.category)}</span></div>
    <h3>${escapeHtml(topic.title)}</h3>
    <p class="lesson-summary">${escapeHtml(topic.summary)}</p>
    <div class="formula-box"><span>知识要点</span><code>${escapeHtml(topic.formula)}</code></div>
    <div class="example-list">
      ${topic.examples.map((example) => `<p><strong>${escapeHtml(example.en)}</strong><span>${escapeHtml(example.zh)}</span></p>`).join("")}
    </div>
    <p class="pitfall"><strong>学习提醒：</strong>${escapeHtml(topic.pitfall)}</p>
    <div class="lesson-practice" data-topic-id="${escapeHtml(topic.id)}">
      <h4>现在试一试</h4>
      <p>${escapeHtml(topic.question)}</p>
      <div class="lesson-options">
        ${topic.options.map((option, index) => `<button class="lesson-option" type="button" data-lesson-answer="${index}">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join("")}
      </div>
      <p class="lesson-feedback" aria-live="polite"></p>
    </div>
  `;
}

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  availableVoices = window.speechSynthesis.getVoices();
}

function selectVoice(accent) {
  const config = accent === "gb"
    ? { lang: "en-GB", preferred: ["Daniel", "Serena", "Kate", "Oliver"] }
    : { lang: "en-US", preferred: ["Samantha", "Ava", "Alex", "Tom"] };
  const matching = availableVoices.filter((voice) => voice.lang?.toLowerCase().startsWith(config.lang.toLowerCase()));
  const localVoices = matching.filter((voice) => voice.localService);
  const candidates = localVoices.length ? localVoices : matching;
  return [...candidates].sort((left, right) => {
    const score = (voice) => {
      const preferredIndex = config.preferred.findIndex((name) => voice.name.includes(name));
      return (preferredIndex < 0 ? 0 : 100 - preferredIndex * 10)
        + (voice.lang?.toLowerCase() === config.lang.toLowerCase() ? 20 : 0)
        + (voice.localService ? 10 : 0);
    };
    return score(right) - score(left);
  })[0] || null;
}

function renderPronunciationControl() {
  document.querySelectorAll("[data-accent]").forEach((button) => {
    const active = button.dataset.accent === pronunciationAccent;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function speakWord(word, button) {
  if (!("speechSynthesis" in window)) {
    button?.setAttribute("title", "当前浏览器不支持语音朗读");
    return;
  }
  window.speechSynthesis.cancel();
  refreshVoices();
  const spokenText = String(word).replace(/\s*\/\s*/g, ", ").replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = pronunciationAccent === "gb" ? "en-GB" : "en-US";
  utterance.voice = selectVoice(pronunciationAccent);
  utterance.rate = spokenText.length > 18 ? 0.82 : 0.88;
  utterance.pitch = 1;
  const finish = () => button?.classList.remove("speaking");
  utterance.onstart = () => button?.classList.add("speaking");
  utterance.onend = finish;
  utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);
}

function handleWordAction(card, action, trigger) {
  const id = card.dataset.wordId;
  const word = words.find((item) => wordId(item) === id);
  if (!word) return;

  if (action === "speak") {
    speakWord(word.word, trigger);
    return;
  }

  if (action === "save") {
    setMembership("saved", id, !studyState.saved.includes(id));
  }

  if (action === "known") {
    const enabled = !studyState.known.includes(id);
    setMembership("known", id, enabled);
    if (enabled) setMembership("review", id, false);
    setMembership("seen", id, true);
  }

  if (action === "review") {
    const enabled = !studyState.review.includes(id);
    setMembership("review", id, enabled);
    if (enabled) setMembership("known", id, false);
    setMembership("seen", id, true);
  }

  saveState();
  updateSummary();
  renderWords();
  if (activeView === "review") renderReviewWords();
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function buildQuizQuestions(candidates, supplement = false) {
  const candidateIds = new Set(candidates.map(wordId));
  const supplemented = supplement && candidates.length < 10
    ? [...candidates, ...shuffled(words.filter((word) => !candidateIds.has(wordId(word))))]
    : candidates;
  const questionPool = supplemented.length ? supplemented : words;
  const optionPool = candidates.length >= 4 ? candidates : words;
  return shuffled(questionPool).slice(0, 10).map((word) => {
    const distractors = shuffled(optionPool.filter((item) => wordId(item) !== wordId(word) && item.meaning !== word.meaning)).slice(0, 3);
    const options = shuffled([word, ...distractors]);
    return {
      word,
      prompt: word.word,
      options: options.map((item) => item.meaning),
      answer: options.findIndex((item) => wordId(item) === wordId(word))
    };
  }).filter((question) => question.options.length === 4);
}

function openQuiz(candidates, supplement = false) {
  const questions = buildQuizQuestions(candidates, supplement);
  if (!questions.length) return;
  currentQuiz = { questions, index: 0, score: 0, answered: false };
  const modal = document.querySelector("#quizModal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderQuizQuestion();
}

function closeQuiz() {
  document.querySelector("#quizModal").classList.add("hidden");
  document.querySelector("#quizModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentQuiz = null;
}

function renderQuizQuestion() {
  if (!currentQuiz) return;
  const total = currentQuiz.questions.length;
  const question = currentQuiz.questions[currentQuiz.index];
  document.querySelector("#quizTitle").textContent = "词汇小测";
  document.querySelector("#quizStep").textContent = `${currentQuiz.index + 1} / ${total}`;
  document.querySelector("#quizProgress").style.width = `${((currentQuiz.index + 1) / total) * 100}%`;
  document.querySelector("#quizPrompt").textContent = question.prompt;
  document.querySelector("#quizOptions").innerHTML = question.options.map((option, index) => `
    <button class="quiz-option" type="button" data-quiz-answer="${index}">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>
  `).join("");
  document.querySelector("#quizFeedback").textContent = "选择最贴近的中文释义";
  document.querySelector("#quizNext").classList.add("hidden");
  currentQuiz.answered = false;
}

function finishQuiz() {
  const total = currentQuiz.questions.length;
  document.querySelector("#quizStep").textContent = "完成";
  document.querySelector("#quizProgress").style.width = "100%";
  document.querySelector("#quizPrompt").textContent = `${currentQuiz.score} / ${total}`;
  document.querySelector("#quizOptions").innerHTML = "";
  document.querySelector("#quizFeedback").textContent = currentQuiz.score === total
    ? "全部答对。你已经把这些词握得很稳。"
    : "答错的词已放进“我的复习”，下一次会更熟悉。";
  const next = document.querySelector("#quizNext");
  next.textContent = "完成";
  next.classList.remove("hidden");
  next.dataset.finish = "true";
  updateSummary();
  renderWords();
}

function answerQuiz(index, button) {
  if (!currentQuiz || currentQuiz.answered) return;
  currentQuiz.answered = true;
  const question = currentQuiz.questions[currentQuiz.index];
  const correct = index === question.answer;
  const id = wordId(question.word);
  document.querySelectorAll(".quiz-option").forEach((option, optionIndex) => {
    option.disabled = true;
    if (optionIndex === question.answer) option.classList.add("correct");
  });
  if (!correct) button.classList.add("wrong");
  document.querySelector("#quizFeedback").textContent = correct
    ? "答对了。"
    : `正确释义：${question.word.meaning}`;

  setMembership("seen", id, true);
  setMembership(correct ? "known" : "review", id, true);
  setMembership(correct ? "review" : "known", id, false);
  if (correct) currentQuiz.score += 1;
  saveState();

  const next = document.querySelector("#quizNext");
  next.textContent = currentQuiz.index === currentQuiz.questions.length - 1 ? "查看结果" : "下一题";
  next.dataset.finish = "false";
  next.classList.remove("hidden");
}

function nextQuizQuestion() {
  if (!currentQuiz) return;
  const next = document.querySelector("#quizNext");
  if (next.dataset.finish === "true") {
    closeQuiz();
    return;
  }
  if (currentQuiz.index >= currentQuiz.questions.length - 1) {
    finishQuiz();
    return;
  }
  currentQuiz.index += 1;
  renderQuizQuestion();
}

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelector("#wordFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-word-filter]");
  if (!button) return;
  activeWordFilter = button.dataset.wordFilter;
  visibleWordCount = pageSize;
  document.querySelectorAll(".filter-tab").forEach((item) => item.classList.toggle("active", item === button));
  renderWords();
});

document.querySelector("#grammarFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-grammar-filter]");
  if (!button) return;
  activeGrammarFilter = button.dataset.grammarFilter;
  document.querySelectorAll(".grammar-filter").forEach((item) => item.classList.toggle("active", item === button));
  renderGrammarList();
});

document.querySelectorAll("[data-stage]").forEach((button) => {
  button.addEventListener("click", () => setStage(button.dataset.stage));
});

document.querySelector("#wordSearch").addEventListener("input", () => {
  visibleWordCount = pageSize;
  renderWords();
});

document.querySelector("#loadMoreWords").addEventListener("click", () => {
  visibleWordCount += pageSize;
  renderWords();
});

document.querySelector("#startToday").addEventListener("click", () => {
  activeWordFilter = "today";
  visibleWordCount = pageSize;
  document.querySelector("#wordSearch").value = "";
  document.querySelectorAll(".filter-tab").forEach((button) => button.classList.remove("active"));
  switchView("vocabulary");
  renderWords();
  document.querySelector("#vocabularyView").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#startVocabQuiz").addEventListener("click", () => openQuiz(getFilteredWords(), true));
document.querySelector("#reviewQuiz").addEventListener("click", () => {
  const reviewIds = new Set(studyState.review);
  const candidates = words.filter((word) => reviewIds.has(wordId(word)));
  if (candidates.length) openQuiz(candidates);
});

document.querySelector("#quizNext").addEventListener("click", nextQuizQuestion);
document.querySelectorAll("[data-close-quiz]").forEach((button) => button.addEventListener("click", closeQuiz));

document.addEventListener("click", (event) => {
  const accentButton = event.target.closest("[data-accent]");
  if (accentButton) {
    pronunciationAccent = accentButton.dataset.accent === "gb" ? "gb" : "us";
    localStorage.setItem(pronunciationKey, pronunciationAccent);
    window.speechSynthesis?.cancel();
    renderPronunciationControl();
  }

  const action = event.target.closest("[data-action]");
  const card = action?.closest(".word-card");
  if (action && card) handleWordAction(card, action.dataset.action, action);

  const grammarItem = event.target.closest("[data-grammar-id]");
  if (grammarItem) {
    selectedGrammarId = grammarItem.dataset.grammarId;
    renderGrammarList();
    if (window.matchMedia("(max-width: 680px)").matches) {
      document.querySelector("#grammarLesson").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const lessonAnswer = event.target.closest("[data-lesson-answer]");
  if (lessonAnswer) {
    const practice = lessonAnswer.closest(".lesson-practice");
    const topic = grammarTopics.find((item) => item.id === practice.dataset.topicId);
    if (!topic || practice.dataset.answered === "true") return;
    practice.dataset.answered = "true";
    const selected = Number(lessonAnswer.dataset.lessonAnswer);
    practice.querySelectorAll(".lesson-option").forEach((button, index) => {
      button.disabled = true;
      if (index === topic.answer) button.classList.add("correct");
    });
    if (selected !== topic.answer) lessonAnswer.classList.add("wrong");
    practice.querySelector(".lesson-feedback").textContent = selected === topic.answer
      ? `答对了。${topic.explanation}`
      : `再看一下知识要点。${topic.explanation}`;
    if (selected === topic.answer) {
      setMembership("grammarDone", topic.id, true);
      saveState();
      updateSummary();
      const check = document.querySelector(`[data-grammar-id="${topic.id}"] .grammar-check`);
      if (check) check.textContent = "✓";
    }
  }

  const quizAnswer = event.target.closest("[data-quiz-answer]");
  if (quizAnswer) answerQuiz(Number(quizAnswer.dataset.quizAnswer), quizAnswer);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#quizModal").classList.contains("hidden")) closeQuiz();
});

window.addEventListener("hashchange", () => {
  const requested = location.hash.replace("#", "");
  if (["vocabulary", "grammar", "review"].includes(requested)) switchView(requested, false);
});

refreshVoices();
if ("speechSynthesis" in window) window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
renderPronunciationControl();

setStage(activeStage, false);
const initialView = location.hash.replace("#", "");
switchView(["vocabulary", "grammar", "review"].includes(initialView) ? initialView : "vocabulary", false);
