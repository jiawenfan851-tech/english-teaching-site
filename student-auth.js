(function () {
  "use strict";

  const USERNAME = "FJW";
  const PASSWORD_HASH = "8da7a8df9fdb542be178db5709e7bae88f44fa059332ff681d85066816fa3e66";
  const SESSION_KEY = "brightStudentSessionV1";
  const SESSION_LENGTH = 12 * 60 * 60 * 1000;

  async function hash(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function verify(username, password) {
    if (username.trim() !== USERNAME || !window.crypto?.subtle) {
      return false;
    }
    return (await hash(password)) === PASSWORD_HASH;
  }

  function startSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username: USERNAME,
      expiresAt: Date.now() + SESSION_LENGTH
    }));
  }

  function getSession() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (session?.username === USERNAME && session.expiresAt > Date.now()) {
        return session;
      }
    } catch (_) {
      // Invalid sessions are cleared below.
    }
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }

  function isSessionActive() {
    return Boolean(getSession());
  }

  function endSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  window.StudentAuth = { verify, startSession, getSession, isSessionActive, endSession };
})();
