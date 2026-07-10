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

loginOpenButton?.addEventListener("click", openLoginModal);
footerLoginOpenButton?.addEventListener("click", openLoginModal);
document.querySelectorAll("[data-close-login]").forEach((button) => button.addEventListener("click", closeLoginModal));

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (await window.TeacherAuth.verify(usernameInput.value, passwordInput.value)) {
    window.TeacherAuth.startSession();
    window.location.href = "./teacher.html";
    return;
  }
  loginError.textContent = "账号或密码不正确，请重新输入。";
  passwordInput.value = "";
  passwordInput.focus();
});
