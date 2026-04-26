function warnClick(){
  alert("这不是文本输入框 😏");
}

// ===== 数据 =====
const pool = {
  style: ["cyberpunk","gothic","streetwear"],
  topwear: ["hoodie","corset","jacket"],
  bottom: ["miniskirt","jeans","shorts"],
  footwear: ["boots","sneakers","heels"],
  detail: ["unzipped","tight clothes","layered outfit","none"],
  accessory: ["choker","gloves","belt","none"],
  lighting: ["neon lighting","soft lighting","cinematic lighting","none"]
};

// ===== 工具函数 =====
function pick(key){
  const arr = pool[key];
  const val = arr[Math.floor(Math.random()*arr.length)];
  return val === "none" ? null : val;   // 🔥 none 直接变空
}

// ===== 状态 =====
let cleanPrompt = "";
let afterClick = false;

// ===== 主生成函数 =====
function gen(){

  const s = pick("style");
  const t = pick("topwear");
  const b = pick("bottom");
  const f = pick("footwear");
  const d = pick("detail");
  const a = pick("accessory");
  const l = pick("lighting");

  // ===== 显示版 =====
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

  // ===== clean prompt（AI用）=====
  cleanPrompt = [
    s,
    t,
    b,
	f,
    d,
    a,
    l,
    "masterpiece",
    "best quality"
  ].filter(Boolean).join(", ");

  // ===== afterClick 按钮状态 =====
  const btn = document.getElementById("genBtn");

  if (!afterClick) {
    btn.innerText = "Reroll";
    afterClick = true;
  }
}

// ===== 复制 =====
function copyText(){
  navigator.clipboard.writeText(cleanPrompt)
    .then(() => alert("已复制"))
    .catch(() => alert("复制失败"));
}