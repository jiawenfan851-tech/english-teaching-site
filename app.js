const teacherAccount = {
  username: "wjwjwj",
  password: "wj123"
};

const loginOpenButton = document.querySelector("#loginOpen");
const footerLoginOpenButton = document.querySelector("#footerLoginOpen");
const loginModal = document.querySelector("#loginModal");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

function openLoginModal() {
  loginModal.classList.remove("hidden");
  loginModal.setAttribute("aria-hidden", "false");
  loginError.textContent = "";
  loginForm.reset();
  setTimeout(() => usernameInput.focus(), 0);
}

function closeLoginModal() {
  loginModal.classList.add("hidden");
  loginModal.setAttribute("aria-hidden", "true");
}

function enterTeacherDashboard() {
  localStorage.setItem("teacherLoggedIn", "true");
  window.location.href = "./teacher.html";
}

loginOpenButton.addEventListener("click", openLoginModal);
footerLoginOpenButton.addEventListener("click", openLoginModal);

document.querySelectorAll("[data-close-login]").forEach((button) => {
  button.addEventListener("click", closeLoginModal);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === teacherAccount.username && password === teacherAccount.password) {
    enterTeacherDashboard();
    return;
  }

  loginError.textContent = "账号或密码不正确，请重新输入。";
  passwordInput.value = "";
  passwordInput.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !loginModal.classList.contains("hidden")) {
    closeLoginModal();
  }
});
