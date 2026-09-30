/* Udder Milk — small, dependency-free interactions */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* 1. Clean URLs when served over http(s): ".../about-us/index.html" -> ".../about-us/" */
  if (/^https?:$/.test(location.protocol)) {
    $$('a[href$="index.html"]').forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^(https?:)?\/\//.test(h)) return;
      var clean = h.slice(0, -"index.html".length);
      a.setAttribute("href", clean === "" ? "./" : clean);
    });
  }

  /* 2. Header: shadow once the tab bar sticks; keep the current tab in view on small screens */
  var strip = $(".topstrip");
  var onScrollNav = function () { root.classList.toggle("is-stuck", window.scrollY > (strip ? strip.offsetHeight : 0) + 8); };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });
  var tabs = $(".tabs"), cur = tabs && tabs.querySelector('[aria-current="page"]');
  if (tabs && cur && tabs.scrollWidth > tabs.clientWidth) {
    tabs.scrollLeft = Math.max(0, cur.offsetLeft - (tabs.clientWidth - cur.offsetWidth) / 2);
  }
  /* the category sidebar scrolls on its own: start it at the current category */
  var side = $(".sidebar nav"), sideCur = side && side.querySelector('[aria-current="page"]');
  if (side && sideCur && side.scrollHeight > side.clientHeight) {
    side.scrollTop = Math.max(0, sideCur.offsetTop - side.clientHeight / 3);
  }

  /* 3. Hero entrance once fonts are ready */
  var loaded = false;
  function markLoaded() { if (!loaded) { loaded = true; root.classList.add("is-loaded"); } }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { requestAnimationFrame(markLoaded); });
  setTimeout(markLoaded, 900);

  /* 4. Reveal on scroll */
  $$("[data-stagger]").forEach(function (group) {
    $$("[data-reveal]", group).forEach(function (el, i) { el.style.setProperty("--i", i % 8); });
  });
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* 5. Scroll-linked effects: parallax, stacking cards, delivery route */
  var parallax = reduce ? [] : $$("[data-speed]");
  var stackCards = reduce ? [] : $$(".stack__card");
  var route = $(".route");
  var routePath = route && route.querySelector("[data-route]");
  var routeFill = route && route.querySelector("[data-route-fill]");
  var truck = route && route.querySelector(".route__truck");
  var routeLen = routePath ? routePath.getTotalLength() : 0;
  if (routeFill) { routeFill.style.strokeDasharray = routeLen; routeFill.style.strokeDashoffset = reduce ? 0 : routeLen; }

  function placeTruck(p) {
    if (!routePath || !truck) return;
    var svg = routePath.ownerSVGElement, vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
    var t = 0.12 + p * 0.76;
    var pt = routePath.getPointAtLength(routeLen * t);
    var x = (pt.x - vb.x) / vb.width * r.width, y = (pt.y - vb.y) / vb.height * r.height;
    var base = (truck.offsetParent || route).getBoundingClientRect();
    var offTop = r.top - base.top, offLeft = r.left - base.left;
    truck.style.transform = "translate(" + (x + offLeft - truck.offsetWidth / 2).toFixed(1) + "px," + (y + offTop - truck.offsetHeight * 0.82).toFixed(1) + "px)";
    if (routeFill) routeFill.style.strokeDashoffset = routeLen * (1 - t);
  }

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i], sp = parseFloat(el.getAttribute("data-speed")) || 0;
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) continue;
      var y = (box.top + box.height / 2 - vh / 2) * sp;
      el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    }
    for (var j = 0; j < stackCards.length - 1; j++) {
      var a = stackCards[j].getBoundingClientRect(), b = stackCards[j + 1].getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
      stackCards[j].style.transform = "scale(" + (1 - p * 0.06).toFixed(4) + ")";
      stackCards[j].style.filter = "brightness(" + (1 - p * 0.08).toFixed(3) + ")";
    }
    if (route && routePath) {
      var rr = route.getBoundingClientRect();
      var prog = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - rr.top) / (vh * 0.55)));
      placeTruck(prog);
    }
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (parallax.length || stackCards.length || route) {
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", requestFrame);
    requestFrame();
  }

  /* 6. Horizontal picks scroller */
  $$("[data-scroller]").forEach(function (wrap) {
    var track = $(".picks", wrap), prev = $("[data-prev]", wrap), next = $("[data-next]", wrap);
    if (!track) return;
    function step() { var c = track.querySelector(".pick"); return c ? c.getBoundingClientRect().width + 18 : 300; }
    function update() {
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    update();
  });

  /* 7. Shop search */
  var search = $("[data-search]");
  if (search) {
    var input = $("input", search), list = $(".results", search), clear = $(".search__clear", search);
    var dataEl = doc.getElementById("search-index");
    var index = [];
    try { index = JSON.parse(dataEl.textContent); } catch (e) { index = []; }
    var R = search.getAttribute("data-root") || "";
    var iconBase = search.getAttribute("data-icons") || "";
    index.forEach(function (it) { it.h = (it.n + " " + it.c + " " + (it.t || "")).toLowerCase(); });
    var active = -1;
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function render(q) {
      search.classList.toggle("has-q", !!q);
      if (!q) { search.classList.remove("is-open"); list.innerHTML = ""; return; }
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var hits = index.filter(function (it) { return terms.every(function (t) { return it.h.indexOf(t) > -1; }); });
      hits.sort(function (a, b) {
        var an = a.n.toLowerCase().indexOf(terms[0]), bn = b.n.toLowerCase().indexOf(terms[0]);
        return (an < 0 ? 99 : an) - (bn < 0 ? 99 : bn) || (a.o ? 1 : 0) - (b.o ? 1 : 0);
      });
      active = -1;
      if (!hits.length) {
        list.innerHTML = '<div class="results__empty">Nothing matches <b>' + esc(q) + '</b>. Try “butter”, “kefir”, “lamb” or “honey”.</div>';
      } else {
        list.innerHTML = hits.slice(0, 14).map(function (it) {
          return '<a class="result" role="option" href="' + R + it.u + '"><img src="' + iconBase + it.i + '.webp" alt="" loading="lazy" width="44" height="44">' +
            '<span><b>' + esc(it.n) + '</b><small>' + esc(it.c) + (it.o ? " · sold out" : "") + '</small></span>' +
            (it.p ? '<span class="price">' + esc(it.p) + '</span>' : "<span></span>") + '</a>';
        }).join("") + (hits.length > 14 ? '<div class="results__empty">' + (hits.length - 14) + ' more. Keep typing to narrow it down.</div>' : "");
      }
      search.classList.add("is-open");
    }
    input.addEventListener("input", function () { render(input.value.trim()); });
    input.addEventListener("focus", function () { if (input.value.trim()) render(input.value.trim()); });
    input.addEventListener("keydown", function (e) {
      var items = $$(".result", list);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach(function (it, i) { it.classList.toggle("is-active", i === active); });
        items[active].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        var go = items[active] || items[0];
        if (go) { e.preventDefault(); location.href = go.href; }
      } else if (e.key === "Escape") { input.value = ""; render(""); }
    });
    if (clear) clear.addEventListener("click", function () { input.value = ""; render(""); input.focus(); });
    doc.addEventListener("click", function (e) { if (!search.contains(e.target)) search.classList.remove("is-open"); });
  }

  /* 9. Category page: in-stock filter + jump links */
  var stockToggle = $("[data-instock]");
  if (stockToggle) {
    var hiddenNote = $(".hidden-note");
    var apply = function (on) {
      body.classList.toggle("instock-only", on);
      store.set("um-instock", on ? "1" : "0");
      var anyVisible = $$(".product").some(function (p) { return !p.classList.contains("is-allout"); });
      if (hiddenNote) hiddenNote.classList.toggle("is-needed", on && !anyVisible);
      $$(".jump a").forEach(function (a) {
        var t = doc.getElementById(a.getAttribute("href").slice(1));
        a.hidden = on && t && t.classList.contains("is-allout");
      });
    };
    stockToggle.checked = store.get("um-instock") === "1";
    apply(stockToggle.checked);
    stockToggle.addEventListener("change", function () { apply(stockToggle.checked); });
  }
  var jumps = $$(".jump a");
  if (jumps.length && "IntersectionObserver" in window) {
    var jio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        jumps.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
        var on = $(".jump a.is-active");
        if (on) { var bar = on.parentElement; bar.scrollTo({ left: on.offsetLeft - bar.clientWidth / 2 + on.clientWidth / 2, behavior: reduce ? "auto" : "smooth" }); }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    $$(".product").forEach(function (p) { jio.observe(p); });
  }

  /* 10. Contact form -> email draft */
  var form = $("[data-mailto]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form), to = form.getAttribute("data-mailto");
      var subject = "Note from " + (f.get("name") || "a member") + (f.get("topic") ? " about " + f.get("topic") : "");
      var lines = [f.get("message") || "", "", "Name: " + (f.get("name") || ""), "Email: " + (f.get("email") || "")];
      if (f.get("zone")) lines.push("Delivery zone: " + f.get("zone"));
      location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  /* 10b. Product photos: thumbnails swap the big photo, and the big photo opens a viewer */
  $$(".product").forEach(function (card) {
    var main = $(".ph__img", card), thumbs = $$(".thumb", card);
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () {
        if (!main) return;
        main.src = t.getAttribute("data-src");
        main.alt = t.getAttribute("data-alt") || "";
        thumbs.forEach(function (o) { var on = o === t; o.classList.toggle("is-on", on); o.setAttribute("aria-pressed", on ? "true" : "false"); });
      });
    });
  });
  var viewer = null;
  function openViewer(src, alt) {
    if (!viewer) {
      viewer = doc.createElement("dialog");
      viewer.className = "lightbox";
      viewer.innerHTML = '<div class="lightbox__bar"><span></span><button type="button" aria-label="Close photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><img alt="" referrerpolicy="no-referrer">';
      body.appendChild(viewer);
      viewer.querySelector("button").addEventListener("click", function () { viewer.close(); });
      viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
    }
    var img = viewer.querySelector("img");
    img.src = src; img.alt = alt || "";
    viewer.querySelector(".lightbox__bar span").textContent = alt || "";
    if (typeof viewer.showModal === "function") viewer.showModal(); else window.open(src, "_blank", "noopener");
  }
  $$("[data-zoom]").forEach(function (btn) {
    btn.addEventListener("click", function () { var im = btn.querySelector("img"); if (im) openViewer(im.currentSrc || im.src, im.alt); });
  });

  /* 10c. Account forms. They post to the member system on uddermilk.com. Anywhere else (a preview
     copy, a file on disk) nothing is sent, and the form says so. */
  var live = /(^|\.)uddermilk\.com$/i.test(location.hostname);
  $$("form[data-account]").forEach(function (f) {
    var note = $("[data-form-note]", f);
    function pair(a, b, msg) {
      var x = f.querySelector('[name="' + a + '"]'), y = f.querySelector('[name="' + b + '"]');
      if (!x || !y) return;
      var check = function () { y.setCustomValidity(y.value && x.value !== y.value ? msg : ""); };
      x.addEventListener("input", check); y.addEventListener("input", check);
    }
    pair("email", "email_confirm", "The two email addresses don't match.");
    pair("password", "password_confirm", "The two passwords don't match.");
    f.addEventListener("submit", function (e) {
      if (!f.checkValidity()) { e.preventDefault(); f.reportValidity(); return; }
      if (live) return;
      e.preventDefault();
      if (note) {
        var kind = f.getAttribute("data-account");
        note.textContent = "This is a preview copy of the site, so nothing was sent. On uddermilk.com, this form " +
          (kind === "signup" ? "creates your account." : kind === "forgot" ? "emails you a reset link." : "logs you in.");
        note.hidden = false;
      }
    });
    var mapBtn = $("[data-mapcheck]", f);
    if (mapBtn) mapBtn.addEventListener("click", function () {
      var num = (f.querySelector('[name="street_number"]') || {}).value || "";
      var addr = (f.querySelector('[name="address"]') || {}).value || "";
      var q = (num + " " + addr).trim();
      if (!q) { var a = f.querySelector('[name="address"]'); if (a) { a.focus(); a.reportValidity(); } return; }
      window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q), "_blank", "noopener");
    });
  });

  /* 10d. Homepage cow: a short video that plays once (grazing, then looking up) and stops on the
     last frame. A script right after the video starts it, muted (there's no autoplay attribute:
     in Low Power Mode Safari forces its own play and full-screen buttons onto videos that have one).
     If the browser refuses to play it, the page steps through a copy made for seeking, frame by
     frame, so she still moves without a click and without any buttons. Reduced motion: last frame. */
  var heroVid = $("[data-hero-video]");
  if (heroVid) {
    var FPS = 24;
    heroVid.controls = false;
    var showLast = function () { var l = heroVid.getAttribute("data-last"); if (l) heroVid.setAttribute("poster", l); };
    var stepThrough = function () {
      if (heroVid.hasAttribute("data-stepping")) return;
      heroVid.setAttribute("data-stepping", "");
      var total = 0, shown = -1, busy = false, t0 = 0, started = false;
      var tick = function (now) {
        var f = Math.min(total - 1, Math.floor((now - t0) * FPS / 1000));
        if (!busy && f > shown) {
          busy = true;
          shown = f;
          heroVid.currentTime = (f + 0.5) / FPS;      // the middle of frame f
        }
        if (shown < total - 1 || busy) window.requestAnimationFrame(tick);
      };
      var begin = function () {
        if (started) return;
        started = true;
        var d = heroVid.duration, sk = heroVid.seekable;
        total = Math.round(d * FPS);
        if (!total || !sk || !sk.length || sk.end(sk.length - 1) < d - 0.2) { showLast(); return; }   // can't seek here
        heroVid.addEventListener("seeked", function () { busy = false; });
        t0 = window.performance.now();
        window.requestAnimationFrame(tick);
      };
      heroVid.addEventListener("canplaythrough", begin);
      setTimeout(function () { if (!started) { if (heroVid.readyState >= 3) begin(); else { started = true; showLast(); } } }, 8000);
      var h264 = heroVid.canPlayType('video/mp4; codecs="avc1.640028"');
      var url = heroVid.getAttribute(h264 ? "data-scrub" : "data-scrub-webm");
      if (!url) { begin(); return; }
      var use = function (src) { heroVid.src = src; heroVid.load(); };
      if (/^https?:$/.test(location.protocol) && window.fetch && window.URL && URL.createObjectURL) {
        // fetch it whole: every frame is then at hand, whatever the server does with partial requests
        window.fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
          .then(function (b) { use(URL.createObjectURL(b)); }, function () { use(url); });
      } else {
        use(url);
      }
    };
    if (reduce || heroVid.hasAttribute("data-still")) {
      heroVid.preload = "none";
      heroVid.pause();
      showLast();
    } else {
      var srcs = heroVid.querySelectorAll("source");
      if (srcs.length) srcs[srcs.length - 1].addEventListener("error", showLast);   // no format could play
      heroVid.addEventListener("herorefused", stepThrough);
      if (heroVid.hasAttribute("data-refused")) stepThrough();
      if (!heroVid.hasAttribute("data-started")) {        // the starter script didn't run: start it here
        heroVid.muted = true;
        var tried = heroVid.play();
        if (tried && typeof tried.catch === "function") tried.catch(function (err) {
          if (!err || err.name !== "AbortError") stepThrough();
        });
      }
      // a browser that neither plays nor says no: step through it instead
      var arm = function () {
        setTimeout(function () { if (heroVid.paused && !heroVid.ended && heroVid.currentTime === 0) stepThrough(); }, 1500);
      };
      if (heroVid.readyState >= 3) arm(); else heroVid.addEventListener("canplay", arm, { once: true });
    }
  }

  /* 11. Lite video embeds */
  $$("[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-yt"), box = btn.parentElement;
      var ifr = doc.createElement("iframe");
      ifr.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      ifr.title = btn.getAttribute("aria-label") || "Video";
      ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      ifr.allowFullscreen = true;
      box.appendChild(ifr);
      btn.remove();
    });
  });

  /* 12. Little things */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$("[data-top]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }); });
})();
