// Shared helpers for all pages.
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ICONS = {
  logo: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  send: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="m6 3 14 9-14 9z"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  alert: '<path d="m10.3 3.9-8.2 14A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-3.1l-8.2-14a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  sheet: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  columns: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  envelope: '<rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="m3 6 9 7 9-7"/>',
  stamp: '<path d="M5 3h14v18H5z"/><path d="M5 7h-1M5 11h-1M5 15h-1M20 7h-1M20 11h-1M20 15h-1"/><circle cx="12" cy="11" r="3"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  "external": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  note: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  branch: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  pr: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/>',
  commit: '<circle cx="12" cy="12" r="4"/><path d="M1.05 12H7M17.01 12h5.95"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  sidebar: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  naukri: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8.5 16.5v-9l7 9v-9"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
  reply: '<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
};
const icon = (name, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
function hydrateIcons(root = document) { root.querySelectorAll("[data-icon]").forEach(el => { el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)); el.removeAttribute("data-icon"); }); }

// Theme: "light" | "dark" | "system". The server keeps the choice in an HttpOnly cookie and puts it
// on <html data-theme-choice>, so nothing is kept in localStorage or sessionStorage.
function themeChoice() { return document.documentElement.dataset.themeChoice || "system"; }
function applyTheme() {
  const c = themeChoice();
  document.documentElement.dataset.theme = c === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : c;
}
function setTheme(choice) {
  document.documentElement.dataset.themeChoice = choice;
  applyTheme();
  fetch("/api/prefs", { method: "POST", headers: { "X-Requested-With": "fetch", "Content-Type": "application/json" }, body: JSON.stringify({ theme: choice }) }).catch(() => {});
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
applyTheme();
// Served as static files (Netlify): no server filled in the saved theme, so ask the API for it.
if (!document.documentElement.hasAttribute("data-theme-choice")) {
  fetch("/api/prefs").then(r => r.ok && r.json()).then(p => {
    if (!p || document.documentElement.hasAttribute("data-theme-choice")) return;
    document.documentElement.dataset.themeChoice = p.theme; applyTheme(); dispatchEvent(new Event("themechange"));
  }).catch(() => {});
}

class ApiError extends Error {
  constructor(message, field, status) { super(message); this.field = field; this.status = status; }
}

async function api(url, opts = {}) {
  opts.headers = { "X-Requested-With": "fetch", ...(opts.headers || {}) };
  if (opts.json !== undefined) { opts.body = JSON.stringify(opts.json); opts.headers["Content-Type"] = "application/json"; opts.method = opts.method || "POST"; }
  let r;
  try { r = await fetch(url, opts); }
  catch { throw new ApiError("Can't reach the server. Check your connection and try again."); }
  if (r.status === 401 && !url.startsWith("/api/auth")) { location.href = "/login"; throw new ApiError("Your session has ended. Please log in again."); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(data.error || (r.status >= 500 ? "Something went wrong on our side. Please try again." : r.statusText), data.field, r.status);
  return data;
}

// Upload with progress (fetch can't report upload progress).
function upload(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("POST", url);
    x.setRequestHeader("X-Requested-With", "fetch");
    x.upload.onprogress = e => e.lengthComputable && onProgress && onProgress(e.loaded / e.total);
    x.onload = () => {
      let data = {}; try { data = JSON.parse(x.responseText); } catch {}
      if (x.status === 401) { location.href = "/login"; return; }
      x.status < 400 ? resolve(data) : reject(new ApiError(data.error || "Upload failed. Please try again.", data.field, x.status));
    };
    x.onerror = () => reject(new ApiError("Upload failed. Check your connection and try again."));
    x.send(formData);
  });
}

