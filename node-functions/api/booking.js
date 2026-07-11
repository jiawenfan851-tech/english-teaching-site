const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdarqzkb";
const REQUIRED_FIELDS = ["学生姓名", "家长姓名", "学生年级", "学习目标", "微信号", "希望试听日期", "希望试听时间段"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function cleanFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => typeof key === "string" && key.length <= 40)
      .map(([key, fieldValue]) => [key, String(fieldValue ?? "").trim().slice(0, 1200)])
  );
}

export async function onRequestPost({ request }) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20_000) return json({ ok: false, message: "提交内容过长" }, 413);

    const body = await request.json();
    const fields = cleanFields(body?.fields);
    if (fields._gotcha) return json({ ok: true });

    const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
    if (missing.length) return json({ ok: false, message: `请填写：${missing.join("、")}` }, 400);

    const upstream = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        ...fields,
        subject: "新的英语课程预约",
        预约详情: String(body?.details || "").slice(0, 6000),
        提交来源: "Bright English 国内预约接口",
        服务器接收时间: new Date().toISOString()
      })
    });

    if (!upstream.ok) {
      console.error("Booking delivery failed", upstream.status, await upstream.text());
      return json({ ok: false, message: "预约暂未送达" }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Booking request failed", error);
    return json({ ok: false, message: "预约提交失败" }, 500);
  }
}

export function onRequestGet() {
  return json({ ok: false, message: "Method not allowed" }, 405);
}
