/* Udder Milk: cart, checkout and orders (preview).
   everything is kept in this browser (localStorage) until the site is connected to the member system:
   um_cart     [{key, name, variant, price, qty, url, img, icon}]
   um_editing  id of an open order the shopper is adding items to
   orders + members live in members.js (window.UM). checkout/orders need a log in, like the new site */
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

  /* ---------- phone & tablet menu ---------- */
  var menuBtn = $("[data-menu]"), menu = $("#mmenu");
  if (menuBtn && menu) {
    var setMenu = function (open) { menu.hidden = !open; menuBtn.setAttribute("aria-expanded", open); };
    menuBtn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(menu.hidden); });
    doc.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1180) setMenu(false); });
  }

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
  // one listener for every add-to-cart form, so cards drawn later (search results) work too
  doc.addEventListener("submit", function (e) {
    var f = e.target.closest && e.target.closest("[data-addcart]");
    if (!f) return;
    (function () {
      e.preventDefault();
      var opt = f.v.options[f.v.selectedIndex];
      var q = Math.max(1, Math.min(99, parseInt(f.q.value, 10) || 1));
      var it = { key: f.getAttribute("data-id") + "|" + opt.value, name: f.getAttribute("data-name"), variant: opt.value,
                 price: parseFloat(opt.getAttribute("data-price")), qty: q, url: f.getAttribute("data-url"),
                 img: f.getAttribute("data-img"), icon: f.getAttribute("data-icon") };
      f.q.value = 1;
      addToCart(it, $("button[type=submit]", f));
    })();
  });
  // puts an item in the cart + the little "added" feedback (used by the forms and the quick-add buttons)
  function addToCart(it, btn) {
    setCart(addItems(getCart(), [it]));
    if (btn) { btn.classList.add("is-added"); setTimeout(function () { btn.classList.remove("is-added"); }, 1200); }
    if (cartLink) { cartLink.classList.remove("is-bump"); void cartLink.offsetWidth; cartLink.classList.add("is-bump"); }
    toast('<span class="toast__ok">' + svg.check + '</span><span><b>' + esc(it.name) + '</b> ' + esc(it.variant) + ' × ' + it.qty + ' added</span><a href="' + link("shop-cart") + '">View cart</a>');
  }

  /* ---------- product tiles open up when tapped: a bottom sheet on phones, a pop-up on bigger screens ----------
     phones: lists with 7+ products (.products--grid). desktop/tablet: lists with 8+ (.products--tiles) */
  var phone = window.matchMedia("(max-width: 640px)");
  var veil = null, openTile = null;
  function closeSheet() {
    if (!openTile) return;
    openTile.classList.remove("is-open"); doc.body.classList.remove("sheet-open");
    if (veil) veil.hidden = true;
    var t = openTile; openTile = null; t.focus && t.focus({ preventScroll: true });
  }
  function openSheet(tile) {
    if (!veil) { veil = doc.createElement("div"); veil.className = "sheet-veil"; veil.addEventListener("click", closeSheet); doc.body.appendChild(veil); }
    closeSheet();
    openTile = tile; tile.classList.add("is-open"); doc.body.classList.add("sheet-open"); veil.hidden = false;
    tile.scrollTop = 0;
    var x = $("[data-sheet-close]", tile); if (x) x.focus({ preventScroll: true });
  }
  $$(".products--grid .product, .products--tiles .product").forEach(function (p) { p.setAttribute("tabindex", "-1"); });
  doc.addEventListener("click", function (e) {
    if (openPick && !e.target.closest(".qpick")) { e.preventDefault(); e.stopPropagation(); closePick(); return; }   // tap outside the size list = just close it
    if (e.target.closest(".qadd, .qpick")) return;   // quick add stuff is handled below, dont open the tile
    if (e.target.closest("[data-sheet-close]")) { e.preventDefault(); closeSheet(); return; }
    var tile = e.target.closest(phone.matches ? ".products--grid .product" : ".products--tiles .product");
    if (tile && !tile.classList.contains("is-open")) { e.preventDefault(); e.stopPropagation(); openSheet(tile); }
  }, true);
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (openPick) closePick(); else closeSheet(); } });
  phone.addEventListener && phone.addEventListener("change", closeSheet);   // switching phone <-> desktop layout: just close it

  /* ---------- quick add: the + button on the 3-across tiles and on the homepage "what's new" cards ----------
     one size -> straight into the cart. more than one -> a small size list pops up (over the tile on desktop,
     from the bottom on phones), pick one and it's added. no need to open the product */
  var openPick = null, pickFrom = null;
  function itemFrom(f, opt) {
    return { key: f.getAttribute("data-id") + "|" + opt.value, name: f.getAttribute("data-name"), variant: opt.value,
             price: parseFloat(opt.getAttribute("data-price")), qty: 1, url: f.getAttribute("data-url"),
             img: f.getAttribute("data-img"), icon: f.getAttribute("data-icon") };
  }
  function closePick() {
    if (!openPick) return;
    openPick.remove(); openPick = null; doc.body.classList.remove("qpick-open");
    if (pickFrom) { pickFrom.setAttribute("aria-expanded", "false"); pickFrom.focus({ preventScroll: true }); pickFrom = null; }
  }
  function openPickFor(btn, f) {
    closePick();
    var opts = Array.prototype.slice.call(f.v.options);
    var box = doc.createElement("div");
    box.className = "qpick" + (phone.matches ? " qpick--sheet" : "");
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Pick an option for " + f.getAttribute("data-name"));
    box.innerHTML = '<div class="qpick__head"><span><small>Pick an option</small><b>' + esc(f.getAttribute("data-name")) + '</b></span><button class="qpick__x" type="button" aria-label="Close">×</button></div>' +
      '<ul class="qpick__list">' + opts.map(function (o, i) {
        return '<li><button type="button" data-qpick="' + i + '"><span>' + esc(o.value) + '</span><b>' + money(parseFloat(o.getAttribute("data-price"))) + "</b></button></li>";
      }).join("") + "</ul>";
    box.addEventListener("click", function (e) {
      if (e.target.closest(".qpick__x")) { closePick(); return; }
      var b = e.target.closest("[data-qpick]");
      if (!b) return;
      closePick();
      addToCart(itemFrom(f, opts[+b.getAttribute("data-qpick")]), btn);
    });
    (phone.matches ? doc.body : btn.closest(".product")).appendChild(box);
    if (phone.matches) doc.body.classList.add("qpick-open");
    openPick = box; pickFrom = btn; btn.setAttribute("aria-expanded", "true");
    var first = $("[data-qpick]", box); if (first) first.focus({ preventScroll: true });
  }
  // the + on each tile (added here so the category pages dont need changing)
  $$(".products--tiles .product, .products--grid .product").forEach(function (p) {
    var f = $("form[data-addcart]", p), media = $(".product__media", p);
    if (!f || !media || !f.v || !f.v.options.length) return;
    var many = f.v.options.length > 1, name = f.getAttribute("data-name");
    // small "11 options" tag under the price, so you can tell before tapping (only shows in the tile layout)
    var from = $(".product__from", p);
    if (many && from && !$(".product__opts", p)) {
      var tag = doc.createElement("span");
      tag.className = "product__opts"; tag.textContent = f.v.options.length + " options";
      from.insertAdjacentElement("afterend", tag);
    }
    var b = doc.createElement("button");
    b.type = "button"; b.className = "qadd";
    b.setAttribute("aria-label", many ? "Quick add " + name + ": pick one of " + f.v.options.length + " options" : "Add " + name + " to cart");
    if (many) b.setAttribute("aria-haspopup", "dialog");
    b.innerHTML = svg.plus;
    media.appendChild(b);
  });
  doc.addEventListener("click", function (e) {
    var b = e.target.closest(".qadd");
    if (!b) return;
    e.preventDefault();
    var data = b.getAttribute("data-qadd-item");
    if (data) { try { addToCart(JSON.parse(data), b); } catch (err) {} return; }   // what's new card: one size, baked into the page
    var f = $("form[data-addcart]", b.closest(".product"));
    if (!f) return;
    if (f.v.options.length > 1) openPickFor(b, f); else addToCart(itemFrom(f, f.v.options[0]), b);
  });
  phone.addEventListener && phone.addEventListener("change", closePick);

  /* ---------- shared bits for the account + order pages (members.js uses these too) ---------- */
  var UM = window.UM;
  window.UM_CART = { get: getCart, set: setCart, add: function (items) { setCart(addItems(getCart(), items)); } };
  var STATUS = {
    open: ["Open", "You can still change it"], closed: ["Closed", "Locked in for your delivery day"], confirmed: ["Confirmed", "Packed for your delivery day"],
    out: ["Out for delivery", "On the truck today"], delivered: ["Delivered", ""], canceled: ["Canceled", ""]
  };
  var chip = function (s) { return '<span class="ostat ostat--' + s + '">' + (STATUS[s] || [s])[0] + "</span>"; };
  var typeChip = function (rec) { return '<span class="otype' + (rec ? " otype--rec" : "") + '">' + (rec ? "Recurring" : "Non-recurring") + "</span>"; };
  var fmtDate = function (iso) { if (!iso) return ""; var d = new Date(iso + "T12:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
  var orderTotal = function (o) { return sum(o.items) + (o.deliveryFee || 0); };
  var imgFor = function (it) {
    var ic = ICONS + (it.icon || "basket") + ".webp";
    return it.img ? '<img src="' + esc(it.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'' + ic + '\';this.className=\'is-icon\'">'
                  : '<img class="is-icon" src="' + ic + '" alt="" loading="lazy">';
  };
  function empty(title, text, btns) {
    return '<div class="om__empty"><img src="' + ICONS + 'basket.webp" alt="" width="120" height="120"><h2>' + title + "</h2><p class=\"muted\">" + text + '</p><div class="btn-row">' + btns + "</div></div>";
  }
  var shopBtn = '<a class="btn" href="' + link("shop") + '">Go to the shop ' + svg.arrow + "</a>";
  var preview = UM ? UM.preview : "";
  var qs = function (k) { var m = new RegExp("[?&]" + k + "=([^&]+)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; };
  function steps(at) {
    return '<ol class="om__steps" aria-label="Ordering steps">' + ["Cart", "Check out", "Order placed"].map(function (s, i) {
      return '<li class="' + (i === at ? "is-on" : i < at ? "is-done" : "") + '"><span>' + (i + 1) + "</span>" + s + "</li>";
    }).join("") + "</ol>";
  }
  function table(orders) {
    return '<table class="otable"><thead><tr><th scope="col">Order no.</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col" class="num">Total</th><th scope="col">Order type</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
      orders.map(function (o) {
        var view = link("order") + "?id=" + encodeURIComponent(o.id), n = nItems(o.items);
        return '<tr><td data-label="Order no."><a class="otable__id" href="' + view + '">#' + esc(o.id) + "</a>" + (o.sample ? '<span class="ocard__sample">sample</span>' : "") + "</td>" +
          '<td data-label="Date">' + fmtDate(o.placed) + '</td><td data-label="Status">' + chip(o.status) + "</td>" +
          '<td data-label="Total" class="num"><b>' + money(orderTotal(o)) + "</b><small>" + n + " item" + (n === 1 ? "" : "s") + "</small></td>" +
          '<td data-label="Order type">' + typeChip(o.recurring) + "</td>" +
          '<td class="otable__act"><a class="btn btn--sm btn--ghost" href="' + view + '">View</a>' +
          (o.editable ? '<a class="btn btn--sm" href="' + link("edit-order") + "?id=" + encodeURIComponent(o.id) + '">Edit</a>' : o.items.length ? '<button class="btn btn--sm" type="button" data-again="' + esc(o.id) + '">Order again</button>' : "") + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  function pager(d) {
    var per = 10, from = (d.page - 1) * per + 1, to = Math.min(d.total, d.page * per);
    var nums = [1, d.page - 1, d.page, d.page + 1, d.pages].filter(function (n, i, a) { return n >= 1 && n <= d.pages && a.indexOf(n) === i; }).sort(function (a, b) { return a - b; });
    return '<nav class="pager" aria-label="Pages"><span class="pager__info">Showing ' + from + " to " + to + " of " + d.total + " order" + (d.total === 1 ? "" : "s") + "</span>" +
      (d.pages > 1 ? '<span class="pager__btns"><button type="button" data-page="' + (d.page - 1) + '"' + (d.page <= 1 ? " disabled" : "") + ">Previous</button>" +
        nums.map(function (n, i) { return (i > 0 && n - nums[i - 1] > 1 ? '<span class="pager__gap">…</span>' : "") + '<button type="button" data-page="' + n + '"' + (n === d.page ? ' aria-current="page"' : "") + ">" + n + "</button>"; }).join("") +
        '<button type="button" data-page="' + (d.page + 1) + '"' + (d.page >= d.pages ? " disabled" : "") + ">Next</button></span>" : "") + "</nav>";
  }
  window.UM_ORDERS = { table: table, pager: pager, empty: empty, chip: chip };

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
  function bindLines(box, getItems, onChange) {
    box.addEventListener("click", function (e) {
      var row = e.target.closest("[data-i]"); if (!row || !box.contains(row)) return;
      var items = getItems(), i = +row.getAttribute("data-i");
      if (e.target.closest("[data-q]")) { items[i].qty = Math.max(1, Math.min(99, items[i].qty + +e.target.closest("[data-q]").getAttribute("data-q"))); onChange(items); }
      if (e.target.closest("[data-rm]")) { items.splice(i, 1); onChange(items); }
    });
    box.addEventListener("change", function (e) {
      if (!e.target.matches("[data-qin]")) return;
      var items = getItems(), i = +e.target.closest("[data-i]").getAttribute("data-i");
      items[i].qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)); onChange(items);
    });
  }
  function summary(items, fee, extra) {
    return '<div class="sum"><h2>Order <em>summary</em></h2><dl><div><dt>Items (' + nItems(items) + ")</dt><dd>" + money(sum(items)) + "</dd></div>" +
      (fee != null ? "<div><dt>Delivery fee</dt><dd>" + (fee ? money(fee) : "Free") + "</dd></div>" : "") +
      "<div><dt>Payment</dt><dd>Cash on delivery</dd></div></dl>" +
      '<div class="sum__total"><span>Cash due at your door</span><b>' + money(sum(items) + (fee || 0)) + "</b></div>" + (extra || "") + "</div>";
  }
  function details(o) {
    return '<dl class="odet"><div><dt>Placed</dt><dd>' + fmtDate(o.placed) + "</dd></div>" +
      (o.method === "pickup" ? "<div><dt>Pickup</dt><dd>" + esc(o.pickupLocation ? o.pickupLocation.title : "At your pickup location") + "</dd></div>"
                             : "<div><dt>Delivery</dt><dd>" + (o.deliveryDay ? esc(o.deliveryDay) + ", 11am to midnight" : "Your zone's delivery day") + "</dd></div>") +
      "<div><dt>Order type</dt><dd>" + (o.recurring ? "Recurring" : "One time") + "</dd></div>" +
      (o.note ? "<div><dt>Instructions</dt><dd>" + esc(o.note) + "</dd></div>" : "") +
      "<div><dt>Payment</dt><dd>Cash on delivery</dd></div></dl>";
  }
  function tracker(s) {
    var st = ["open", "closed", "confirmed", "out", "delivered"];
    if (s === "canceled") return '<div class="track track--x">' + chip("canceled") + "<span>This order was canceled.</span></div>";
    var at = st.indexOf(s);
    return '<ol class="track">' + st.map(function (k, i) {
      return '<li class="' + (i < at ? "is-done" : i === at ? "is-on" : "") + '"><i>' + (i < at ? svg.check : i + 1) + "</i><b>" + STATUS[k][0] + "</b>" + (i === at && STATUS[k][1] ? "<small>" + STATUS[k][1] + "</small>" : "") + "</li>";
    }).join("") + "</ol>";
  }
  // "Order Preferences" like the new site: zone, recurring, delivery or pickup, day, location, notes
  function prefsBox(c, p, errs) {
    var z = c && c.zone, sel = function (a, b) { return a === b ? " selected" : ""; };
    return '<div class="prefs">' +
      (z ? '<dl class="prefs__zone"><div><dt>My zone</dt><dd>' + esc(z.name) + "</dd></div><div><dt>Cut-off day</dt><dd>" + esc(z.cutOffDay) + "</dd></div><div><dt>Delivery day</dt><dd>" + esc(z.deliveryDays.join(", ")) + "</dd></div></dl>" : "") +
      '<label class="check prefs__rec"><input type="checkbox" data-p="recurring"' + (p.recurring ? " checked" : "") + "><span><b>Make it a recurring order</b><small>The same order every delivery day, until you change or cancel it.</small></span></label>" +
      '<div class="field"><label for="pf-method">Delivery settings</label><select id="pf-method" data-p="method"><option value="delivery"' + sel(p.method, "delivery") + ">Delivery" + (c && c.deliveryFee ? " (" + money(c.deliveryFee) + " fee)" : "") + '</option><option value="pickup"' + sel(p.method, "pickup") + ">Pick up location</option></select></div>" +
      (p.method === "delivery"
        ? '<div class="field"><label for="pf-day">Select delivery day</label><select id="pf-day" data-p="deliveryDay"' + (errs.deliveryDay ? ' aria-invalid="true"' : "") + '><option value="">Select day</option>' +
          (z ? z.deliveryDays.map(function (d) { return '<option value="' + d + '"' + sel(p.deliveryDay, d) + ">" + d + "</option>"; }).join("") : "") + "</select>" +
          (errs.deliveryDay ? '<span class="field__err" role="alert">' + errs.deliveryDay + "</span>" : "") + "<span class=\"field__hint\">We deliver 11am to midnight. Leave a cooler with ice if you won't be home.</span></div>"
        : '<div class="field"><label for="pf-loc">Pick up location</label><select id="pf-loc" data-p="pickupLocationId"' + (errs.pickupLocationId ? ' aria-invalid="true"' : "") + '><option value="">Select location</option>' +
          (c ? c.pickupLocations.map(function (l) { return '<option value="' + l.id + '"' + sel(p.pickupLocationId, l.id) + ">" + esc(l.title) + "</option>"; }).join("") : "") + "</select>" +
          (errs.pickupLocationId ? '<span class="field__err" role="alert">' + errs.pickupLocationId + "</span>" : "") + "</div>") +
      '<div class="field"><label for="pf-note">Additional instructions <span class="opt">optional</span></label><textarea id="pf-note" rows="3" data-p="note" placeholder="Where\'s your cooler? Door code? Anything we should know?">' + esc(p.note) + "</textarea></div></div>";
  }
  function checkPrefs(p) {
    var e = {};
    if (p.method === "delivery" && !p.deliveryDay) e.deliveryDay = "Please select a delivery day";
    if (p.method === "pickup" && !p.pickupLocationId) e.pickupLocationId = "Please select a pick up location";
    return e;
  }
  function bindPrefs(box, p, onChange) {
    var upd = function (e) {
      var k = e.target.getAttribute && e.target.getAttribute("data-p"); if (!k) return;
      p[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      onChange(k, e.type);
    };
    box.addEventListener("change", upd);
    box.addEventListener("input", function (e) { if (e.target.getAttribute && e.target.getAttribute("data-p") === "note") p.note = e.target.value; });
  }

  /* ---------- the order pages ---------- */
  var om = $("[data-om]");
  if (!om) return;
  var MODE = om.getAttribute("data-om");
  var me = UM && UM.member();

  /* cart (open to everyone) */
  if (MODE === "cart") {
    var renderCart = function () {
      var c = getCart(), editing = LS.get("um_editing", null), eo = editing && me && UM.orders.get(editing);
      om.innerHTML = '<div class="om">' + preview + steps(0) +
        '<header class="om__head"><span class="eyebrow"><img src="' + ICONS + 'shopping-cart.webp" alt="" width="20" height="20">My cart</span><h1>Your <em>cart.</em></h1><p class="muted">Order before your cut-off and it comes on your next delivery day. Pay cash at your door.</p></header>' +
        (eo && eo.editable && c.length ? '<div class="om__editing"><span><b>Adding to order ' + esc(eo.id) + ".</b> Put these items into that order, or check them out as a new one.</span>" +
          '<div class="btn-row"><button class="btn btn--sm btn--blue" type="button" data-merge>Add to order ' + esc(eo.id) + '</button><button class="btn btn--sm btn--ghost" type="button" data-unedit>New order instead</button></div></div>' : "") +
        '<div class="om__grid"><section class="om__card" aria-label="Items in your cart">' +
        (c.length ? '<div class="om__cardhead"><h2>' + nItems(c) + " item" + (nItems(c) === 1 ? "" : "s") + '</h2><button class="linkbtn" type="button" data-clear>Empty cart</button></div>' + lines(c, true)
                  : empty("Your cart is empty.", "Find something good in the shop: raw milk, butter, eggs, grass-fed meat and more.", shopBtn)) +
        '</section><aside class="om__sum">' + summary(c, null, (c.length ? '<a class="btn btn--wide" href="' + link("checkout") + '">Check out ' + svg.arrow + "</a>" : '<span class="btn btn--wide is-disabled" aria-disabled="true">Check out</span>') +
          '<a class="om__keep" href="' + link("shop") + '">Keep shopping</a>') + "</aside></div></div>";
    };
    bindLines(om, getCart, function (items) { setCart(items); renderCart(); });
    om.addEventListener("click", function (e) {
      if (e.target.closest("[data-clear]")) { setCart([]); renderCart(); }
      if (e.target.closest("[data-unedit]")) { LS.del("um_editing"); renderCart(); }
      if (e.target.closest("[data-merge]")) {
        var id = LS.get("um_editing", null), o = id && UM.orders.get(id);
        if (!o) { LS.del("um_editing"); renderCart(); return; }
        var r = UM.orders.update(o.id, { items: addItems(o.items, getCart()) });
        if (r.error) { toast(esc(r.error)); return; }
        setCart([]); LS.del("um_editing");
        location.href = link("edit-order") + "?id=" + encodeURIComponent(o.id) + "&added=1";
      }
    });
    renderCart();
    return;
  }

  // everything below is members only
  var WHAT = { checkout: "check out", order: "see your orders", edit: "see your orders" };
  if (!me) { UM.gate(om, WHAT[MODE] || "see your orders"); return; }

  /* checkout, laid out like the new site: your items on the left, order preferences on the right */
  if (MODE === "checkout") {
    var c = UM.conditions(), items = getCart(), errs = {}, msg = "";
    var p = { recurring: false, method: "delivery", deliveryDay: me.deliveryDay || (c.zone && c.zone.deliveryDays.length === 1 ? c.zone.deliveryDays[0] : ""), pickupLocationId: "", note: "" };
    if (!c.zone) p.method = "pickup";
    var renderCo = function () {
      if (!items.length) { om.innerHTML = '<div class="om">' + preview + steps(1) + '<div class="om__card" style="margin-top:26px">' + empty("Nothing to check out yet.", "Your cart is empty. Add a few things from the shop first.", shopBtn) + "</div></div>"; return; }
      var subtotal = sum(items), fee = p.method === "pickup" ? 0 : c.deliveryFee, min = c.zone ? c.zone.minimumTotal : 0, short = Math.max(0, min - subtotal), a = me.address;
      om.innerHTML = '<div class="om">' + preview + steps(1) +
        '<header class="om__head"><span class="eyebrow"><img src="' + ICONS + 'delivery-truck.webp" alt="" width="20" height="20">Check out</span><h1>Almost <em>there.</em></h1><p class="muted">Carefully check your items and preferences before placing your order. Payment is cash on delivery.</p></header>' +
        '<div class="om__grid co"><section class="om__card co__items" aria-labelledby="co-items"><div class="om__cardhead"><h2 id="co-items">Your items</h2><a class="btn btn--sm btn--ghost" href="' + link("shop-cart") + '">Go to cart</a></div>' +
        '<table class="cotable"><thead><tr><th scope="col"><span class="sr-only">Photo</span></th><th scope="col">Product</th><th scope="col" class="num">Price × Qty</th><th scope="col" class="num">Subtotal</th></tr></thead><tbody>' +
        items.map(function (it) {
          return '<tr><td class="cotable__img">' + imgFor(it) + '</td><td><a href="' + ROOT + esc(it.url) + '" class="cotable__name">' + esc(it.name) + "</a><small>" + esc(it.variant) + "</small></td>" +
            '<td class="num" data-label="Price × Qty">' + money(it.price) + " × " + it.qty + '</td><td class="num" data-label="Subtotal"><b>' + money(it.price * it.qty) + "</b></td></tr>";
        }).join("") + "</tbody><tfoot>" +
        '<tr><th scope="row" colspan="3">Items (' + nItems(items) + ')</th><td class="num">' + money(subtotal) + "</td></tr>" +
        '<tr><th scope="row" colspan="3">Delivery fee</th><td class="num">' + (p.method === "pickup" ? "Pickup" : fee ? money(fee) : "Free") + "</td></tr>" +
        '<tr class="cotable__total"><th scope="row" colspan="3">Total, paid on delivery (cash, Zelle or Venmo)</th><td class="num">' + money(subtotal + fee) + "</td></tr></tfoot></table>" +
        (min > 0 ? '<div class="comin' + (short > 0 ? "" : " is-met") + '" role="status"><div class="comin__bar"><span style="width:' + Math.min(100, subtotal / min * 100) + '%"></span></div><p>' +
          (short > 0 ? "Your zone has a <b>" + money(min) + "</b> minimum. Add <b>" + money(short) + '</b> more to check out. <a href="' + link("shop") + '">Keep shopping</a>' : "You've reached your zone's " + money(min) + " minimum.") + "</p></div>" : "") +
        (p.method === "delivery" ? (a ? '<p class="co__addr">Delivering to <b>' + esc(a.streetNo + " " + a.street + (a.apt ? ", " + a.apt : "") + ", " + a.city + ", " + a.state + " " + a.zip) + '</b>. <a href="' + link("account/address") + '">Change address</a></p>'
                                     : '<p class="co__addr">No delivery address on your account yet. <a href="' + link("account/address") + '">Add your address</a></p>') : "") +
        '</section><aside class="om__sum"><form class="sum co__prefs form" novalidate><h2>Order <em>preferences</em></h2>' + prefsBox(c, p, errs) +
        (msg ? '<p class="form__note" role="alert">' + msg + "</p>" : "") +
        '<button class="btn btn--wide" type="submit">Place order · ' + money(subtotal + fee) + " " + svg.arrow + "</button>" +
        "<p class=\"om__fine\">You can change your order until your zone's cut-off. If no one's home and there's no cooler with payment, 50% of the order is added to your next one. <a href=\"" + link("where-we-deliver") + '#delivery-day">Delivery details</a></p></form></aside></div></div>';
    };
    bindPrefs(om, p, function (k) { errs = {}; msg = ""; if (k !== "note") renderCo(); });
    om.addEventListener("submit", function (e) {
      e.preventDefault();
      errs = checkPrefs(p);
      var min = c.zone ? c.zone.minimumTotal : 0, short = Math.max(0, min - sum(items));
      if (Object.keys(errs).length) { renderCo(); return; }
      if (short > 0) { msg = "Minimum order price is " + money(min) + ". Add " + money(short) + " more to your cart to meet it."; renderCo(); return; }
      var loc = c.pickupLocations.filter(function (l) { return l.id === p.pickupLocationId; })[0];
      var r = UM.orders.create({ items: items, method: p.method, deliveryDay: p.method === "delivery" ? p.deliveryDay : "", pickupLocation: p.method === "pickup" ? loc : null,
        recurring: p.recurring, note: p.note.trim(), deliveryFee: p.method === "pickup" ? 0 : c.deliveryFee });
      if (r.error) { msg = esc(r.error); renderCo(); return; }
      setCart([]); LS.del("um_editing");
      location.href = link("order") + "?id=" + encodeURIComponent(r.order.id) + "&new=1";
    });
    renderCo();
  }

  /* one order */
  if (MODE === "order") {
    var o = qs("id") ? UM.orders.get(qs("id")) : UM.orders.list(1).orders[0];
    if (!o) { om.innerHTML = '<div class="om">' + preview + '<div class="om__card">' + empty("No order to show.", "Once you check out, your order appears here.", shopBtn) + "</div></div>"; }
    else {
      var fresh = qs("new") && o.status === "open";
      om.innerHTML = '<div class="om">' + preview + steps(2) +
        '<header class="om__head' + (fresh ? " om__head--yay" : "") + '">' + (fresh ? '<span class="om__yay">' + svg.check + "</span>" : "") +
        '<span class="eyebrow">Order #' + esc(o.id) + (o.sample ? " · sample" : "") + "</span>" +
        "<h1>" + (fresh ? "Thank you" + (me.firstName ? ", " + esc(me.firstName) : "") + "! <em>It's in.</em>" : "Order <em>#" + esc(o.id) + ".</em>") + "</h1>" +
        '<p class="muted">' + (fresh ? "We have your order" + (o.deliveryDay ? " for " + esc(o.deliveryDay) : "") + (o.recurring ? ", and it repeats every delivery day" : "") + ". You can still change it until your zone's cut-off." : "Placed " + fmtDate(o.placed) + ".") + "</p></header>" +
        tracker(o.status) +
        '<div class="om__grid"><section class="om__card"><div class="om__cardhead"><h2>' + nItems(o.items) + " item" + (nItems(o.items) === 1 ? "" : "s") + '</h2><span class="om__chips">' + typeChip(o.recurring) + chip(o.status) + "</span></div>" + lines(o.items, false) + "</section>" +
        '<aside class="om__sum">' + summary(o.items, o.deliveryFee, details(o) +
          (o.editable ? '<a class="btn btn--wide" href="' + link("edit-order") + "?id=" + encodeURIComponent(o.id) + '">View &amp; edit order ' + svg.arrow + "</a>" : '<button class="btn btn--wide" type="button" data-reorder>Order these again ' + svg.arrow + "</button>") +
          '<a class="om__keep" href="' + link("order-history") + '">All my orders</a>') + "</aside></div></div>";
      var rb = $("[data-reorder]", om);
      if (rb) rb.addEventListener("click", function () { setCart(addItems(getCart(), o.items)); location.href = link("shop-cart"); });
    }
  }

  /* view & edit */
  if (MODE === "edit") {
    var id = qs("id") || (UM.orders.list(1).orders.filter(function (x) { return x.editable; })[0] || {}).id;
    var saved = id && UM.orders.get(id);
    var tabs = '<nav class="om__tabs" aria-label="Your account"><a href="' + link("account") + '">My account</a><a href="' + link("order-history") + '">Order history</a><a href="' + link("shop-cart") + '">Cart</a></nav>';
    if (!saved) { om.innerHTML = '<div class="om">' + preview + tabs + '<div class="om__card">' + empty("No open order to edit.", "Open orders show up here. Find one in your order history.", '<a class="btn" href="' + link("order-history") + '">Order history ' + svg.arrow + "</a>") + "</div></div>"; return; }
    var cond = UM.conditions(), armed = false, emsg = qs("added") ? "Added. The new items are in your order." : "", eerr = {};
    var draft = JSON.parse(JSON.stringify(saved));
    var ep = { recurring: !!saved.recurring, method: saved.method || "delivery", deliveryDay: saved.deliveryDay || "", pickupLocationId: saved.pickupLocation ? saved.pickupLocation.id : "", note: saved.note || "" };
    var renderEdit = function () {
      var editable = !!saved.editable, fee = ep.method === "pickup" ? 0 : saved.method === "pickup" ? cond.deliveryFee : saved.deliveryFee;
      om.innerHTML = '<div class="om">' + preview + tabs +
        '<header class="om__head"><span class="eyebrow">Order #' + esc(draft.id) + (draft.sample ? " · sample" : "") + "</span>" +
        "<h1>" + (editable ? "View &amp; <em>edit.</em>" : "Order <em>#" + esc(draft.id) + ".</em>") + "</h1>" +
        '<p class="muted">' + (editable ? "Change quantities, remove items, add more, or change your delivery settings. Changes are possible until your zone's cut-off." : "This order is " + (STATUS[saved.status] || [saved.status])[0].toLowerCase() + ", so it can't be changed online. To change it, call or text 973-413-9585 or email info@uddermilk.com.") + "</p></header>" +
        tracker(saved.status) + (emsg ? '<p class="om__msg" role="status">' + emsg + "</p>" : "") +
        '<div class="om__grid"><section class="om__card"><div class="om__cardhead"><h2>' + (draft.items.length ? nItems(draft.items) + " item" + (nItems(draft.items) === 1 ? "" : "s") : "No items") + '</h2><span class="om__chips">' + typeChip(saved.recurring) + chip(saved.status) + "</span></div>" +
        (draft.items.length ? lines(draft.items, editable) : '<p class="muted om__none">Every item is removed. Save to cancel this order, or add more items.</p>') +
        (editable ? '<div class="om__addmore"><button class="btn btn--sm btn--ghost" type="button" data-addmore>+ Add more items</button></div><div class="om__editfs form"><h3>Order settings</h3>' + prefsBox(cond, ep, eerr) + "</div>" : "") +
        '</section><aside class="om__sum">' + summary(draft.items, fee, details(draft) +
          (editable ? '<button class="btn btn--wide" type="button" data-save>Save changes ' + svg.check + '</button><button class="btn btn--wide btn--ghost om__cancel" type="button" data-cancel>' + (armed ? "Tap again to cancel the order" : "Cancel this order") + "</button>"
                    : '<button class="btn btn--wide" type="button" data-reorder>Order these again ' + svg.arrow + "</button>") +
          '<a class="om__keep" href="' + link("order-history") + '">Back to my orders</a>') + "</aside></div></div>";
    };
    bindLines(om, function () { return draft.items; }, function () { renderEdit(); });
    bindPrefs(om, ep, function (k) { eerr = {}; if (k !== "note") renderEdit(); });
    om.addEventListener("click", function (e) {
      if (e.target.closest("[data-save]")) {
        if (draft.items.length) { eerr = checkPrefs(ep); if (Object.keys(eerr).length) { renderEdit(); return; } }
        var loc = cond.pickupLocations.filter(function (l) { return l.id === ep.pickupLocationId; })[0];
        var r = UM.orders.update(draft.id, { items: draft.items, method: ep.method, deliveryDay: ep.method === "delivery" ? ep.deliveryDay : "", pickupLocation: ep.method === "pickup" ? loc : null,
          recurring: ep.recurring, note: ep.note.trim(), deliveryFee: ep.method === "pickup" ? 0 : cond.deliveryFee });
        if (r.error) emsg = esc(r.error);
        else { saved = r.order; draft = JSON.parse(JSON.stringify(saved)); emsg = saved.status === "canceled" ? "Every item was removed, so the order is canceled." : "Saved. Your order is updated."; }
        renderEdit();
      } else if (e.target.closest("[data-cancel]")) {
        if (!armed) { armed = true; renderEdit(); setTimeout(function () { if (armed) { armed = false; renderEdit(); } }, 5000); return; }
        var rc = UM.orders.update(draft.id, { status: "canceled" });
        armed = false; if (!rc.error) { saved = rc.order; draft = JSON.parse(JSON.stringify(saved)); emsg = "Your order is canceled."; } else emsg = esc(rc.error);
        renderEdit();
      } else if (e.target.closest("[data-addmore]")) {
        LS.set("um_editing", draft.id); location.href = link("shop");
      } else if (e.target.closest("[data-reorder]")) {
        setCart(addItems(getCart(), draft.items)); location.href = link("shop-cart");
      }
    });
    renderEdit();
  }
})();
