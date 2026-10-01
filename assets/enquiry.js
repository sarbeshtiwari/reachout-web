// Website enquiry form: used inline on /contact and as a pop-up on the landing page.
(function () {
  const TOPICS = ["General question", "Sales & pricing", "Support", "Partnership", "Other"];
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
  // Where the visitor came from is recorded by the server in an encrypted HttpOnly cookie;
  // whether the pop-up was already shown lives in an HttpOnly cookie too (read back via <html data-popup>).
  const popupDone = () => document.documentElement.dataset.popup === "done";
  const markPopupDone = () => {
    if (popupDone()) return;
    document.documentElement.dataset.popup = "done";
    fetch("/api/prefs", { method: "POST", headers: { "X-Requested-With": "fetch", "Content-Type": "application/json" }, body: JSON.stringify({ popup_seen: true }) }).catch(() => {});
  };

  function formHTML(id) {
    return `
      <div class="enq-grid">
        <div class="field"><label for="${id}-name">Your name</label><input class="input" id="${id}-name" name="name" autocomplete="name" maxlength="80"></div>
        <div class="field"><label for="${id}-email">Email</label><input class="input" id="${id}-email" name="email" type="email" autocomplete="email" maxlength="254"></div>
        <div class="field"><label for="${id}-phone">Phone <span class="opt">(optional)</span></label><input class="input" id="${id}-phone" name="phone" inputmode="tel" autocomplete="tel" maxlength="24"></div>
        <div class="field"><label for="${id}-company">Company <span class="opt">(optional)</span></label><input class="input" id="${id}-company" name="company" autocomplete="organization" maxlength="120"></div>
      </div>
      <div class="field"><label for="${id}-topic">What's it about?</label><select class="select" id="${id}-topic" name="topic"><option value="">Choose a topic</option>${TOPICS.map(t => `<option>${t}</option>`).join("")}</select></div>
      <div class="field"><div class="enq-label-row"><label for="${id}-message">Message</label><span class="help enq-count" id="${id}-count">0 / 2000</span></div><textarea class="textarea" id="${id}-message" name="message" maxlength="2000" rows="4" placeholder="How can we help?"></textarea></div>
      <div class="enq-hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <div data-group="consent"><label class="check"><input type="checkbox" name="consent"><span class="help" style="color:var(--text-3)">I agree to be contacted about this enquiry. We won't send marketing emails.</span></label></div>
      <div class="form-error" role="alert" hidden></div>
      <button class="btn btn-primary btn-lg enq-submit">Send message</button>`;
  }
  const doneHTML = name => `<div class="enq-done" role="status"><div class="enq-done-ic">${icon("check")}</div><h3>Thanks${name ? ", " + esc(name.split(" ")[0]) : ""}! We've got your message.</h3><p>We usually reply within one working day, to the email you gave us.</p></div>`;

  function mount(form, source, onDone) {
    const id = "enq-" + source;
    form.innerHTML = formHTML(id);
    form.noValidate = true;
    const opened = Date.now();
    const msg = form.querySelector("[name=message]"), count = form.querySelector(".enq-count");
    msg.addEventListener("input", () => { count.textContent = `${msg.value.length} / 2000`; });
    form.addEventListener("submit", async e => {
      e.preventDefault();
      clearErrors(form);
      const v = n => form.querySelector(`[name=${n}]`).value.trim();
      const data = { name: v("name"), email: v("email").toLowerCase(), phone: v("phone"), company: v("company"), topic: v("topic"), message: v("message"),
        consent: form.querySelector("[name=consent]").checked, website: form.querySelector("[name=website]").value, elapsed_ms: Date.now() - opened, source };
      if (data.name.length < 2) return fieldError(form, "name", "Enter your name.");
      if (!data.email) return fieldError(form, "email", "Enter your email so we can reply.");
      if (!EMAIL_RE.test(data.email)) return fieldError(form, "email", "Enter a valid email address, like name@example.com.");
      const digits = data.phone.replace(/\D/g, "");
      if (data.phone && (!/^\+?[\d\s\-().]+$/.test(data.phone) || digits.length < 8 || digits.length > 15)) return fieldError(form, "phone", "Enter a valid phone number: 8–15 digits.");
      if (!data.topic) return fieldError(form, "topic", "Choose a topic.");
      if (data.message.length < 10) return fieldError(form, "message", "Tell us a little more (at least 10 characters).");
      if (!data.consent) return fieldError(form, "consent", "Please tick this box so we can reply.");
      try {
        await withBusy(form.querySelector(".enq-submit"), "Sending…", () => api("/api/leads", { json: data }));
        document.documentElement.dataset.popup = "done";
        form.innerHTML = doneHTML(data.name);
        onDone && onDone();
      } catch (err) { showError(form, err); }
    });
  }
  window.mountEnquiry = mount;

  // ---------------- floating pop-up (landing page) ----------------
  window.initEnquiryPopup = function ({ autoOpenMs = 30000 } = {}) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button class="enq-fab" id="enqFab" aria-haspopup="dialog" aria-controls="enqPanel" aria-expanded="false">${icon("message")}<span>Have a question?</span></button>
      <div class="enq-panel" id="enqPanel" role="dialog" aria-modal="false" aria-labelledby="enqTitle" hidden>
        <div class="enq-head"><div><h2 id="enqTitle">Talk to us</h2><p>Questions about Reachout? Send a message and we'll get back to you.</p></div>
          <button class="btn btn-ghost btn-icon btn-sm" id="enqClose" aria-label="Close">${icon("x")}</button></div>
        <form class="enq-form" id="enqForm"></form>
      </div>`;
    document.body.append(wrap);
    const fab = document.getElementById("enqFab"), panel = document.getElementById("enqPanel");
    mount(document.getElementById("enqForm"), "popup");
    let lastFocus;
    const open = auto => {
      if (!panel.hidden) return;
      lastFocus = document.activeElement;
      panel.hidden = false; fab.setAttribute("aria-expanded", "true"); fab.classList.add("open");
      if (!auto) setTimeout(() => panel.querySelector("input:not([type=checkbox]),button")?.focus(), 50);
      markPopupDone();
    };
    const close = () => { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); fab.classList.remove("open"); lastFocus?.focus?.(); };
    fab.onclick = () => panel.hidden ? open(false) : close();
    document.getElementById("enqClose").onclick = close;
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });

    // Auto-open once per visitor: after a delay, or when the mouse heads for the tab bar (desktop).
    if (!popupDone()) {
      const timer = setTimeout(() => open(true), autoOpenMs);
      const onLeave = e => { if (e.clientY <= 0 && innerWidth > 900) { clearTimeout(timer); open(true); document.removeEventListener("mouseout", onLeave); } };
      setTimeout(() => document.addEventListener("mouseout", onLeave), 8000);
    }
  };
})();
