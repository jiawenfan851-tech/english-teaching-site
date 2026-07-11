(function () {
  "use strict";

  const FORM = document.querySelector("#contactForm");
  const STATUS = document.querySelector("#bookingStatus");
  if (!FORM || !STATUS) return;

  const submitButton = FORM.querySelector('button[type="submit"]');
  const trialDate = FORM.elements.namedItem("希望试听日期");
  const wechat = FORM.elements.namedItem("微信号");
  const optionalContact = FORM.elements.namedItem("联系电话或邮箱");
  const domesticEndpoint = (FORM.dataset.bookingEndpoint || "").trim();
  const teacherEmail = "jiawenfan851@gmail.com";
  const originalButtonText = submitButton?.textContent || "发送预约";
  let isSubmitting = false;

  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function setMinimumTrialDate() {
    if (trialDate) trialDate.min = getLocalDateString(new Date());
  }

  function exceedsMaxLength(field) {
    return field.maxLength > 0 && field.value.length > field.maxLength;
  }

  function validateWechat() {
    if (!wechat) return true;
    let message = "";
    if (!wechat.value.trim()) message = "请填写微信号。";
    else if (exceedsMaxLength(wechat)) message = `微信号不能超过 ${wechat.maxLength} 个字符。`;
    wechat.setCustomValidity(message);
    return !message;
  }

  function validateOptionalContact() {
    if (!optionalContact) return true;
    const value = optionalContact.value.trim();
    let message = "";
    if (exceedsMaxLength(optionalContact)) {
      message = `联系电话或邮箱不能超过 ${optionalContact.maxLength} 个字符。`;
    } else if (value) {
      const phone = value.replace(/[ -]/g, "");
      const isPhone = /^(?:\+?86)?1[3-9]\d{9}$/.test(phone);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isPhone && !isEmail) message = "请输入有效的手机号码或邮箱地址，也可以留空。";
    }
    optionalContact.setCustomValidity(message);
    return !message;
  }

  function showStatus(message, state) {
    STATUS.className = `booking-status booking-status--${state}`;
    STATUS.textContent = message;
  }

  function bookingDetails() {
    const ignored = new Set(["subject", "_gotcha", "信息使用确认"]);
    const lines = ["Bright English 试听预约", ""];
    new FormData(FORM).forEach((value, key) => {
      if (!ignored.has(key) && String(value).trim()) lines.push(`${key}：${String(value).trim()}`);
    });
    lines.push("", `提交时间：${new Date().toLocaleString("zh-CN")}`);
    return lines.join("\n");
  }

  async function copyDetails(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function submitToDomesticEndpoint(details) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(domesticEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ details, fields: Object.fromEntries(new FormData(FORM)) }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Domestic booking endpoint failed");
      return true;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function openEmailDraft(details) {
    const copied = await copyDetails(details);
    const subject = encodeURIComponent("新的英语课程预约");
    const body = encodeURIComponent(details);
    window.location.href = `mailto:${teacherEmail}?subject=${subject}&body=${body}`;
    showStatus(
      copied
        ? "预约信息已复制，并已尝试打开邮件应用。请在邮件中点击发送；若没有打开，可直接把已复制的信息粘贴到常用邮箱。"
        : "已尝试打开邮件应用，请在邮件中点击发送。",
      "success"
    );
  }

  setMinimumTrialDate();
  wechat?.addEventListener("input", validateWechat);
  optionalContact?.addEventListener("input", validateOptionalContact);

  FORM.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !submitButton) return;
    if (!validateWechat() || !validateOptionalContact() || !FORM.checkValidity()) {
      FORM.reportValidity();
      return;
    }

    const details = bookingDetails();
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = domesticEndpoint ? "正在提交……" : "正在整理……";
    showStatus(domesticEndpoint ? "正在提交，请稍候……" : "正在生成预约邮件……", "pending");

    try {
      if (domesticEndpoint) {
        await submitToDomesticEndpoint(details);
        FORM.reset();
        setMinimumTrialDate();
        showStatus("试听申请已提交，老师查看后会与你联系确认时间。", "success");
      } else {
        await openEmailDraft(details);
      }
    } catch (_) {
      await openEmailDraft(details);
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
})();
