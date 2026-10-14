/* shop search (whole shop + inside one category), the search results page,
   homepage "what's new" tabs + announcements box, and the delivery map on where we deliver.
   the product list (assets/js/products.js) only loads once someone actually searches */
(function () {
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var cartLink = $("[data-cart-link]");
  var ROOT = cartLink ? cartLink.getAttribute("href").replace(/shop-cart\/(index\.html)?$/, "") : "";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var money = function (n) { return "$" + (Math.round(n * 100) / 100).toFixed(2); };
  var icon = function (n) { return ROOT + "assets/icons/" + n + ".webp"; };
  var ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- product list, loaded on demand ---------- */
  var waiting = null;
  function products(cb) {
    if (window.UM_PRODUCTS) return cb(window.UM_PRODUCTS);
    if (!waiting) {
      waiting = [];
      var s = doc.createElement("script");
      s.src = ROOT + "assets/js/products.js";
      s.onload = function () { (window.UM_PRODUCTS || []).forEach(function (p) { p.nl = p.n.toLowerCase(); p.h = (p.nl + " " + p.c + " " + p.t.map(function (t) { return t[0]; }).join(" ") + " " + p.v.map(function (v) { return v[0]; }).join(" ") + " " + p.d).toLowerCase(); }); waiting.forEach(function (f) { f(window.UM_PRODUCTS || []); }); };
      doc.head.appendChild(s);
    }
    waiting.push(cb);
  }
  // same ranking as the next.js version: whole-word name matches first, "the thing itself" (Raw Goat Butter over Butter Bread), sold out last
  function search(all, q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8), seen = {}, hits = [];
    if (!terms.length) return [];
    var rx = function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    all.forEach(function (p) {
      if (seen[p.i] || !terms.every(function (t) { return p.h.indexOf(t) > -1; })) return;
      seen[p.i] = 1;
      var name = p.nl, at = name.indexOf(terms[0]);
      var whole = terms.every(function (t) { return new RegExp("(^|[^a-z])" + rx(t) + "($|[^a-z])").test(name); });
      var last = terms.some(function (t) { return new RegExp("(^|[^a-z])" + rx(t) + "s?\\s*$").test(name); });
      var score = (whole ? 0 : 100) + (last ? 0 : 30) + (at < 0 ? 60 : at * 0.5) + name.length * 0.3 + (terms.every(function (t) { return name.indexOf(t) > -1; }) ? 0 : 50) + (p.o ? 200 : 0);
      hits.push({ p: p, s: score });
    });
    return hits.sort(function (a, b) { return a.s - b.s; }).map(function (x) { return x.p; });
  }
  var priceOf = function (p) { var ps = p.v.filter(function (v) { return v[1] != null; }).map(function (v) { return v[1]; }); return ps.length ? Math.min.apply(null, ps) : null; };
  var pageFor = function (p) { return ROOT + p.cp + "/index.html#" + p.i; };
  var searchPage = function (q) { return ROOT + "search/index.html?q=" + encodeURIComponent(q); };

  /* ---------- search boxes (shop page, sidebar, phones, results page) ---------- */
  $$("form.search").forEach(function (form) {
    var input = $("input", form), list = $(".results", form), clear = $(".search__clear", form), active = -1, hits = [], term = "";
    if (!input || !list) return;
    function draw() {
      form.classList.toggle("has-q", !!input.value);
      term = input.value.trim();
      if (!term) { form.classList.remove("is-open"); list.innerHTML = ""; return; }
      products(function (all) {
        if (input.value.trim() !== term) return;
        var found = search(all, term); hits = found.slice(0, 8); active = -1;
        list.innerHTML = (!found.length ? '<div class="results__empty">Nothing matches <b>' + esc(term) + "</b>. Try “butter”, “kefir”, “lamb” or “honey”.</div>" : "") +
          hits.map(function (p, i) {
            var pr = priceOf(p);
            return '<a class="result" href="' + pageFor(p) + '" role="option" data-i="' + i + '"><img src="' + icon(p.ic) + '" alt="" width="44" height="44" loading="lazy">' +
              "<span><b>" + esc(p.n) + "</b><small>" + esc(p.c) + (p.o ? " · sold out" : "") + "</small></span>" +
              (pr != null ? '<span class="price">' + (p.v.length > 1 ? "<small>from </small>" : "") + money(pr) + "</span>" : "<span></span>") + "</a>";
          }).join("") +
          (found.length ? '<button type="submit" class="results__all">See all ' + found.length + " result" + (found.length === 1 ? "" : "s") + " for “" + esc(term) + "” →</button>" : "");
        form.classList.add("is-open");
      });
    }
    input.addEventListener("input", draw);
    input.addEventListener("focus", function () { if (input.value.trim()) draw(); else products(function () {}); });
    input.addEventListener("keydown", function (e) {
      var items = $$(".result", list);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); if (!items.length) return;
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach(function (it, i) { it.classList.toggle("is-active", i === active); });
        items[active].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Escape") { input.value = ""; draw(); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var items = $$(".result", list);
      if (active >= 0 && items[active]) { location.href = items[active].href; return; }
      if (input.value.trim()) location.href = searchPage(input.value.trim());
    });
    if (clear) clear.addEventListener("click", function () { input.value = ""; draw(); input.focus(); });
    doc.addEventListener("click", function (e) { if (!form.contains(e.target)) form.classList.remove("is-open"); });
  });

  /* ---------- search results page ---------- */
  var resBox = $("[data-results]");
  if (resBox) {
    var q = (/[?&]q=([^&]*)/.exec(location.search) || [])[1];
    q = q ? decodeURIComponent(q.replace(/\+/g, " ")).trim() : "";
    var hero = $(".shop-hero"), h1 = hero && $("h1", hero), lede = hero && $(".lede", hero), box = hero && $("form.search input", hero);
    if (box) box.value = q;
    if (q) {
      document.title = "Search: " + q + " · Udder Milk";
      h1.innerHTML = "Results for <em>“" + esc(q) + "”</em>";
      lede.textContent = "Searching…";
      products(function (all) {
        var found = search(all, q), shown = found.slice(0, 120), groups = [];
        shown.forEach(function (p) { var g = groups.filter(function (x) { return x.cp === p.cp; })[0]; if (g) g.items.push(p); else groups.push({ cp: p.cp, c: p.c, items: [p] }); });
        lede.textContent = found.length ? found.length + " product" + (found.length === 1 ? "" : "s") + " in " + groups.length + " categor" + (groups.length === 1 ? "y" : "ies") + "." : "No products match. Try a shorter word, like “butter”, “kefir”, “lamb” or “honey”.";
        resBox.innerHTML = groups.map(function (g) {
          return '<section class="sgroup" aria-label="' + esc(g.c) + '"><div class="sgroup__head"><h2>' + esc(g.c) + '</h2><a class="link-arrow" href="' + ROOT + g.cp + '/index.html">Open category ' + ARROW + '</a></div><div class="products">' + g.items.map(card).join("") + "</div></section>";
        }).join("") + (found.length > shown.length ? '<p class="muted" style="text-align:center">Showing the first ' + shown.length + ". Add another word to narrow it down.</p>" : "");
      });
    }
  }
  // a product card in the same markup as the category pages, so add-to-cart works the same
  function card(p) {
    var ok = p.v.filter(function (v) { return !v[2] && v[1] != null; }), pr = priceOf(p);
    var tags = p.t.map(function (t) { return '<span class="tag' + (t[1] ? " tag--" + t[1] : "") + '">' + esc(t[0]) + "</span>"; }).join("");
    var vars = p.v.map(function (v) { return '<li' + (v[2] ? ' class="is-out"' : "") + '><span class="v-label">' + esc(v[0]) + '</span><span class="price">' + (v[2] ? "Sold out" : v[1] != null ? money(v[1]) : "") + "</span></li>"; }).join("");
    var url = p.cp + "/index.html#" + p.i;
    return '<article class="product' + (p.ph ? " has-photo" : "") + (p.o ? " is-allout" : "") + '" style="--tint: ' + esc(p.tint) + '"><div class="product__media"><figure class="ph"><img class="ph__icon" src="' + icon(p.ic) + '" alt="" width="160" height="160" loading="lazy">' +
      (p.ph ? '<img class="ph__img" src="' + esc(p.ph) + '" alt="' + esc(p.n) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">' : "") + "</figure></div>" +
      '<div class="product__body"><h2><a href="' + ROOT + url + '">' + esc(p.n) + "</a></h2>" + (pr != null ? '<p class="product__from">' + (p.v.length > 1 ? "from " : "") + money(pr) + "</p>" : "") +
      (tags ? '<div class="tags">' + tags + "</div>" : "") + (p.d ? '<p class="product__desc">' + esc(p.d) + "</p>" : "") + '<ul class="variants" aria-label="Sizes and prices">' + vars + "</ul></div>" +
      '<div class="product__foot">' + (ok.length
        ? '<form class="addcart" data-addcart data-id="' + esc(p.i) + '" data-name="' + esc(p.n) + '" data-url="' + esc(url) + '" data-img="' + esc(p.ph) + '" data-icon="' + esc(p.ic) + '"><label class="sr-only" for="s-' + esc(p.i) + '-v">Size</label>' +
          '<select id="s-' + esc(p.i) + '-v" name="v"' + (ok.length === 1 ? ' class="is-one"' : "") + ">" + ok.map(function (v) { return '<option value="' + esc(v[0]) + '" data-price="' + v[1] + '">' + esc(v[0]) + " · " + money(v[1]) + "</option>"; }).join("") + "</select>" +
          '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-step="-1" aria-label="One fewer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>' +
          '<input type="number" name="q" value="1" min="1" max="99" inputmode="numeric" aria-label="Quantity"><button type="button" data-step="1" aria-label="One more"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>' +
          '<button class="btn btn--sm" type="submit">Add to cart</button></form><span class="muted">Members only · pay on delivery</span>'
        : '<span class="tag tag--out">Sold out</span>') + "</div></article>";
  }

  /* ---------- search inside one category ---------- */
  var local = $("#local-q");
  if (local) {
    var wrap = local.closest(".localsearch"), lclear = $("[data-local-clear]", wrap), cards = $$(".products .product"), jumps = $$(".jump a");
    var title = (($("#cat-title") || {}).textContent || "this category").trim();
    var none = doc.createElement("p"); none.className = "hidden-note"; none.style.display = "none";
    var grid = $(".products"); if (grid) grid.appendChild(none);
    cards.forEach(function (c) { c._h = c.textContent.toLowerCase().replace(/\s+/g, " "); });
    var run = function () {
      var v = local.value.trim(), terms = v.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      wrap.classList.toggle("has-q", !!v); if (lclear) lclear.hidden = !v;
      cards.forEach(function (c) {
        var hit = !terms.length || terms.every(function (t) { return c._h.indexOf(t) > -1; });
        c.classList.toggle("is-filtered", !hit); c.style.display = hit ? "" : "none";
        if (hit && !c.classList.contains("is-allout")) shown++;
        else if (hit && !doc.body.classList.contains("instock-only")) shown++;
      });
      jumps.forEach(function (a) { var t = doc.getElementById(a.getAttribute("href").slice(1)); a.style.display = t && t.style.display === "none" ? "none" : ""; });
      none.style.display = terms.length && !shown ? "block" : "none";
      none.innerHTML = "Nothing in " + esc(title) + " matches “" + esc(v) + "”. " + '<a href="' + searchPage(v) + '">Search all products instead</a>.';
    };
    local.addEventListener("input", run);
    local.addEventListener("keydown", function (e) { if (e.key === "Escape") { local.value = ""; run(); } });
    if (lclear) lclear.addEventListener("click", function () { local.value = ""; run(); local.focus(); });
  }

  /* ---------- homepage: what's new tabs ---------- */
  $$("[data-wn]").forEach(function (sec) {
    var tabs = $$("[data-wn-tab]", sec);
    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        tabs.forEach(function (x) {
          var on = x === b, panel = doc.getElementById(x.getAttribute("aria-controls"));
          x.classList.toggle("is-active", on); x.setAttribute("aria-selected", on ? "true" : "false");
          if (panel) panel.hidden = !on;
        });
      });
    });
  });

  /* ---------- homepage: announcements (from announcements.md in the main folder) ---------- */
  var ann = $("[data-announce]");
  if (ann) {
    var show = function () { ann.hidden = false; };
    var href = function (u) {
      if (/^[a-z]+:/i.test(u) || u.charAt(0) === "#") return u;
      var m = /^([^?#]*)([?#]?.*)$/.exec(u), path = m[1].replace(/^\/+|\/+$/g, "");
      return ROOT + (path ? (/\.html$/.test(path) ? path : path + "/index.html") : "index.html") + m[2];
    };
    var parse = function (md) {
      md = md.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n");
      return md.split(/^##\s+/m).slice(1).map(function (block) {
        var ls = block.split("\n"), a = { title: ls[0].trim(), text: [] }, body = [];
        ls.slice(1).forEach(function (ln) {
          var m = /^\s*(date|link)\s*:\s*(.+)$/i.exec(ln);
          if (m && !body.join("").trim()) {
            if (m[1].toLowerCase() === "date") a.date = m[2].trim();
            else { var parts = m[2].split("|"); a.link = [parts[0].trim(), (parts[1] || "").trim() || "Read more"]; }
          } else body.push(ln);
        });
        a.text = body.join("\n").split(/\n\s*\n/).map(function (p) { return p.replace(/\s*\n\s*/g, " ").trim(); }).filter(Boolean);
        return a;
      }).filter(function (a) { return a.title; });
    };
    if (window.fetch && /^https?:$/.test(location.protocol)) {
      fetch(ROOT + ann.getAttribute("data-src"), { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (md) {
        var list = parse(md);
        if (!list.length) { ann.remove(); return; }   // no announcements = no box
        $("ul", ann).innerHTML = list.map(function (a) {
          return "<li>" + (a.date ? "<small>" + esc(a.date) + "</small>" : "") + "<b>" + esc(a.title) + "</b>" + a.text.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
            (a.link ? '<a href="' + esc(href(a.link[0])) + '">' + esc(a.link[1]) + " →</a>" : "") + "</li>";
        }).join("");
        show();
      }).catch(show);   // couldnt read the file: show the copy that's in the page
    } else show();
  }

  /* ---------- where we deliver: the real map replaces the placeholder once it's uploaded ---------- */
  var mapBox = $("[data-map]");
  if (mapBox) {
    var src = mapBox.getAttribute("data-map"), test = new Image();
    test.onload = function () {
      var f = doc.createElement("figure");
      f.className = "wmap is-in";
      f.innerHTML = '<a href="' + src + '" target="_blank" rel="noopener" aria-label="Open the delivery map full size in a new tab"><img src="' + src + '" alt="Map of Udder Milk\'s home delivery area, outlined in black, covering parts of the Midwest, Northeast, Mid-Atlantic and Canada"></a>' +
        "<figcaption><span><b>Updated November 12, 2024.</b> Zoom in to see if your town is inside the black outline. Routes can change.</span><a href=\"" + src + '" target="_blank" rel="noopener">Open full size</a></figcaption>';
      mapBox.parentNode.replaceChild(f, mapBox);
    };
    test.src = src;
  }
})();
