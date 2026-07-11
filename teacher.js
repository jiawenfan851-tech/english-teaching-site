if (!window.TeacherAuth?.isSessionActive()) {
  window.location.replace("./index.html#teacher");
} else {

const STORAGE_KEY = "brightTeacherWorkspaceV2";
const statusLabels = {
  scheduled: "待上课",
  completed: "已完成",
  cancelled: "已取消",
  new: "待联系",
  active: "在读",
  paused: "暂停"
};

const $ = (selector) => document.querySelector(selector);
const today = new Date();
const todayIso = toLocalIso(today);
let workspace = loadWorkspace();
let toastTimer;

function toLocalIso(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function createId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadWorkspace() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved?.courses) && Array.isArray(saved?.students) && Array.isArray(saved?.tasks)) return saved;
  } catch (_) {
    // A fresh workspace is safer than partially loading damaged data.
  }
  return { courses: [], students: [], tasks: [] };
}

function saveWorkspace(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  renderWorkspace();
  if (message) showToast(message);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function formatDate(value) {
  if (!value) return "未设日期";
  const date = new Date(`${value}T00:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function renderWorkspace() {
  $("#workspaceDate").textContent = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(today);
  $("#todayCourseCount").textContent = workspace.courses.filter((course) => course.date === todayIso && course.status !== "cancelled").length;
  $("#activeStudentCount").textContent = workspace.students.filter((student) => student.status === "active").length;
  $("#openTaskCount").textContent = workspace.tasks.filter((task) => !task.done).length;
  renderCourses();
  renderStudents();
  renderTasks();
}

function renderCourses() {
  const courses = [...workspace.courses].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  $("#courseTotal").textContent = `${courses.length} 条记录`;
  $("#courseList").innerHTML = courses.length ? courses.map((course) => `
    <article class="data-row">
      <div><span class="row-time">${formatDate(course.date)} ${escapeHtml(course.time)}</span><p>${escapeHtml(course.level)}</p></div>
      <div><h3>${escapeHtml(course.student)}</h3><p>${escapeHtml(course.topic)}</p></div>
      <span class="status ${escapeHtml(course.status)}">${statusLabels[course.status] || "待上课"}</span>
      <div class="row-actions">
        <button class="button compact" type="button" data-edit-course="${course.id}">编辑</button>
        <button class="button compact danger" type="button" data-delete-course="${course.id}">删除</button>
      </div>
    </article>`).join("") : '<div class="empty-row">暂无课程安排</div>';
}

function renderStudents() {
  const rank = { new: 0, active: 1, paused: 2 };
  const students = [...workspace.students].sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
  $("#studentTotal").textContent = `${students.length} 位学生`;
  $("#studentList").innerHTML = students.length ? students.map((student) => `
    <article class="data-row">
      <div><h3>${escapeHtml(student.name)}</h3><p>${escapeHtml(student.grade)}</p></div>
      <div><p>${escapeHtml(student.goal || "未记录学习目标")}</p></div>
      <div><span class="status ${escapeHtml(student.status)}">${statusLabels[student.status] || "待联系"}</span><p>${escapeHtml(student.wechat || "未记录微信号")}</p></div>
      <div class="row-actions">
        <button class="button compact" type="button" data-edit-student="${student.id}">编辑</button>
        <button class="button compact danger" type="button" data-delete-student="${student.id}">删除</button>
      </div>
    </article>`).join("") : '<div class="empty-row">暂无学生档案</div>';
}

function renderTasks() {
  const tasks = [...workspace.tasks].sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  $("#taskTotal").textContent = `${tasks.filter((task) => !task.done).length} 项未完成`;
  $("#taskList").innerHTML = tasks.length ? tasks.map((task) => `
    <article class="data-row task-row ${task.done ? "done" : ""}">
      <input class="task-check" type="checkbox" ${task.done ? "checked" : ""} data-toggle-task="${task.id}" aria-label="标记待办完成" />
      <div><h3>${escapeHtml(task.title)}</h3></div>
      <div><span class="status scheduled">${escapeHtml(task.type)}</span><p>${task.dueDate ? `截止 ${formatDate(task.dueDate)}` : "无截止日期"}</p></div>
      <div class="row-actions">
        <button class="button compact" type="button" data-edit-task="${task.id}">编辑</button>
        <button class="button compact danger" type="button" data-delete-task="${task.id}">删除</button>
      </div>
    </article>`).join("") : '<div class="empty-row">暂无教学待办</div>';
}

function openDialog(id, item) {
  const dialog = document.getElementById(id);
  const form = dialog.querySelector("form");
  form.reset();
  if (id === "courseDialog") {
    $("#courseId").value = item?.id || "";
    $("#courseDate").value = item?.date || todayIso;
    $("#courseTime").value = item?.time || "18:00";
    $("#courseStudent").value = item?.student || "";
    $("#courseLevel").value = item?.level || "初中";
    $("#courseTopic").value = item?.topic || "";
    $("#courseStatus").value = item?.status || "scheduled";
  }
  if (id === "studentDialog") {
    $("#studentId").value = item?.id || "";
    $("#studentName").value = item?.name || "";
    $("#studentGrade").value = item?.grade || "初中";
    $("#studentWechat").value = item?.wechat || "";
    $("#studentStatus").value = item?.status || "new";
    $("#studentGoal").value = item?.goal || "";
  }
  if (id === "taskDialog") {
    $("#taskId").value = item?.id || "";
    $("#taskTitle").value = item?.title || "";
    $("#taskDueDate").value = item?.dueDate || "";
    $("#taskType").value = item?.type || "备课";
  }
  dialog.showModal();
  setTimeout(() => dialog.querySelector("input:not([type=hidden]), select")?.focus(), 0);
}

function upsert(collection, item) {
  const index = collection.findIndex((entry) => entry.id === item.id);
  if (index >= 0) collection[index] = item;
  else collection.push(item);
}

$("#courseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  upsert(workspace.courses, {
    id: $("#courseId").value || createId(), date: $("#courseDate").value, time: $("#courseTime").value,
    student: $("#courseStudent").value.trim(), level: $("#courseLevel").value,
    topic: $("#courseTopic").value.trim(), status: $("#courseStatus").value
  });
  $("#courseDialog").close();
  saveWorkspace("课程已保存");
});

$("#studentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  upsert(workspace.students, {
    id: $("#studentId").value || createId(), name: $("#studentName").value.trim(), grade: $("#studentGrade").value,
    wechat: $("#studentWechat").value.trim(), status: $("#studentStatus").value, goal: $("#studentGoal").value.trim()
  });
  $("#studentDialog").close();
  saveWorkspace("学生档案已保存");
});

$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const previous = workspace.tasks.find((task) => task.id === $("#taskId").value);
  upsert(workspace.tasks, {
    id: $("#taskId").value || createId(), title: $("#taskTitle").value.trim(), dueDate: $("#taskDueDate").value,
    type: $("#taskType").value, done: previous?.done || false
  });
  $("#taskDialog").close();
  saveWorkspace("待办已保存");
});

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-dialog]");
  if (openButton) openDialog(openButton.dataset.openDialog);
  if (event.target.closest("[data-close-dialog]")) event.target.closest("dialog")?.close();

  const actions = [
    ["editCourse", "courses", "courseDialog"], ["editStudent", "students", "studentDialog"], ["editTask", "tasks", "taskDialog"]
  ];
  actions.forEach(([key, collection, dialog]) => {
    const id = event.target.closest(`[data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}]`)?.dataset[key];
    if (id) openDialog(dialog, workspace[collection].find((item) => item.id === id));
  });

  [["deleteCourse", "courses"], ["deleteStudent", "students"], ["deleteTask", "tasks"]].forEach(([key, collection]) => {
    const selector = `[data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}]`;
    const id = event.target.closest(selector)?.dataset[key];
    if (id && window.confirm("确定删除这条记录吗？")) {
      workspace[collection] = workspace[collection].filter((item) => item.id !== id);
      saveWorkspace("记录已删除");
    }
  });
});

document.addEventListener("change", (event) => {
  const id = event.target.dataset.toggleTask;
  if (!id) return;
  const task = workspace.tasks.find((item) => item.id === id);
  if (task) {
    task.done = event.target.checked;
    saveWorkspace(task.done ? "待办已完成" : "待办已恢复");
  }
});

$("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), ...workspace }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `bright-english-backup-${todayIso}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("备份已导出");
});

$("#importData").addEventListener("click", () => $("#importFile").click());
$("#copyBookingEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("jiawenfan851@gmail.com");
    showToast("预约邮箱已复制");
  } catch (_) {
    window.prompt("预约邮箱", "jiawenfan851@gmail.com");
  }
});
$("#importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (![imported.courses, imported.students, imported.tasks].every(Array.isArray)) throw new Error("invalid");
    if (!window.confirm("导入会替换当前工作台数据，确定继续吗？")) return;
    workspace = { courses: imported.courses, students: imported.students, tasks: imported.tasks };
    saveWorkspace("备份已导入");
  } catch (_) {
    showToast("无法读取这个备份文件");
  } finally {
    event.target.value = "";
  }
});

$("#logoutButton").addEventListener("click", () => {
  window.TeacherAuth.endSession();
  window.location.href = "./index.html";
});

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
}

renderWorkspace();
}
