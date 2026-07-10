(function () {
  "use strict";

  const FORM = document.querySelector("#contactForm");
  const STATUS = document.querySelector("#bookingStatus");

  if (!FORM || !STATUS) {
    return;
  }

  const submitButton = FORM.querySelector('button[type="submit"]');
  const trialDate = FORM.elements.namedItem("希望试听日期");
  const wechat = FORM.elements.namedItem("微信号");
  const optionalContact = FORM.elements.namedItem("联系电话或邮箱");
  const originalButtonText = submitButton ? submitButton.textContent : "";
  const fallbackEmail = "mailto:jiawenfan851@gmail.com?subject=英语课程预约咨询";
  const submitEndpoint = FORM.dataset.ajaxEndpoint || FORM.action;
  let isSubmitting = false;

  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function setMinimumTrialDate() {
    if (trialDate) {
      trialDate.min = getLocalDateString(new Date());
    }
  }

  function exceedsMaxLength(field) {
    return field.maxLength > 0 && field.value.length > field.maxLength;
  }

  function validateWechat() {
    if (!wechat) {
      return true;
    }

    let message = "";
    if (!wechat.value.trim()) {
      message = "请填写微信号。";
    } else if (exceedsMaxLength(wechat)) {
      message = `微信号不能超过 ${wechat.maxLength} 个字符。`;
    }

    wechat.setCustomValidity(message);
    return !message;
  }

  function validateOptionalContact() {
    if (!optionalContact) {
      return true;
    }

    const originalValue = optionalContact.value;
    const trimmedValue = originalValue.trim();
    let message = "";

    if (exceedsMaxLength(optionalContact)) {
      message = `联系电话或邮箱不能超过 ${optionalContact.maxLength} 个字符。`;
    } else if (trimmedValue) {
      const compactPhone = trimmedValue.replace(/[ -]/g, "");
      const isPhone = /^(?:\+?86)?1[3-9]\d{9}$/.test(compactPhone);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);

      if (!isPhone && !isEmail) {
        message = "请输入有效的手机号码或邮箱地址，也可以留空。";
      }
    }

    optionalContact.setCustomValidity(message);
    return !message;
  }

  function validateCustomFields() {
    const isWechatValid = validateWechat();
    const isContactValid = validateOptionalContact();
    return isWechatValid && isContactValid;
  }

  function hasExplicitFailure(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return false;
    }

    if (payload.success === false || payload.success === "false") {
      return true;
    }

    if (payload.error) {
      return true;
    }

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      return true;
    }

    const status = String(payload.status || "").trim().toLowerCase();
    return ["error", "failed", "failure"].includes(status);
  }

  function showStatus(message, state, includeEmailLink) {
    STATUS.className = `booking-status booking-status--${state}`;
    STATUS.textContent = message;

    if (includeEmailLink) {
      STATUS.append(" ");
      const link = document.createElement("a");
      link.href = fallbackEmail;
      link.textContent = "邮件联系老师";
      STATUS.append(link);
    }
  }

  setMinimumTrialDate();
  if (wechat) {
    wechat.addEventListener("input", validateWechat);
  }
  if (optionalContact) {
    optionalContact.addEventListener("input", validateOptionalContact);
  }

  if (
    typeof window.fetch !== "function" ||
    typeof window.FormData !== "function" ||
    typeof window.AbortController !== "function"
  ) {
    return;
  }

  if (!submitButton) {
    return;
  }

  FORM.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting || submitButton.disabled) {
      return;
    }

    if (!validateCustomFields() || !FORM.checkValidity()) {
      FORM.reportValidity();
      return;
    }

    let timeoutId = null;

    try {
      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.textContent = "正在提交……";
      showStatus("正在提交，请稍候……", "pending", false);

      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 15000);

      const response = await window.fetch(submitEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new FormData(FORM),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = new Error("HTTP response was not successful");
        error.kind = "http";
        throw error;
      }

      let payload = null;
      try {
        payload = await response.json();
      } catch (_) {
        payload = null;
      }

      if (hasExplicitFailure(payload)) {
        const error = new Error("Submission service returned an explicit failure");
        error.kind = "explicit";
        throw error;
      }

      FORM.reset();
      setMinimumTrialDate();
      showStatus(
        "试听申请已提交，这不代表上课时间已经确认。老师查看时间安排后会通过微信或其他联系方式与你联系。",
        "success",
        false
      );
    } catch (error) {
      if (error && error.name === "AbortError") {
        showStatus(
          "等待响应超时，暂时无法确认是否提交成功。请不要连续重复提交，可稍后通过邮件联系老师确认。",
          "uncertain",
          true
        );
      } else if (error && (error.kind === "http" || error.kind === "explicit")) {
        showStatus(
          "试听申请暂未提交成功，请稍后重试，或通过邮件联系老师。",
          "error",
          true
        );
      } else {
        showStatus(
          "网络异常，暂时无法确认是否提交成功。请检查网络后再操作，或通过邮件联系老师确认。",
          "uncertain",
          true
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
})();
