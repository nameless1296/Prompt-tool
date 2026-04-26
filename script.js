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

// ===== PRESETS =====
const presets = {
  random: null,

  cyberpunk: {
    style: "cyberpunk",
    topwear: ["tech jacket","hoodie","neon corset"],
    bottom: ["cargo pants","tech skirt"],
    footwear: ["boots","sneakers"],
    detail: ["glow lines","holographic"],
    accessory: ["visor","choker"],
    lighting: ["neon lighting"]
  },

  gothic: {
    style: "gothic",
    topwear: ["corset","lace dress"],
    bottom: ["long skirt","black jeans"],
    footwear: ["boots"],
    detail: ["dark lace"],
    accessory: ["choker","veil"],
    lighting: ["moody lighting"]
  }
};

let currentPreset = "random";

// ===== tools =====
function pick(key){
  const arr = pool[key];
  const val = arr[Math.floor(Math.random() * arr.length)];
  return val === "none" ? null : val;
}

function pickArray(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== MODE =====
let cleanPrompt = "";
let afterClick = false;
let copyMode = "clean";

// ==========================
// FEEDBACK
// ==========================
let feedbackTimer;

function setFeedback(msg, type = "info"){

  const fb = document.getElementById("feedback");
  if(!fb) return;

  fb.innerText = msg;

  if(type === "success") fb.style.color = "#00ffcc";
  else if(type === "error") fb.style.color = "#ff4d4d";
  else fb.style.color = "#00f5ff";

  clearTimeout(feedbackTimer);

  feedbackTimer = setTimeout(() => {
    fb.innerText = "";
  }, 1500);
}

// ==========================
// MODAL
// ==========================
let modalTimer;

function showModal(msg, duration = 1500){

  const modal = document.getElementById("modal");
  const text = document.getElementById("modal-text");

  if(!modal || !text) return;

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
// PRESET
// ==========================
function setPreset(name){

  currentPreset = name;

  const btn = document.getElementById("presetBtn");
  if(btn){
    btn.innerText = "Preset: " + name.charAt(0).toUpperCase() + name.slice(1) + " ▼";
  }

  const items = document.querySelectorAll("#dropdownMenu div");

  items.forEach(item => {
    item.classList.remove("active");
    if(item.dataset.value === name){
      item.classList.add("active");
    }
  });

  setFeedback("Preset: " + name);

  const menu = document.getElementById("dropdownMenu");
  if(menu){
    menu.classList.add("hidden");
  }
}

function toggleDropdown(){
  const menu = document.getElementById("dropdownMenu");
  if(menu){
    menu.classList.toggle("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setPreset("random");
});

// ==========================
// GENERATE
// ==========================
function gen(){

  const p = presets[currentPreset];

  const s = p ? p.style : pick("style");
  const t = p ? pickArray(p.topwear) : pick("topwear");
  const b = p ? pickArray(p.bottom) : pick("bottom");
  const f = p ? pickArray(p.footwear) : pick("footwear");
  const d = p ? pickArray(p.detail) : pick("detail");
  const a = p ? pickArray(p.accessory) : pick("accessory");
  const l = p ? pickArray(p.lighting) : pick("lighting");

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
  if(!afterClick){
    btn.innerText = "Reroll";
    afterClick = true;
  }

  setFeedback("Generate successful ✓", "success");
}

// ==========================
// MODE SWITCH
// ==========================
function toggleMode(){

  copyMode = copyMode === "clean" ? "labeled" : "clean";

  const btn = document.getElementById("modeBtn");
  if(!btn) return;

  btn.innerText = copyMode === "clean"
    ? "Mode: Simplified"
    : "Mode: Labelled";

  btn.classList.remove("clean", "label");
  btn.classList.add(copyMode === "clean" ? "clean" : "label");

  setFeedback("Mode switched");
}

// ==========================
// COPY
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

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("modeBtn");

  if(btn){
    btn.classList.add("clean");
    btn.innerText = "Mode: Simplified";
  }
});