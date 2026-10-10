/* Udder Milk: cart, checkout and orders (preview).
   Everything is kept in this browser (localStorage) until the site is connected to the member system:
   um_cart     [{key, name, variant, price, qty, url, img, icon}]
   um_orders   [{id, status, placed, method, items, note, contact}]  newest first
   um_editing  id of an open order the shopper is adding items to */
(function () {
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var cartLink = $("[data-cart-link]");
  var ROOT = cartLink ? cartLink.getAttribute("href").replace(/shop-cart\/(index\.html)?$/, "") : "";
  var ICONS = ROOT + "assets/icons/";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var money = function (n) { return "$" + (Math.round(n * 100) / 100).toFixed(2); };
  var sum = function (items) { return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0); };
  var nItems = function (items) { return items.reduce(function (s, i) { return s + i.qty; }, 0); };
  var link = function (p) { return ROOT + p + "/index.html"; };
  var svg = {
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  /* ---------- cart storage ---------- */
  var getCart = function () { return LS.get("um_cart", []); };
  var setCart = function (c) { LS.set("um_cart", c); updateCount(); };
  function updateCount() {
    var n = nItems(getCart());
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n; el.hidden = !n; });
  }
  function addItems(list, items) {
    items.forEach(function (it) {
      var hit = list.filter(function (x) { return x.key === it.key; })[0];
      if (hit) hit.qty = Math.min(99, hit.qty + it.qty); else list.push(JSON.parse(JSON.stringify(it)));
    });
    return list;
  }
  updateCount();
  window.addEventListener("storage", updateCount);

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(html) {
    if (!toastEl) { toastEl = doc.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); doc.body.appendChild(toastEl); }
    toastEl.innerHTML = html;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4200);
  }

  /* ---------- product cards: quantity steppers, add to cart, read more ---------- */
  doc.addEventListener("click", function (e) {
    var step = e.target.closest("[data-step]");
    if (step) {
      var inp = $("input", step.parentElement);
      inp.value = Math.max(1, Math.min(99, (parseInt(inp.value, 10) || 1) + parseInt(step.getAttribute("data-step"), 10)));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
    }
    var more = e.target.closest("[data-more]");
    if (more) {
      var body = more.parentElement, open = more.getAttribute("aria-expanded") !== "true";
      var long = $(".product__long", body), desc = $(".product__desc", body);
      if (long) long.hidden = !open;
      if (desc) { desc.classList.toggle("is-clamped", !open); if (long) desc.hidden = open; }
      more.setAttribute("aria-expanded", open);
      $("[data-more-label]", more).textContent = open ? "Show less" : "Read more";
    }
  });
  $$(".product__desc[data-clamp]").forEach(function (d) {
    d.classList.add("is-clamped");
    var btn = $("[data-more]", d.parentElement);
    var over = d.scrollHeight > d.clientHeight + 2;
    if (!over && !$(".product__long", d.parentElement)) d.classList.remove("is-clamped");
    if (btn && over) btn.hidden = false;
  });
  $$("[data-addcart]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var opt = f.v.options[f.v.selectedIndex];
      var q = Math.max(1, Math.min(99, parseInt(f.q.value, 10) || 1));
      var it = { key: f.getAttribute("data-id") + "|" + opt.value, name: f.getAttribute("data-name"), variant: opt.value,
                 price: parseFloat(opt.getAttribute("data-price")), qty: q, url: f.getAttribute("data-url"),
                 img: f.getAttribute("data-img"), icon: f.getAttribute("data-icon") };
      setCart(addItems(getCart(), [it]));
      f.q.value = 1;
      var btn = $("button[type=submit]", f);
      btn.classList.add("is-added");
      setTimeout(function () { btn.classList.remove("is-added"); }, 1200);
      if (cartLink) { cartLink.classList.remove("is-bump"); void cartLink.offsetWidth; cartLink.classList.add("is-bump"); }
      toast('<span class="toast__ok">' + svg.check + '</span><span><b>' + esc(it.name) + '</b> ' + esc(it.variant) + ' × ' + q + ' added</span><a href="' + link("shop-cart") + '">View cart</a>');
    });
  });

  /* ---------- order pages ---------- */
  var om = $("[data-om]");
  if (!om) return;
  var MODE = om.getAttribute("data-om");
  var samples = [];
  try { samples = JSON.parse($("#sample-orders").textContent); } catch (e) {}
  var getOrders = function () { return LS.get("um_orders", []); };
  var allOrders = function () { return getOrders().concat(samples); };
  var findOrder = function (id) { return allOrders().filter(function (o) { return o.id === id; })[0]; };
  function saveOrder(o) {
    var list = getOrders(), i = list.map(function (x) { return x.id; }).indexOf(o.id);
    if (i > -1) list[i] = o; else list.unshift(o);
    LS.set("um_orders", list);
  }
  var qs = function (k) { var m = new RegExp("[?&]" + k + "=([^&]+)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; };
  var STATUS = {
    open: ["Open", "You can still change it"], closed: ["Closed", "Locked in for your delivery day"],
    confirmed: ["Confirmed", "On the truck for your day"], delivered: ["Delivered", ""], canceled: ["Canceled", ""]
  };
  var chip = function (s) { return '<span class="ostat ostat--' + s + '">' + (STATUS[s] || [s])[0] + "</span>"; };
  var fmtDate = function (iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined });
  };
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var imgFor = function (it) {
    var ic = ICONS + (it.icon || "basket") + ".webp";
    return it.img ? '<img src="' + esc(it.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'' + ic + '\';this.className=\'is-icon\'">'
                  : '<img class="is-icon" src="' + ic + '" alt="" loading="lazy">';
  };

  function lines(items, editable) {
    return '<ul class="lines">' + items.map(function (it, i) {
      return '<li class="oline" data-i="' + i + '">' +
        '<a class="line__img" href="' + ROOT + esc(it.url) + '" tabindex="-1" aria-hidden="true">' + imgFor(it) + "</a>" +
        '<div class="line__info"><a class="line__name" href="' + ROOT + esc(it.url) + '">' + esc(it.name) + "</a>" +
        '<span class="line__var">' + esc(it.variant) + "</span>" +
        '<span class="line__each">' + money(it.price) + " each</span></div>" +
        (editable
          ? '<div class="line__ctl"><div class="qty qty--sm" role="group" aria-label="Quantity of ' + esc(it.name) + '"><button type="button" data-q="-1" aria-label="One fewer">' + svg.minus + '</button><input type="number" min="1" max="99" value="' + it.qty + '" data-qin aria-label="Quantity"><button type="button" data-q="1" aria-label="One more">' + svg.plus + "</button></div>" +
            '<button class="line__rm" type="button" data-rm aria-label="Remove ' + esc(it.name) + '">' + svg.trash + "<span>Remove</span></button></div>"
          : '<span class="line__qty">× ' + it.qty + "</span>") +
        '<b class="line__tot">' + money(it.price * it.qty) + "</b></li>";
    }).join("") + "</ul>";
  }
  function bindLines(box, items, onChange) {
    box.addEventListener("click", function (e) {
      var row = e.target.closest("[data-i]"); if (!row) return;
      var i = +row.getAttribute("data-i");
      if (e.target.closest("[data-q]")) { items[i].qty = Math.max(1, Math.min(99, items[i].qty + +e.target.closest("[data-q]").getAttribute("data-q"))); onChange(); }
      if (e.target.closest("[data-rm]")) { items.splice(i, 1); onChange(); }
    });
    box.addEventListener("change", function (e) {
      if (!e.target.matches("[data-qin]")) return;
      var i = +e.target.closest("[data-i]").getAttribute("data-i");
      items[i].qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)); onChange();
    });
  }
  function summary(items, extra) {
    var t = sum(items);
    return '<div class="sum"><h2>Order <em>summary</em></h2>' +
      '<dl><div><dt>Items (' + nItems(items) + ")</dt><dd>" + money(t) + "</dd></div>" +
      "<div><dt>Payment</dt><dd>Cash on delivery</dd></div></dl>" +
      '<div class="sum__total"><span>Cash due at your door</span><b>' + money(t) + "</b></div>" + (extra || "") + "</div>";
  }
  function empty(title, text, btns) {
    return '<div class="om__empty"><img src="' + ICONS + 'basket.webp" alt="" width="120" height="120"><h2>' + title + "</h2><p class=\"muted\">" + text + '</p><div class="btn-row">' + btns + "</div></div>";
  }
  var shopBtn = '<a class="btn" href="' + link("shop") + '">Go to the shop ' + svg.arrow + "</a>";

  /* cart */
  if (MODE === "cart") {
    var listBox = $("[data-cart-list]"), sumBox = $("[data-summary]"), edBox = $("[data-editing]");
    var renderCart = function () {
      var c = getCart();
      var editing = LS.get("um_editing", null), eo = editing && findOrder(editing);
      if (eo && eo.status === "open" && c.length) {
        edBox.hidden = false;
        edBox.innerHTML = '<span><b>Adding to order ' + esc(eo.id) + ".</b> Put these items into that order, or check them out as a new one.</span>" +
          '<div class="btn-row"><button class="btn btn--sm btn--blue" type="button" data-merge>Add to order ' + esc(eo.id) + '</button><button class="btn btn--sm btn--ghost" type="button" data-unedit>New order instead</button></div>';
      } else edBox.hidden = true;
      if (!c.length) {
        listBox.innerHTML = empty("Your cart is empty.", "Find something good in the shop: raw milk, butter, eggs, grass-fed meat and more.", shopBtn);
        sumBox.innerHTML = summary([], '<a class="btn btn--wide is-disabled" aria-disabled="true">Check out</a>');
        return;
      }
      listBox.innerHTML = '<div class="om__cardhead"><h2>' + nItems(c) + " item" + (nItems(c) === 1 ? "" : "s") + '</h2><button class="linkbtn" type="button" data-clear>Empty cart</button></div>' + lines(c, true);
      sumBox.innerHTML = summary(c, '<a class="btn btn--wide" href="' + link("checkout") + '">Check out ' + svg.arrow + '</a><a class="om__keep" href="' + link("shop") + '">Keep shopping</a>');
    };
    listBox.addEventListener("click", function (e) {
      if (e.target.closest("[data-clear]")) { setCart([]); renderCart(); }
    });
    listBox.addEventListener("click", function (e) {
      var row = e.target.closest("[data-i]"); if (!row) return;
      var c = getCart(), i = +row.getAttribute("data-i");
      if (e.target.closest("[data-q]")) c[i].qty = Math.max(1, Math.min(99, c[i].qty + +e.target.closest("[data-q]").getAttribute("data-q")));
      else if (e.target.closest("[data-rm]")) c.splice(i, 1);
      else return;
      setCart(c); renderCart();
    });
    listBox.addEventListener("change", function (e) {
      if (!e.target.matches("[data-qin]")) return;
      var c = getCart(), i = +e.target.closest("[data-i]").getAttribute("data-i");
      c[i].qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)); setCart(c); renderCart();
    });
    edBox.addEventListener("click", function (e) {
      var id = LS.get("um_editing", null), o = id && findOrder(id);
      if (e.target.closest("[data-merge]") && o) {
        o.items = addItems(o.items, getCart()); saveOrder(o); setCart([]); LS.del("um_editing");
        location.href = link("edit-order") + "?id=" + encodeURIComponent(o.id) + "&added=1";
      }
      if (e.target.closest("[data-unedit]")) { LS.del("um_editing"); renderCart(); }
    });
    renderCart();
  }

  /* checkout */
  if (MODE === "checkout") {
    var form = $("[data-checkout]"), sb = $("[data-summary]"), c0 = getCart();
    if (!c0.length) {
      form.outerHTML = '<div class="om__card">' + empty("Nothing to check out yet.", "Your cart is empty. Add a few things from the shop first.", shopBtn) + "</div>";
    } else {
      sb.innerHTML = summary(c0, '<div class="sum__mini">' + c0.map(function (it) {
        return '<div><span class="sum__img">' + imgFor(it) + "</span><span>" + esc(it.name) + "<small>" + esc(it.variant) + " × " + it.qty + "</small></span><b>" + money(it.price * it.qty) + "</b></div>";
      }).join("") + '</div><a class="om__keep" href="' + link("shop-cart") + '">Edit cart</a>');
      $("[data-cash-amt]").textContent = money(sum(c0));
      var last = LS.get("um_contact", null);
      if (last) ["name", "phone", "address", "apt", "access"].forEach(function (k) { if (last[k] && form[k]) form[k].value = last[k]; });
      var syncMethod = function () {
        var pick = form.method.value === "pickup";
        $$("[data-addr]", form).forEach(function (el) { el.hidden = pick; });
        $("[data-pickup-note]").hidden = !pick;
        form.address.required = !pick;
      };
      $$("input[name=method]", form).forEach(function (r) { r.addEventListener("change", syncMethod); });
      syncMethod();
      form.addEventListener("input", function () { $("[data-co-note]").hidden = true; });
      form.addEventListener("change", function () { $("[data-co-note]").hidden = true; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var miss = [];
        if (!form.name.value.trim()) miss.push("your name");
        if (!form.phone.value.trim()) miss.push("a phone number");
        if (form.method.value === "delivery" && !form.address.value.trim()) miss.push("your delivery address");
        if (!form.agree.checked) miss.push("the missed-delivery checkbox");
        var note = $("[data-co-note]");
        if (miss.length) { note.hidden = false; note.textContent = "Almost: please add " + miss.join(", ") + "."; return; }
        var contact = { name: form.name.value.trim(), phone: form.phone.value.trim(), address: form.address.value.trim(), apt: form.apt.value.trim(), access: form.access.value.trim() };
        LS.set("um_contact", contact);
        var ids = allOrders().map(function (o) { return o.id; }), id;
        do { id = "UM-" + (20500 + Math.floor(Math.random() * 9000)); } while (ids.indexOf(id) > -1);
        var o = { id: id, status: "open", placed: today(), method: form.method.value, items: getCart(), note: form.note.value.trim(), contact: contact };
        saveOrder(o); setCart([]); LS.del("um_editing");
        location.href = link("order") + "?id=" + encodeURIComponent(id) + "&new=1";
      });
    }
  }

  function tracker(s) {
    var steps = ["open", "closed", "confirmed", "delivered"];
    if (s === "canceled") return '<div class="track track--x">' + chip("canceled") + "<span>This order was canceled.</span></div>";
    var at = steps.indexOf(s);
    return '<ol class="track">' + steps.map(function (k, i) {
      return '<li class="' + (i < at ? "is-done" : i === at ? "is-on" : "") + '"><i>' + (i < at ? svg.check : i + 1) + "</i><b>" + STATUS[k][0] + "</b>" + (i === at && STATUS[k][1] ? "<small>" + STATUS[k][1] + "</small>" : "") + "</li>";
    }).join("") + "</ol>";
  }
  function details(o) {
    var c = o.contact || {};
    return '<dl class="odet">' +
      "<div><dt>Placed</dt><dd>" + fmtDate(o.placed) + "</dd></div>" +
      "<div><dt>" + (o.method === "pickup" ? "Pickup" : "Delivery") + "</dt><dd>" + (o.day ? fmtDate(o.day) : o.method === "pickup" ? "At your pickup spot" : "Your zone's next delivery day, 11am to midnight") + "</dd></div>" +
      (o.method !== "pickup" && c.address ? "<div><dt>Address</dt><dd>" + esc(c.address) + (c.apt ? ", " + esc(c.apt) : "") + (c.access ? "<small>" + esc(c.access) + "</small>" : "") + "</dd></div>" : "") +
      (o.note ? "<div><dt>Driver notes</dt><dd>" + esc(o.note) + "</dd></div>" : "") +
      "<div><dt>Payment</dt><dd>Cash on delivery</dd></div></dl>";
  }

  /* order placed / order details */
  if (MODE === "order") {
    var ov = $("[data-order-view]"), o = qs("id") ? findOrder(qs("id")) : allOrders()[0];
    if (!o) { ov.innerHTML = '<div class="om__card">' + empty("No order to show.", "Once you check out, your order appears here.", shopBtn) + "</div>"; }
    else {
      var fresh = qs("new") && o.status === "open", first = ((o.contact || {}).name || "").split(" ")[0];
      ov.innerHTML =
        '<header class="om__head' + (fresh ? " om__head--yay" : "") + '">' +
        (fresh ? '<span class="om__yay">' + svg.check + "</span>" : "") +
        '<span class="eyebrow">Order ' + esc(o.id) + (o.sample ? " · sample" : "") + "</span>" +
        "<h1>" + (fresh ? "Thank you" + (first ? ", " + esc(first) : "") + "! <em>It's in.</em>" : "Order <em>" + esc(o.id) + ".</em>") + "</h1>" +
        '<p class="muted">' + (fresh ? "We have your order. You'll get a confirmation email once it's confirmed for your delivery day. Until then you can still change it." : "Placed " + fmtDate(o.placed) + ".") + "</p></header>" +
        tracker(o.status) +
        '<div class="om__grid"><section class="om__card"><div class="om__cardhead"><h2>' + nItems(o.items) + " item" + (nItems(o.items) === 1 ? "" : "s") + "</h2>" + chip(o.status) + "</div>" + lines(o.items, false) + "</section>" +
        '<aside class="om__sum">' + summary(o.items, details(o) +
          (o.status === "open" ? '<a class="btn btn--wide" href="' + link("edit-order") + "?id=" + encodeURIComponent(o.id) + '">View &amp; edit order ' + svg.arrow + "</a>" : '<button class="btn btn--wide" type="button" data-reorder>Order these again ' + svg.arrow + "</button>") +
          '<a class="om__keep" href="' + link("order-history") + '">All my orders</a>') + "</aside></div>";
      var rb = $("[data-reorder]", ov);
      if (rb) rb.addEventListener("click", function () { setCart(addItems(getCart(), o.items)); location.href = link("shop-cart"); });
    }
  }

  /* history */
  if (MODE === "history") {
    var hb = $("[data-history]"), filter = "all";
    var renderHist = function () {
      var list = allOrders().filter(function (o) {
        return filter === "all" || (filter === "open" ? ["open", "closed", "confirmed"].indexOf(o.status) > -1 : ["delivered", "canceled"].indexOf(o.status) > -1);
      });
      if (!list.length) { hb.innerHTML = '<div class="om__card">' + empty("No orders here yet.", "When you place an order, it shows up here.", shopBtn) + "</div>"; return; }
      hb.innerHTML = list.map(function (o) {
        var view = link("order") + "?id=" + encodeURIComponent(o.id), edit = link("edit-order") + "?id=" + encodeURIComponent(o.id);
        return '<article class="ocard"><div class="ocard__top"><div><h2><a href="' + view + '">Order ' + esc(o.id) + "</a></h2>" +
          '<p class="muted">Placed ' + fmtDate(o.placed) + " · " + (o.method === "pickup" ? "Pickup" : "Delivery") + (o.day ? " " + fmtDate(o.day) : "") + " · " + nItems(o.items) + " item" + (nItems(o.items) === 1 ? "" : "s") + (o.sample ? ' · <span class="ocard__sample">sample</span>' : "") + "</p></div>" + chip(o.status) + "</div>" +
          '<div class="ocard__mid"><div class="ocard__thumbs">' + o.items.slice(0, 5).map(function (it) { return '<span title="' + esc(it.name) + '">' + imgFor(it) + "</span>"; }).join("") +
          (o.items.length > 5 ? "<span class=\"ocard__more\">+" + (o.items.length - 5) + "</span>" : "") + "</div>" +
          '<div class="ocard__tot"><small>Total</small><b>' + money(sum(o.items)) + "</b></div></div>" +
          '<div class="ocard__act"><a class="btn btn--sm btn--ghost" href="' + view + '">View order</a>' +
          (o.status === "open" ? '<a class="btn btn--sm" href="' + edit + '">Edit order</a>' : '<button class="btn btn--sm" type="button" data-reorder="' + esc(o.id) + '">Order again</button>') + "</div></article>";
      }).join("");
    };
    $$("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-filter");
        $$("[data-filter]").forEach(function (x) { x.classList.toggle("is-active", x === b); });
        renderHist();
      });
    });
    hb.addEventListener("click", function (e) {
      var r = e.target.closest("[data-reorder]"); if (!r) return;
      var o = findOrder(r.getAttribute("data-reorder"));
      setCart(addItems(getCart(), o.items)); location.href = link("shop-cart");
    });
    renderHist();
  }

  /* view & edit */
  if (MODE === "edit") {
    var ev = $("[data-edit-view]"), oid = qs("id") || (getOrders().filter(function (x) { return x.status === "open"; })[0] || {}).id, ord = oid && findOrder(oid);
    if (!ord) { ev.innerHTML = '<div class="om__card">' + empty("No open order to edit.", "Open orders show up here. Find one in your order history.", '<a class="btn" href="' + link("order-history") + '">Order history ' + svg.arrow + "</a>") + "</div>"; return; }
    var draft = JSON.parse(JSON.stringify(ord)), editable = ord.status === "open" && !ord.sample, armed = false;
    var renderEdit = function (msg) {
      ev.innerHTML =
        '<header class="om__head"><span class="eyebrow">Order ' + esc(draft.id) + (draft.sample ? " · sample" : "") + "</span>" +
        "<h1>" + (editable ? "View &amp; <em>edit.</em>" : "Order <em>" + esc(draft.id) + ".</em>") + "</h1>" +
        '<p class="muted">' + (editable ? "Change quantities, remove items, add more, or update your notes. Changes are possible until the order is closed." : "This order is " + (STATUS[draft.status] || [draft.status])[0].toLowerCase() + ", so it can't be changed online. To change it, call or text 973-413-9585 or email info@uddermilk.com.") + "</p></header>" +
        tracker(draft.status) + (msg ? '<p class="om__msg" role="status">' + msg + "</p>" : "") +
        '<div class="om__grid"><section class="om__card"><div class="om__cardhead"><h2>' + (draft.items.length ? nItems(draft.items) + " item" + (nItems(draft.items) === 1 ? "" : "s") : "No items") + "</h2>" + chip(draft.status) + "</div>" +
        (draft.items.length ? lines(draft.items, editable) : '<p class="muted om__none">Every item is removed. Save to cancel this order, or add more items.</p>') +
        (editable ? '<div class="om__addmore"><button class="btn btn--sm btn--ghost" type="button" data-addmore>+ Add more items</button></div>' +
          '<div class="om__editfs form"><h3>Delivery</h3><div class="choice choice--sm">' +
          '<label class="choice__opt"><input type="radio" name="em" value="delivery"' + (draft.method !== "pickup" ? " checked" : "") + "><span><b>Deliver to my door</b></span></label>" +
          '<label class="choice__opt"><input type="radio" name="em" value="pickup"' + (draft.method === "pickup" ? " checked" : "") + "><span><b>I'll pick it up</b></span></label></div>" +
          '<div class="field"><label for="ed-note">Notes for your driver <span class="opt">optional</span></label><textarea id="ed-note" rows="3" data-note placeholder="Where\'s your cooler? Anything we should know?">' + esc(draft.note || "") + "</textarea></div></div>" : "") +
        "</section>" +
        '<aside class="om__sum">' + summary(draft.items, details(draft) +
          (editable ? '<button class="btn btn--wide" type="button" data-save>Save changes ' + svg.check + "</button>" +
            '<button class="btn btn--wide btn--ghost om__cancel" type="button" data-cancel>' + (armed ? "Tap again to cancel the order" : "Cancel this order") + "</button>"
            : '<button class="btn btn--wide" type="button" data-reorder>Order these again ' + svg.arrow + "</button>") +
          '<a class="om__keep" href="' + link("order-history") + '">Back to my orders</a>') + "</aside></div>";
    };
    bindLines(ev, draft.items, function () { renderEdit(); });
    ev.addEventListener("change", function (e) {
      if (e.target.name === "em") draft.method = e.target.value;
    });
    ev.addEventListener("input", function (e) { if (e.target.matches("[data-note]")) draft.note = e.target.value; });
    ev.addEventListener("click", function (e) {
      if (e.target.closest("[data-save]")) {
        if (!draft.items.length) { draft.status = "canceled"; editable = false; }
        saveOrder(draft); ord = JSON.parse(JSON.stringify(draft));
        renderEdit(draft.status === "canceled" ? "Every item was removed, so the order is canceled." : "Saved. Your order is updated.");
      } else if (e.target.closest("[data-cancel]")) {
        if (!armed) { armed = true; renderEdit(); setTimeout(function () { if (armed) { armed = false; renderEdit(); } }, 5000); return; }
        draft.status = "canceled"; editable = false; armed = false; saveOrder(draft); renderEdit("Your order is canceled.");
      } else if (e.target.closest("[data-addmore]")) {
        saveOrder(draft); LS.set("um_editing", draft.id); location.href = link("shop");
      } else if (e.target.closest("[data-reorder]")) {
        setCart(addItems(getCart(), draft.items)); location.href = link("shop-cart");
      }
    });
    renderEdit(qs("added") ? "Added. The new items are in your order." : "");
  }
})();
