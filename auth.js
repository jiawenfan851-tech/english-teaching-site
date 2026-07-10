(function () {
  const USERNAME = "wjwjwj";
  const PASSWORD_HASH = "6373d1dd805508029864d096c809d826a69de402e0bbd71c1f0c6e458fecf63e";
  const SESSION_KEY = "brightTeacherSessionV2";
  const SESSION_LENGTH = 8 * 60 * 60 * 1000;

  async function hash(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function verify(username, password) {
    if (username.trim() !== USERNAME || !window.crypto?.subtle) return false;
    return (await hash(password)) === PASSWORD_HASH;
  }

  function startSession() {
    localStorage.removeItem("teacherLoggedIn");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt: Date.now() + SESSION_LENGTH }));
  }

  function isSessionActive() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (session?.expiresAt > Date.now()) return true;
    } catch (_) {
      // Invalid sessions are cleared below.
    }
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("teacherLoggedIn");
    return false;
  }

  function endSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("teacherLoggedIn");
  }

  window.TeacherAuth = { verify, startSession, isSessionActive, endSession };
})();
