function warnClick(){
  showModal("This is not an input box 😏");
}

// ===== data =====
const pool = {
  style: ["cyberpunk","gothic","streetwear"],
  topwear: ["hoodie","corset","jacket"],
  bottom: ["miniskirt","jeans","shorts"],
  footwear: ["boots","sneakers","heels"],
  detail: ["unzipped","tight clothes","layered outfit","none"],
  accessory: ["choker","gloves","belt","none"],
  lighting: ["neon lighting","soft lighting","cinematic lighting","none"]
};

// ===== tool function =====
function pick(key){
  const arr = pool[key];
  const val = arr[Math.floor(Math.random()*arr.length)];
  return val === "none" ? null : val;
}

// ===== MODE =====
let cleanPrompt = "";
let afterClick = false;
let copyMode = "clean";

// ==========================
// 🟢 FEEDBACK(inform)
// ==========================
function setFeedback(msg, type = "info"){

  const fb = document.getElementById("feedback");
  if(!fb) return;

  fb.innerText = msg;

  if(type === "success"){
    fb.style.color = "#00ffcc";
  } else if(type === "error"){
    fb.style.color = "#ff4d4d";
  } else {
    fb.style.color = "#00f5ff";
  }

  clearTimeout(feedbackTimer);

  feedbackTimer = setTimeout(() => {
    fb.innerText = "";
  }, 1500);
}

// ==========================
// 🟣 MODAL(alert)
// ==========================
let modalTimer;

function showModal(msg, duration = 1500){

  const modal = document.getElementById("modal");
  const text = document.getElementById("modal-text");

  text.innerText = msg;

  modal.classList.remove("hidden");
  modal.style.animation = "none";
  void modal.offsetWidth;
  modal.style.animation = "slideDown 0.25s ease";

  clearTimeout(modalTimer);

  modalTimer = setTimeout(() => {
    modal.classList.add("hidden");
  }, duration);
}

// ==========================
// 🎲 GENERATE
// ==========================
function gen(){

  const s = pick("style");
  const t = pick("topwear");
  const b = pick("bottom");
  const f = pick("footwear");
  const d = pick("detail");
  const a = pick("accessory");
  const l = pick("lighting");

  const display = [
    s ? `style: ${s}` : null,
    t ? `top: ${t}` : null,
    b ? `bottom: ${b}` : null,
    f ? `footwear: ${f}` : null,
    d ? `detail: ${d}` : null,
    a ? `accessory: ${a}` : null,
    l ? `lighting: ${l}` : null,
    "",
    "masterpiece, best quality"
  ].filter(Boolean).join("\n");

  document.getElementById("out").innerText = display;

  cleanPrompt = [
    s, t, b, f, d, a, l,
    "masterpiece",
    "best quality"
  ].filter(Boolean).join(", ");

  const btn = document.getElementById("genBtn");
  if (!afterClick) {
    btn.innerText = "Reroll";
    afterClick = true;
  }

  setFeedback("Generate successful ✓", "success");
}

// ==========================
// 🔁 MODE SWITCH
// ==========================
function toggleMode(){

  copyMode = copyMode === "clean" ? "labeled" : "clean";

  const btn = document.getElementById("modeBtn");

  btn.innerText = copyMode === "clean"
    ? "Copy: Clean"
    : "Copy: Labeled";
	
  setFeedback("Mode switched");
}

// ==========================
// 📋 COPY
// ==========================
function copyText(){

  if(!cleanPrompt){
    showModal("Please generate first");
    return;
  }

  const text = copyMode === "clean"
    ? cleanPrompt
    : document.getElementById("out").innerText;

  navigator.clipboard.writeText(text)
    .then(() => showModal("Copied ✓"))
    .catch(() => showModal("Copy failed"));
}