// Button busy state: disables it, shows a spinner and optional label, returns a restore function.
function busy(btn, label) {
  if (!btn) return () => {};
  const html = btn.innerHTML, width = btn.offsetWidth;
  btn.disabled = true; btn.setAttribute("aria-busy", "true");
  btn.style.minWidth = width + "px";
  btn.innerHTML = `<span class="spinner"></span>${label ? `<span>${esc(label)}</span>` : ""}`;
  return () => { btn.disabled = false; btn.removeAttribute("aria-busy"); btn.style.minWidth = ""; btn.innerHTML = html; };
}
async function withBusy(btn, label, fn) {
  const done = busy(btn, label);
  try { return await fn(); } finally { done(); }
}

// Inline field errors. Fields are matched by name= inside the form (or by id).
function clearErrors(form) {
  if (!form) return;
  form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
  form.querySelectorAll(".field-error").forEach(el => el.remove());
  form.querySelectorAll(".form-error").forEach(el => { el.hidden = true; el.textContent = ""; });
}
function fieldError(form, name, message) {
  const el = form && (form.querySelector(`[name="${CSS.escape(name)}"]`) || form.querySelector(`[data-group="${CSS.escape(name)}"]`));
  if (!el) return false;
  if (el.matches("input, select, textarea") && el.type !== "checkbox" && el.type !== "radio") {
    el.setAttribute("aria-invalid", "true");
    const id = el.id + "-err";
    el.setAttribute("aria-describedby", id);
    const msg = document.createElement("span");
    msg.className = "field-error"; msg.id = id; msg.textContent = message;
    (el.closest(".field") || el.parentElement).append(msg);
    if (!form.querySelector("[aria-invalid]:focus")) el.focus();
  } else {
    const msg = document.createElement("span");
    msg.className = "field-error"; msg.textContent = message;
    const host = el.matches("input") ? (el.closest("[data-group]") || el.closest("label").parentElement) : el;
    host.append(msg);
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  return true;
}
// Show an API error next to its field, in the form's .form-error box, or as a toast.
function showError(form, err, box) {
  if (form && err.field && fieldError(form, err.field, err.message)) return;
  const target = box || form?.querySelector(".form-error");
  if (target) { target.textContent = err.message; target.hidden = false; return; }
  toast(err.message, true);
}
// Clear a field's error as soon as the user edits it.
document.addEventListener("input", e => {
  const el = e.target;
  if (el.getAttribute && el.getAttribute("aria-invalid")) {
    el.removeAttribute("aria-invalid");
    (el.closest(".field") || el.parentElement).querySelector(".field-error")?.remove();
  }
});

function toast(msg, err) {
  let box = document.querySelector(".toasts");
  if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("role", "status"); document.body.append(box); }
  const t = document.createElement("div");
  t.className = "toast" + (err ? " err" : "");
  t.innerHTML = icon(err ? "alert" : "check") + `<span>${esc(msg)}</span>`;
  box.append(t);
  setTimeout(() => t.remove(), err ? 5000 : 3000);
}
const fail = e => toast(e.message || "Something went wrong. Please try again.", true);

// Promise-based modal: confirm / prompt replacement.
function modal({ title, text = "", input, confirm = "OK", cancel = "Cancel", danger = false, type = "text" }) {
  return new Promise(resolve => {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
      <h3>${esc(title)}</h3>${text ? `<p>${text}</p>` : ""}
      ${input !== undefined ? `<input class="input" type="${type}" value="${esc(input)}">` : ""}
      <div class="actions"><button class="btn" data-a="0">${esc(cancel)}</button>
      <button class="btn ${danger ? "btn-danger-solid" : "btn-primary"}" data-a="1">${esc(confirm)}</button></div></div>`;
    const field = back.querySelector("input");
    const done = ok => { back.remove(); document.removeEventListener("keydown", onKey); resolve(ok ? (field ? field.value : true) : (field ? null : false)); };
    const onKey = e => { if (e.key === "Escape") done(false); if (e.key === "Enter") done(true); };
    back.addEventListener("click", e => { if (e.target === back) done(false); const a = e.target.closest("[data-a]"); if (a) done(a.dataset.a === "1"); });
    document.addEventListener("keydown", onKey);
    document.body.append(back);
    (field || back.querySelector("[data-a='1']")).focus();
    field?.select();
  });
}
