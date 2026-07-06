if (localStorage.getItem("teacherLoggedIn") !== "true") {
  window.location.replace("./index.html");
}

const logoutButton = document.querySelector("#logoutButton");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("teacherLoggedIn");
  window.location.href = "./index.html";
});
