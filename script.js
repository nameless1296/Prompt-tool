const ENABLE_PRESET = false;
if(ENABLE_PRESET){
  document.getElementById("presetUI").style.display = "inline-block";
}

function warnClick(){
  showModal("This is not an input box 😏");
}

// ===== data =====
const pool = {
  style,
  headwear,
  topwear,
  bottom,  
  footwear,  
  detail,  
  headaccessory,  
  neckaccessory,
  limbaccessory,
  torsoaccessory,  
  lighting,
};

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
  if(!ENABLE_PRESET) return;

  currentPreset = name;

  const btn = document.getElementById("presetBtn");
  if(btn){
    document.getElementById("presetLabel").innerText =
      "Preset: " + name.charAt(0).toUpperCase() + name.slice(1);
  }

  const items = document.querySelectorAll("#dropdownMenu div");

  items.forEach(item => {
    item.classList.remove("active");
    if(item.dataset.value === name){
      item.classList.add("active");
    }
  });

  setFeedback("Preset: " + name);

  document.getElementById("dropdownMenu")?.classList.add("hidden");
}

function toggleDropdown(){
  if(!ENABLE_PRESET) 
  showModal("Under development 🚧"); 
  return;
  document.getElementById("dropdownMenu")?.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  setPreset("random");
});

// ==========================
// GENERATE
// ==========================
function gen(){

  const p = null;
  const s = p ? p.style : pick("style");
  const h = p ? pickArray(p.headwear) : pick("headwear");
  const t = p ? pickArray(p.topwear) : pick("topwear");
  let b = p ? pickArray(p.bottom) : pick("bottom");

  if(isFullBody(t)){
    b = null;
  }

  const f = p ? pickArray(p.footwear) : pick("footwear");
  const d = p ? pickArray(p.detail) : pick("detail");
  const ha = p ? pickArray(p.headaccessory) : pick("headaccessory");
  const na = p ? pickArray(p.neckaccessory) : pick("neckaccessory");
  const la = p ? pickArray(p.limbaccessory) : pick("limbaccessory");
  const ta = p ? pickArray(p.torsoaccessory) : pick("torsoaccessory");
  const l = p ? pickArray(p.lighting) : pick("lighting");

  const display = [
    s ? `style: ${s}` : null,
    h ? `headwear: ${h}` : null,
    t ? `top: ${t}` : null,
    b ? `bottom: ${b}` : null,
    f ? `footwear: ${f}` : null,
    d ? `detail: ${d}` : null,
    ha ? `head accessory: ${ha}` : null,
	na ? `neck and shoulder accessory: ${na}` : null,
    la ? `limb accessory: ${la}` : null,
    ta ? `torso and misc accessory: ${ta}` : null,
    l ? `lighting: ${l}` : null,
    "",
    "masterpiece, best quality"
  ].filter(Boolean).join("\n");

  document.getElementById("out").innerText = display;

  cleanPrompt = [
    s, h, t, b, f, d, ha, na, la, ta, l,
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
  if(!ENABLE_PRESET) return;
  setPreset("random");
});