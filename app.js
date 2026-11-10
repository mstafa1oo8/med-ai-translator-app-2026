const sourceText = document.getElementById("sourceText");
const resultText = document.getElementById("resultText");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const statusBox = document.getElementById("status");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const task = document.getElementById("task");

sourceText.addEventListener("input", () => {
  document.getElementById("charCount").textContent = `${sourceText.value.length} / 12000`;
});

document.getElementById("swapBtn").addEventListener("click", () => {
  const oldSource = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = oldSource;
});

translateBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();
  if (!text) {
    statusBox.textContent = "اكتب النص الطبي أولاً.";
    statusBox.className = "status error";
    sourceText.focus();
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = "جارٍ العمل...";
  statusBox.textContent = "يتم تحليل النص وإعداده...";
  statusBox.className = "status";
  resultText.textContent = "";
  copyBtn.disabled = true;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        sourceLang: sourceLang.value,
        targetLang: targetLang.value,
        task: task.value
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "حدث خطأ غير متوقع.");
    resultText.textContent = data.result;
    statusBox.textContent = "اكتملت العملية.";
    copyBtn.disabled = false;
  } catch (error) {
    statusBox.textContent = error.message || "تعذر الاتصال بالخادم.";
    statusBox.className = "status error";
    resultText.textContent = "لم تكتمل العملية.";
  } finally {
    translateBtn.disabled = false;
    translateBtn.innerHTML = "<span>✦</span> ابدأ الترجمة";
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    statusBox.textContent = "تم نسخ النتيجة.";
    statusBox.className = "status";
  } catch {
    statusBox.textContent = "تعذر النسخ تلقائياً. حدّد النتيجة وانسخها يدوياً.";
    statusBox.className = "status error";
  }
});
