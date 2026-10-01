// Landing page: reveal-on-scroll, product tour tabs, website theme preview, mobile menu, theme toggle.
(function () {
  hydrateIcons();
  initEnquiryPopup();
  const d = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("yr").textContent = new Date().getFullYear();

  // Signed in already? Point the header at the app.
  fetch("/api/me").then(r => r.ok && r.json()).then(me => {
    if (!me) return;
    $("loginBtn").hidden = true;
    $("ctaTop").textContent = "Open app"; $("ctaTop").href = "/app";
  }).catch(() => {});

  // Header: solid once scrolled.
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Mobile menu.
  const menu = $("menuBtn"), links = $("navLinks");
  const setMenu = open => { links.classList.toggle("open", open); menu.setAttribute("aria-expanded", open); };
  menu.onclick = () => setMenu(!links.classList.contains("open"));
  links.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  d.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  // Theme toggle (saved in an HttpOnly cookie, like the app).
  const tb = $("themeBtn");
  const paintThemeIcon = () => { tb.innerHTML = icon(d.documentElement.dataset.theme === "dark" ? "sun" : "moon"); };
  paintThemeIcon();
  addEventListener("themechange", paintThemeIcon);
  tb.onclick = () => { setTheme(d.documentElement.dataset.theme === "dark" ? "light" : "dark"); paintThemeIcon(); };

  // Reveal on scroll.
  const items = [...d.querySelectorAll("[data-rv]")];
  if (reduce || !("IntersectionObserver" in window)) items.forEach(el => el.classList.add("in"));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
  }

  // Hero: cycle the live notifications.
  const toasts = [...d.querySelectorAll(".lp-toast")];
  if (toasts.length && !reduce) {
    let t = 0;
    setInterval(() => { toasts[t].classList.remove("on"); t = (t + 1) % toasts.length; toasts[t].classList.add("on"); }, 3200);
  }

  // Product tour: tabs with keyboard support, auto-advance until the visitor picks one.
  const tabs = [...d.querySelectorAll(".lp-tabs [role=tab]")], panels = [...d.querySelectorAll(".lp-panel")];
  const tour = d.querySelector(".lp-tour");
  let cur = 0, timer = null, userPicked = false;
  const TOUR_MS = 7000;
  const show = (i, focus) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === cur;
      t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
      t.classList.toggle("run", on && !userPicked && !reduce);
      panels[n].hidden = !on; panels[n].classList.toggle("on", on);
    });
    if (focus) tabs[cur].focus();
    // On phones the tabs are a sideways row: keep the selected one visible (without moving the page).
    const row = tabs[cur].parentElement;
    if (row.scrollWidth > row.clientWidth) {
      const b = tabs[cur];
      row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
  };
  const auto = () => { clearInterval(timer); if (!userPicked && !reduce) timer = setInterval(() => show(cur + 1), TOUR_MS); };
  tabs.forEach((t, n) => {
    t.onclick = () => { userPicked = true; clearInterval(timer); show(n); };
    t.onkeydown = e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); userPicked = true; clearInterval(timer); show(cur + k, true); }
      if (e.key === "Home") { e.preventDefault(); show(0, true); }
      if (e.key === "End") { e.preventDefault(); show(tabs.length - 1, true); }
    };
  });
  if (tour && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(cur); auto(); } else clearInterval(timer); }, { threshold: .3 }).observe(tour);
  }

  // Website builder: preview themes.
  const demo = $("siteDemo"), sw = [...d.querySelectorAll("[data-theme-pv]")];
  sw.forEach(b => b.onclick = () => {
    sw.forEach(x => x.setAttribute("aria-checked", x === b));
    demo.classList.add("swap");
    setTimeout(() => { demo.dataset.t = b.dataset.themePv; demo.classList.remove("swap"); }, reduce ? 0 : 160);
  });
})();
