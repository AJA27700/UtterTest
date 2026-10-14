/* members: log in, sign up and the account area
   this is the preview version: everything is saved in THIS browser (localStorage), nothing goes to Udder Milk.
   when the real member system is plugged in, the functions in window.UM are what change.
     um_members   {email: member}          um_session  email of whoever's logged in
     um_orders2   {memberId: [orders]}     newest first
   zones are looked up by ZIP code (sample zones, same as the next.js preview) */
(function () {
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var SS = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  var cartLink = $("[data-cart-link]");
  var ROOT = cartLink ? cartLink.getAttribute("href").replace(/shop-cart\/(index\.html)?$/, "") : "";
  var link = function (p) { return ROOT + p + "/index.html"; };
  var icon = function (n) { return ROOT + "assets/icons/" + n + ".webp"; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var money = function (n) { return n == null ? "" : "$" + (Math.round(n * 100) / 100).toFixed(2); };
  var SVG = function (w, d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="' + w + '">' + d + "</svg>"; };
  var I = {
    arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: SVG(3, '<path d="M5 12.5l4.5 4.5L19 7"/>'),
    user: SVG(2, '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    bag: SVG(2, '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>'),
    leaf: SVG(2.2, '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>')
  };

  /* ---------- zones (sample, by ZIP). the real ones come from the backend ---------- */
  var ZONES = [
    { t: function (z) { return /^112/.test(z); }, zone: { name: "12", cutOffDay: "Monday", deliveryDays: ["Wednesday", "Saturday"], deliveryFee: 5, minimumTotal: 40 } }, // brooklyn
    { t: function (z) { return /^10[0-4]/.test(z); }, zone: { name: "14", cutOffDay: "Sunday", deliveryDays: ["Tuesday"], deliveryFee: 5, minimumTotal: 50 } }, // manhattan, bronx
    { t: function (z) { return /^11[013-6]/.test(z); }, zone: { name: "20", cutOffDay: "Tuesday", deliveryDays: ["Thursday"], deliveryFee: 7, minimumTotal: 50 } }, // queens, long island
    { t: function (z) { return /^07/.test(z); }, zone: { name: "50", cutOffDay: "Monday", deliveryDays: ["Wednesday"], deliveryFee: 5, minimumTotal: 40 } }, // north jersey
    { t: function (z) { return /^08/.test(z); }, zone: { name: "52", cutOffDay: "Wednesday", deliveryDays: ["Friday"], deliveryFee: 7, minimumTotal: 50 } }, // south jersey
    { t: function (z) { return /^1[5-9]/.test(z); }, zone: { name: "3", cutOffDay: "Thursday", deliveryDays: ["Saturday"], deliveryFee: 0, minimumTotal: 30 } } // pennsylvania
  ];
  var PICKUP = [{ id: "p1", title: "Sample pickup location 1" }, { id: "p2", title: "Sample pickup location 2" }];
  function zoneFor(a) {
    if (!a || !a.zip) return null;
    var zip = String(a.zip).replace(/\D/g, "").slice(0, 5);
    for (var i = 0; i < ZONES.length; i++) if (ZONES[i].t(zip)) return JSON.parse(JSON.stringify(ZONES[i].zone));
    return null;
  }
  function withZone(m) {
    m.zone = zoneFor(m.address);
    if (!m.zone) m.deliveryDay = "";
    else if (m.zone.deliveryDays.indexOf(m.deliveryDay) < 0) m.deliveryDay = m.zone.deliveryDays[0];
    return m;
  }
  // not real security, its a preview in your own browser. just so passwords arent sitting there in plain text
  function hash(s) { var h = 5381; s = "um:" + s; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(16); }

  /* ---------- members + session ---------- */
  var DEMO = "demo@uddermilk.test";
  var getMembers = function () { return LS.get("um_members", {}); };
  var setMembers = function (m) { LS.set("um_members", m); };
  (function seed() {
    var all = getMembers();
    if (all[DEMO]) return;
    all[DEMO] = { id: "m-demo", firstName: "Demo", lastName: "Member", email: DEMO, phone: "(973) 555-0100", phone2: "",
      address: { streetNo: "210", street: "Grand St", apt: "", city: "Brooklyn", state: "NY", zip: "11211", country: "USA" },
      deliveryDay: "Wednesday", pw: hash("udder-demo") };
    setMembers(all);
  })();
  function sessionEmail() { return SS.get("um_session") || LS.get("um_session", null); }
  function current() {
    var e = sessionEmail(), m = e && getMembers()[e];
    if (!m) return null;
    m = withZone(JSON.parse(JSON.stringify(m)));
    delete m.pw;
    return m;
  }
  function save(m) { var all = getMembers(), old = all[m.email] || {}; m.pw = old.pw; delete m.zone; all[m.email] = m; setMembers(all); }

  /* ---------- orders ---------- */
  function samples() {
    var milk = { key: "raw-cow-milk|gallon", name: "Raw Cow Milk", variant: "Jersey 6.3% A2/A2 · gallon", price: 11, qty: 2, url: "category/cow-dairy/index.html", img: null, icon: "glass-of-milk" };
    var eggs = { key: "heritage-eggs|Dozen", name: "Heritage Eggs", variant: "Dozen", price: 9, qty: 1, url: "category/eggs/index.html", img: null, icon: "egg" };
    var butter = { key: "raw-grass-fed-butter|pint", name: "Raw Grass-Fed Butter", variant: "Guernsey unsalted · pint", price: 22, qty: 1, url: "category/cow-dairy/index.html", img: null, icon: "butter" };
    var b = function (o) { o.method = "delivery"; o.deliveryDay = "Wednesday"; o.deliveryFee = 5; o.note = o.note || ""; o.sample = true; return o; };
    return [
      b({ id: "UM-20417", status: "delivered", placed: "2026-09-29", recurring: true, items: [milk, eggs, butter], note: "Cooler on the back porch." }),
      b({ id: "UM-20288", status: "delivered", placed: "2026-09-15", recurring: false, items: [eggs, butter] }),
      b({ id: "UM-20101", status: "canceled", placed: "2026-09-01", recurring: false, items: [milk] })
    ];
  }
  function allOrders() { return LS.get("um_orders2", {}); }
  function ordersOf(m) {
    var all = allOrders();
    if (!all[m.id]) { all[m.id] = m.id === "m-demo" ? samples() : []; LS.set("um_orders2", all); }
    return all[m.id].map(function (o) { o.editable = !o.sample && (o.status === "open" || (o.recurring && o.status !== "canceled" && o.status !== "delivered")); return o; });
  }
  function saveOrders(m, list) { var all = allOrders(); all[m.id] = list.map(function (o) { delete o.editable; return o; }); LS.set("um_orders2", all); }
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var sum = function (items) { return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0); };

  /* ---------- the "backend". swap these for real API calls later ---------- */
  var UM = window.UM = {
    root: ROOT, link: link, icon: icon, esc: esc, money: money, I: I, LS: LS, today: today, sum: sum,
    member: current,
    login: function (email, pw, remember) {
      var m = getMembers()[String(email).trim().toLowerCase()];
      if (!m || m.pw !== hash(pw)) return { error: "That email and password don't match an account." };
      LS.del("um_session"); SS.del("um_session");
      if (remember) LS.set("um_session", m.email); else SS.set("um_session", m.email);
      return { member: current() };
    },
    logout: function () { LS.del("um_session"); SS.del("um_session"); },
    signup: function (d) {
      var email = d.email.trim().toLowerCase(), all = getMembers();
      if (all[email]) return { error: "There's already an account with that email. Try logging in." };
      all[email] = { id: "m-" + Date.now().toString(36), firstName: d.firstName.trim(), lastName: d.lastName.trim(), email: email,
        phone: d.primaryPhone.trim(), phone2: (d.secondaryPhone || "").trim(), deliveryDay: "",
        address: { streetNo: d.streetNo.trim(), street: d.street_address.trim(), apt: (d.appartmentName || "").trim(), city: d.city.trim(), state: d.state.trim().toUpperCase(), zip: d.zip.trim(), country: "USA" },
        pw: hash(d.password) };
      setMembers(all);
      SS.set("um_session", email);
      return { member: current() };
    },
    updateProfile: function (f) {
      var m = current(); if (!m) return { error: "Please log in again." };
      var email = f.email.trim().toLowerCase();
      if (!f.firstName.trim() || !f.lastName.trim()) return { error: "Please fill in your first and last name." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "That email address doesn't look right." };
      var all = getMembers();
      if (email !== m.email) {
        if (all[email]) return { error: "Another account already uses that email." };
        all[email] = all[m.email]; delete all[m.email];
        if (SS.get("um_session")) SS.set("um_session", email); else LS.set("um_session", email);
      }
      var r = all[email];
      r.firstName = f.firstName.trim(); r.lastName = f.lastName.trim(); r.email = email; r.phone = f.phone.trim(); r.phone2 = f.phone2.trim();
      setMembers(all);
      return { member: current() };
    },
    updateAddress: function (a) {
      var m = current(); if (!m) return { error: "Please log in again." };
      if (!a.streetNo.trim() || !a.street.trim() || !a.city.trim()) return { error: "Please fill in your street number, street and city." };
      if (!/^[A-Za-z]{2}$/.test(a.state.trim())) return { error: "Use the 2-letter state, e.g. NY." };
      if (!/^\d{5}(-\d{4})?$/.test(a.zip.trim())) return { error: "Enter a 5-digit ZIP code." };
      m.address = { streetNo: a.streetNo.trim(), street: a.street.trim(), apt: a.apt.trim(), city: a.city.trim(), state: a.state.trim().toUpperCase(), zip: a.zip.trim(), country: "USA" };
      save(withZone(m));
      return { member: current() };
    },
    setDay: function (day) {
      var m = current(); if (!m || !m.zone || m.zone.deliveryDays.indexOf(day) < 0) return { error: "That day isn't available in your zone." };
      m.deliveryDay = day; save(m); return { member: current() };
    },
    changePassword: function (cur, next) {
      var m = current(), all = getMembers(); if (!m) return { error: "Please log in again." };
      if (all[m.email].pw !== hash(cur)) return { error: "Your current password is not right." };
      all[m.email].pw = hash(next); setMembers(all); return { ok: true };
    },
    conditions: function () { var m = current(); return { zone: m && m.zone, pickupLocations: PICKUP, deliveryFee: m && m.zone ? m.zone.deliveryFee : 0 }; },
    orders: {
      list: function (page) {
        var m = current(), list = m ? ordersOf(m) : [], per = 10, pages = Math.max(1, Math.ceil(list.length / per));
        page = Math.min(Math.max(1, page || 1), pages);
        return { orders: list.slice((page - 1) * per, page * per), total: list.length, page: page, pages: pages };
      },
      get: function (id) { var m = current(); return m ? ordersOf(m).filter(function (o) { return o.id === id; })[0] || null : null; },
      create: function (o) {
        var m = current(); if (!m) return { error: "Please log in again." };
        var list = ordersOf(m), ids = list.map(function (x) { return x.id; }), id;
        do { id = "UM-" + (20500 + Math.floor(Math.random() * 9000)); } while (ids.indexOf(id) > -1);
        o.id = id; o.status = "open"; o.placed = today();
        list.unshift(o); saveOrders(m, list);
        return { order: UM.orders.get(id) };
      },
      update: function (id, patch) {
        var m = current(); if (!m) return { error: "Please log in again." };
        var list = ordersOf(m), o = list.filter(function (x) { return x.id === id; })[0];
        if (!o) return { error: "That order no longer exists." };
        if (!o.editable) return { error: "This order is locked, so it can't be changed online." };
        for (var k in patch) o[k] = patch[k];
        if (!o.items.length) o.status = "canceled";
        saveOrders(m, list);
        return { order: UM.orders.get(id) };
      }
    },
    // member-only pages: logged out = a log-in card instead of the page
    gate: function (box, what) {
      box.innerHTML = '<div class="om"><div class="om__card om__gate"><div class="om__empty"><img src="' + icon("bust-in-silhouette") + '" alt="" width="110" height="110">' +
        "<h2>Log in to " + esc(what) + ".</h2><p class=\"muted\">Udder Milk is a private members' association, so ordering is for members. It takes a minute to join.</p>" +
        '<div class="btn-row"><a class="btn" href="' + link("login") + "?next=" + here() + '">Log in ' + I.arrow + '</a><a class="btn btn--ghost" href="' + link("signup") + "?next=" + here() + '">Sign up</a></div></div></div></div>';
    },
    preview: '<div class="om__preview" role="note">' + I.leaf + "<span><b>Preview.</b> Your account, cart and orders are saved in this browser only. Nothing is sent to Udder Milk yet.</span></div>"
  };
  // this page's address inside the site (e.g. "checkout/index.html?x=1"), for ?next=
  function here() {
    var depth = (ROOT.match(/\.\.\//g) || []).length;
    var parts = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "").split("/");
    var rel = depth ? parts.slice(parts.length - depth).join("/") + "/" : "";
    return encodeURIComponent(rel + "index.html" + location.search);
  }
  // where to go after logging in: ?next=<page inside the site>, or the account
  function goNext(fallback) {
    var m = /[?&]next=([^&]+)/.exec(location.search), n = m ? decodeURIComponent(m[1]) : "";
    location.href = n && !/^([a-z]+:|\/\/|\/)/i.test(n) && n.indexOf("..") < 0 ? ROOT + n : link(fallback);
  }

  /* ---------- header: "Hi, name" + log out when logged in ---------- */
  var me = current();
  var acctNav = $(".topstrip__acct");
  if (acctNav && me) {
    $$("a", acctNav).forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (/order-history\/(index\.html)?$/.test(h)) a.setAttribute("href", link("account"));
      if (/login\/(index\.html)?$/.test(h)) { a.className = "topstrip__hi"; a.setAttribute("href", link("account")); a.innerHTML = I.user + "Hi, " + esc(me.firstName); }
      if (/signup\/(index\.html)?$/.test(h)) {
        var b = doc.createElement("button"); b.type = "button"; b.className = "topstrip__out"; b.textContent = "Log out";
        b.addEventListener("click", function () { UM.logout(); location.href = ROOT + "index.html"; });
        a.parentNode.replaceChild(b, a);
      }
    });
    $$(".mmenu__extra a").forEach(function (a) {
      if (/order-history\/(index\.html)?$/.test(a.getAttribute("href") || "")) { a.setAttribute("href", link("account")); a.lastChild.textContent = "My account"; }
    });
  }

  /* ---------- log in ---------- */
  var lf = $("form[data-login]");
  if (lf) {
    var REMEMBER = "um_login_email";
    var saved = LS.get(REMEMBER, null);
    if (saved) { lf.email.value = saved; lf.remember.checked = true; }
    if (me) {
      var p = doc.createElement("p"); p.className = "form__note is-ok"; p.innerHTML = "You're logged in as " + esc(me.email) + '. <a href="' + link("account") + '">Go to your account</a>';
      lf.insertBefore(p, lf.firstChild);
    }
    lf.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = $(".form__note:not(.is-ok)", lf);
      if (!note) { note = doc.createElement("p"); note.className = "form__note"; note.setAttribute("role", "status"); lf.insertBefore(note, $("button[type=submit]", lf)); }
      if (!lf.email.value.trim() || !lf.password.value) { note.textContent = "Please enter your email and password."; return; }
      var r = UM.login(lf.email.value, lf.password.value, lf.remember.checked);
      if (r.error) { note.textContent = r.error; return; }
      if (lf.remember.checked) LS.set(REMEMBER, lf.email.value.trim()); else LS.del(REMEMBER);
      goNext("account");
    });
  }

  /* ---------- sign up: 4 steps, like the new site ---------- */
  var sbox = $("[data-signup]");
  if (sbox) (function () {
    var STEPS = ["Personal info", "Address", "Password", "Sign the agreement"];
    var d = { firstName: "", lastName: "", primaryPhone: "", secondaryPhone: "", email: "", streetNo: "", appartmentName: "", street_address: "", city: "", state: "", zip: "", mapConfirmed: false,
      password: "", confirmPassword: "", agreeTermsPolicy: false, agreeAgreement: false, smsConsent: false, signatureImage: "" };
    var step = 1, err = {}, note = "";
    var digits = function (s) { return s.replace(/\D/g, ""); };
    function validate(st) {
      var e = {};
      if (st === 1) {
        if (!d.firstName.trim()) e.firstName = "First name is required.";
        if (!d.lastName.trim()) e.lastName = "Last name is required.";
        if (!d.primaryPhone.trim()) e.primaryPhone = "Primary phone is required.";
        else if (digits(d.primaryPhone).length !== 10) e.primaryPhone = "Enter a valid phone number (10 digits, e.g. (555) 123-4567).";
        if (d.secondaryPhone.trim() && digits(d.secondaryPhone).length !== 10) e.secondaryPhone = "Enter a valid phone number (10 digits).";
        if (!d.email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Enter a valid email address.";
      }
      if (st === 2) {
        if (!d.streetNo.trim()) e.streetNo = "Street number is required.";
        if (!d.street_address.trim()) e.street_address = "Street is required.";
        if (!d.city.trim()) e.city = "City is required.";
        if (!/^[A-Za-z]{2}$/.test(d.state.trim())) e.state = "Use the 2-letter state, e.g. NY.";
        if (!/^\d{5}(-\d{4})?$/.test(d.zip.trim())) e.zip = "Enter a 5-digit ZIP code.";
        if (!d.mapConfirmed) e.mapConfirmed = "Please check the map and tick the box.";
      }
      if (st === 3) {
        if (!d.password) e.password = "Password is required.";
        else if (d.password.length < 6) e.password = "Use at least 6 characters.";
        if (!d.confirmPassword) e.confirmPassword = "Please confirm your password.";
        else if (d.password !== d.confirmPassword) e.confirmPassword = "The two passwords don't match.";
      }
      if (st === 4) {
        if (!d.agreeTermsPolicy) e.agreeTermsPolicy = "Please agree to the terms and privacy policy.";
        if (!d.agreeAgreement) e.agreeAgreement = "Please agree to the membership agreement.";
        if (!d.signatureImage) e.signatureImage = "Please sign in the box.";
      }
      return e;
    }
    var errOf = function (k) { return err[k] ? '<span class="field__err" role="alert">' + esc(err[k]) + "</span>" : ""; };
    var inv = function (k) { return err[k] ? ' aria-invalid="true"' : ""; };
    function input(id, k, label, extra, hint) {
      return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" data-k="' + k + '" value="' + esc(d[k]) + '"' + (extra || "") + inv(k) + ">" + (hint ? '<span class="field__hint">' + hint + "</span>" : "") + errOf(k) + "</div>";
    }
    var opt = ' <span class="opt">optional</span>';
    function check(k, html) { return '<label class="check"><input type="checkbox" data-k="' + k + '"' + (d[k] ? " checked" : "") + "><span>" + html + "</span></label>" + errOf(k); }
    function render() {
      var f;
      if (step === 1) f = '<fieldset><legend>Personal info</legend><div class="form__row">' + input("su-first", "firstName", "First name", ' autocomplete="given-name"') + input("su-last", "lastName", "Last name", ' autocomplete="family-name"') + "</div>" +
        '<div class="form__row">' + input("su-phone", "primaryPhone", "Primary phone", ' type="tel" autocomplete="tel" placeholder="(555) 123-4567"') + input("su-phone2", "secondaryPhone", "Secondary phone" + opt, ' type="tel" autocomplete="tel"') + "</div>" +
        input("su-email", "email", "Email address", ' type="email" autocomplete="email"') + "</fieldset>";
      if (step === 2) f = '<fieldset><legend>Where we deliver to you</legend><div class="form__row form__row--addr">' + input("su-number", "streetNo", "Street number", ' placeholder="e.g. 705"', "If your address is 705 Smith St, Clifton, just put 705.") +
        input("su-apt", "appartmentName", "Apartment" + opt, ' autocomplete="address-line2" placeholder="Apt 4B"') + "</div>" + input("su-address", "street_address", "Street", ' autocomplete="address-line1" placeholder="Smith St"') +
        '<div class="form__row form__row--3">' + input("su-city", "city", "City", ' autocomplete="address-level2"') + input("su-state", "state", "State", ' autocomplete="address-level1" maxlength="2" placeholder="NY"') + input("su-zip", "zip", "ZIP", ' autocomplete="postal-code" inputmode="numeric" maxlength="10"') + "</div>" +
        '<div class="mapcheck"><img src="' + icon("round-pushpin") + '" alt="" width="34" height="34"><p>Check that the map shows your door, so the driver can find you, even late at night.</p><button class="btn btn--ghost btn--sm" type="button" data-map>Check on Google Maps</button></div>' +
        check("mapConfirmed", "I checked the map, and it shows my delivery location correctly.") + "</fieldset>";
      if (step === 3) f = '<fieldset><legend>Choose a password</legend><div class="form__row">' + input("su-pass", "password", "Password", ' type="password" autocomplete="new-password"', "At least 6 characters.") + input("su-pass2", "confirmPassword", "Confirm password", ' type="password" autocomplete="new-password"') + "</div></fieldset>";
      if (step === 4) f = '<fieldset><legend>Sign the agreement</legend>' +
        check("agreeTermsPolicy", 'I agree to the <a href="' + link("terms-services") + '" target="_blank">Terms of Service</a> and <a href="' + link("privacy-policy") + '" target="_blank">Privacy Policy</a>.') +
        check("agreeAgreement", "I agree to the Udder Milk Creamery Association membership agreement.") +
        check("smsConsent", 'Text me promotional messages from UDDERMILK.COM. <span class="opt">optional</span>') +
        '<div class="field"><span class="field__label">Your signature</span><div class="sigpad"><canvas aria-label="Signature box: sign with your finger or mouse"></canvas><div class="sigpad__bar"><span>Sign above</span><button type="button" data-sig-clear>Clear</button></div></div>' + errOf("signatureImage") + "</div></fieldset>";
      sbox.innerHTML = '<form class="form account__form wizard" novalidate><div class="wizard__top"></div><ol class="om__steps wizard__steps" aria-label="Sign-up steps">' +
        STEPS.map(function (s, i) { var n = i + 1; return '<li class="' + (n === step ? "is-on" : n < step ? "is-done" : "") + '"' + (n === step ? ' aria-current="step"' : "") + "><span>" + (n < step ? I.check : n) + "</span>" + s + "</li>"; }).join("") + "</ol>" +
        f + (note ? '<p class="form__note" role="status">' + esc(note) + "</p>" : "") +
        '<div class="wizard__nav">' + (step > 1 ? '<button class="btn btn--ghost" type="button" data-back>Back</button>' : "") +
        '<button class="btn' + (step === 4 ? " btn--butter" : "") + '" type="submit">' + (step < 4 ? "Next " + I.arrow : "Create my account " + I.arrow) + "</button></div></form>";
      if (step === 4) sigpad($("canvas", sbox));
    }
    // a box to sign in with a finger or mouse. keeps the drawing as a PNG data URL
    function sigpad(c) {
      var ratio = window.devicePixelRatio || 1, r = c.getBoundingClientRect(), ctx = c.getContext("2d"), drawing = false, drawn = false;
      c.width = r.width * ratio; c.height = r.height * ratio;
      ctx.scale(ratio, ratio); ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1F2E22";
      if (d.signatureImage) { var img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0, r.width, r.height); drawn = true; }; img.src = d.signatureImage; }
      var pos = function (e) { var b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
      c.addEventListener("pointerdown", function (e) { drawing = true; c.setPointerCapture && c.setPointerCapture(e.pointerId); var p = pos(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); });
      c.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); drawn = true; });
      var up = function () { if (!drawing) return; drawing = false; if (drawn) { d.signatureImage = c.toDataURL("image/png"); if (err.signatureImage) { err.signatureImage = ""; var x = $(".sigpad + .field__err", sbox); if (x) x.remove(); } } };
      c.addEventListener("pointerup", up); c.addEventListener("pointerleave", up);
      $("[data-sig-clear]", sbox).addEventListener("click", function () { ctx.clearRect(0, 0, c.width, c.height); drawn = false; d.signatureImage = ""; });
    }
    function go(n) { step = n; err = {}; note = ""; render(); var t = $(".wizard__top", sbox); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    sbox.addEventListener("input", function (e) { var k = e.target.getAttribute("data-k"); if (k && e.target.type !== "checkbox") d[k] = e.target.value; });
    sbox.addEventListener("change", function (e) { var k = e.target.getAttribute("data-k"); if (k && e.target.type === "checkbox") d[k] = e.target.checked; });
    sbox.addEventListener("click", function (e) {
      if (e.target.closest("[data-back]")) go(step - 1);
      if (e.target.closest("[data-map]")) {
        var q = (d.streetNo + " " + d.street_address + ", " + d.city + " " + d.state + " " + d.zip).replace(/^[\s,]+|[\s,]+$/g, "");
        if (!q) { err.street_address = "Type your address first."; render(); return; }
        window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q), "_blank", "noopener");
      }
    });
    sbox.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step < 4) { err = validate(step); if (Object.keys(err).length) render(); else go(step + 1); return; }
      for (var s = 1; s <= 4; s++) { var ee = validate(s); if (Object.keys(ee).length) { step = s; err = ee; render(); return; } }
      var r = UM.signup(d);
      if (r.error) { note = r.error; render(); return; }
      goNext("shop");
    });
    render();
  })();

  /* ---------- account area: side menu like the new site ---------- */
  var abox = $("[data-acct]");
  if (abox) (function () {
    var view = abox.getAttribute("data-acct");
    var WHAT = { dashboard: "see your account", history: "see your orders", profile: "see your profile", address: "see your address", password: "change your password" };
    if (!me) { UM.gate(abox, WHAT[view]); return; }
    var NAV = [["account", "Order dashboard", "house-with-garden", "dashboard"], ["order-history", "Order history", "clipboard", "history"], ["account/profile", "My profile", "identification-card", "profile"],
               ["account/address", "My address &amp; delivery", "round-pushpin", "address"], ["account/password", "Change password", "key", "password"]];
    abox.innerHTML = '<div class="acct"><nav class="acct__nav" aria-label="My account">' +
      NAV.map(function (n) { return '<a href="' + link(n[0]) + '"' + (n[3] === view ? ' aria-current="page"' : "") + '><img src="' + icon(n[2]) + '" alt="" width="26" height="26"><span>' + n[1] + "</span></a>"; }).join("") +
      '<button type="button" class="acct__out">Log out</button></nav><div class="acct__main"></div></div>';
    $(".acct__out", abox).addEventListener("click", function () { UM.logout(); location.href = ROOT + "index.html"; });
    var main = $(".acct__main", abox);
    var V = window.UM_VIEWS = {};
    V.zoneCards = function (m) {
      var z = m.zone;
      if (!z) return '<div class="zonecards zonecards--none" role="status"><p><b>' + (m.address ? "We don't deliver to " + esc(m.address.zip) + " yet." : "Add your delivery address to see your delivery day.") + "</b> " +
        (m.address ? "You can still order for pickup, or " : "") + '<a href="' + link("account/address") + '">' + (m.address ? "update your address" : "Add address") + "</a>.</p></div>";
      var card = function (ic, k, v) { return '<div class="zonecard"><img src="' + icon(ic) + '" alt="" width="36" height="36"><div><small>' + k + "</small><b>" + esc(v) + "</b></div></div>"; };
      return '<div class="zonecards">' + card("round-pushpin", "My zone", z.name) + card("alarm-clock", "Cut-off day", z.cutOffDay) + card("delivery-truck", "Delivery day", m.deliveryDay || z.deliveryDays[0]) + "</div>";
    };
    var note = function (n) { return n ? '<p class="form__note' + (n.ok ? " is-ok" : "") + '" role="status">' + esc(n.text) + "</p>" : ""; };
    var field = function (id, k, label, val, extra) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" name="' + k + '" value="' + esc(val) + '"' + (extra || "") + "></div>"; };
    var opt = ' <span class="opt">optional</span>';

    if (view === "dashboard" || view === "history") {
      var page = 1;
      var draw = function () {
        var data = UM.orders.list(view === "dashboard" ? 1 : page), list = data.orders;
        if (view === "dashboard") list = UM.orders.list(1).orders.filter(function (o) { return ["open", "confirmed", "out", "closed"].indexOf(o.status) > -1 || (o.recurring && o.status !== "canceled"); });
        var T = window.UM_ORDERS;   // order table + pager live in shop.js
        var empty = T.empty("You haven't placed any orders yet.", view === "dashboard" ? "When you place an order, it shows up here so you can check its status and details at a glance." : "When you place an order, it shows up here.", '<a class="btn" href="' + link("shop") + '">Shop now ' + I.arrow + "</a>");
        main.innerHTML = UM.preview + (view === "dashboard"
          ? '<header class="acct__head"><h1>Hi ' + esc(me.firstName) + "! <em>Welcome back.</em></h1></header>" + V.zoneCards(me) +
            '<section class="om__card ohist" aria-labelledby="active-title"><div class="om__cardhead"><div><small class="acct__kicker">Recurring and one-time orders</small><h2 id="active-title">My active &amp; recurring orders</h2><p class="muted acct__sub">Track status and open any order for full details.</p></div>' +
            '<a class="btn btn--sm btn--ghost" href="' + link("order-history") + '">All orders ' + I.arrow + "</a></div>" + (list.length ? T.table(list) : empty) + "</section>"
          : '<header class="acct__head"><h1>Order <em>history.</em></h1></header><section class="om__card ohist" aria-label="All orders">' + (data.total ? T.table(list) + T.pager(data) : empty) + "</section>");
      };
      main.addEventListener("click", function (e) {
        var pg = e.target.closest("[data-page]");
        if (pg) { page = +pg.getAttribute("data-page"); draw(); window.scrollTo({ top: 0, behavior: "smooth" }); }
        var again = e.target.closest("[data-again]");
        if (again) { var o = UM.orders.get(again.getAttribute("data-again")); if (o) { window.UM_CART.add(o.items); location.href = link("shop-cart"); } }
      });
      // shop.js defines the table, so wait for it (scripts run in order, shop.js is right after)
      doc.addEventListener("DOMContentLoaded", draw);
    }

    if (view === "profile") (function () {
      var n = null;
      var draw = function () {
        var m = UM.member();
        main.innerHTML = '<header class="acct__head"><h1>My personal <em>details.</em></h1></header><form class="om__card form acct__form" novalidate>' +
          '<div class="form__row">' + field("pf-first", "firstName", "First name", m.firstName, ' autocomplete="given-name"') + field("pf-last", "lastName", "Last name", m.lastName, ' autocomplete="family-name"') + "</div>" +
          '<div class="form__row">' + field("pf-phone", "phone", "Primary phone", m.phone, ' type="tel" autocomplete="tel" placeholder="(555) 123-4567"') + field("pf-phone2", "phone2", "Secondary phone" + opt, m.phone2, ' type="tel"') + "</div>" +
          field("pf-email", "email", "Email address", m.email, ' type="email" autocomplete="email"') + note(n) +
          '<div><button class="btn" type="submit">Save changes ' + I.check + "</button></div></form>";
      };
      main.addEventListener("submit", function (e) {
        e.preventDefault(); var f = e.target;
        var r = UM.updateProfile({ firstName: f.firstName.value, lastName: f.lastName.value, phone: f.phone.value, phone2: f.phone2.value, email: f.email.value });
        n = r.error ? { text: r.error } : { ok: true, text: "Saved. Your details are updated." };
        if (!r.error) { var hi = $(".topstrip__hi"); if (hi) hi.innerHTML = I.user + "Hi, " + esc(r.member.firstName); }
        draw();
      });
      main.addEventListener("input", function () { var x = $(".form__note", main); if (x) x.remove(); n = null; });
      draw();
    })();

    if (view === "address") (function () {
      var m = UM.member(), editing = !m.address, n = null, dn = null, a = m.address || { streetNo: "", street: "", apt: "", city: "", state: "", zip: "" };
      var draw = function () {
        m = UM.member();
        var addr = m.address, days = m.zone ? m.zone.deliveryDays : [];
        var form = '<form class="om__card form acct__form" novalidate><div class="form__row form__row--addr">' + field("ad-no", "streetNo", "Street no.", a.streetNo, ' placeholder="705"') + field("ad-street", "street", "Street", a.street, ' autocomplete="address-line1" placeholder="Smith St"') + "</div>" +
          field("ad-apt", "apt", "Apartment" + opt, a.apt, ' autocomplete="address-line2" placeholder="Apt 4B"') +
          '<div class="form__row form__row--3">' + field("ad-city", "city", "City", a.city, ' autocomplete="address-level2"') + field("ad-state", "state", "State", a.state, ' autocomplete="address-level1" maxlength="2" placeholder="NY"') + field("ad-zip", "zip", "ZIP", a.zip, ' autocomplete="postal-code" inputmode="numeric" maxlength="10"') + "</div>" +
          note(n) + '<div class="btn-row"><button class="btn" type="submit">Save address ' + I.check + "</button>" + (addr ? '<button class="btn btn--ghost" type="button" data-cancel>Cancel</button>' : "") + "</div></form>";
        var card = addr ? '<div class="om__card addrcard"><dl><div><dt>Street</dt><dd>' + esc(addr.streetNo + " " + addr.street) + "</dd></div>" + (addr.apt ? "<div><dt>Apartment</dt><dd>" + esc(addr.apt) + "</dd></div>" : "") +
          "<div><dt>City</dt><dd>" + esc(addr.city) + "</dd></div><div><dt>State</dt><dd>" + esc(addr.state) + "</dd></div><div><dt>ZIP</dt><dd>" + esc(addr.zip) + "</dd></div><div><dt>Country</dt><dd>" + esc(addr.country || "USA") + "</dd></div></dl>" + note(n) + "</div>" : "";
        var dayBox = !m.zone ? "" : days.length > 1
          ? '<div class="om__card daypick"><p><b>Your zone delivers on ' + days.join(" and ") + ".</b> Choose the day your orders come:</p><div class=\"choice choice--sm\" role=\"radiogroup\" aria-label=\"Delivery day\">" +
            days.map(function (dd) { return '<label class="choice__opt"><input type="radio" name="dday" value="' + dd + '"' + (m.deliveryDay === dd ? " checked" : "") + "><span><b>" + dd + "</b><small>11am to midnight</small></span></label>"; }).join("") + "</div>" + note(dn) + "</div>"
          : '<p class="muted acct__sub">Your zone delivers on ' + esc(days[0]) + ", 11am to midnight. Orders need to be in by " + esc(m.zone.cutOffDay) + ". To change your day, change your address or call 973-413-9585.</p>";
        main.innerHTML = '<header class="acct__head acct__head--row"><div><h1>Delivery <em>address.</em></h1><p class="muted">Used for orders and delivery. Your zone and delivery day come from it.</p></div>' +
          (!editing ? '<button class="btn btn--sm btn--ghost" type="button" data-edit>' + (addr ? "Edit address" : "Add address") + "</button>" : "") + "</header>" +
          (editing ? form : card) + '<section class="acct__section" aria-labelledby="dd-title"><h2 id="dd-title">Your delivery</h2>' + V.zoneCards(m) + dayBox + "</section>";
      };
      main.addEventListener("click", function (e) {
        if (e.target.closest("[data-edit]")) { a = UM.member().address || a; editing = true; n = null; draw(); }
        if (e.target.closest("[data-cancel]")) { editing = false; n = null; draw(); }
      });
      main.addEventListener("input", function (e) { if (e.target.name && a.hasOwnProperty(e.target.name)) a[e.target.name] = e.target.value; });
      main.addEventListener("change", function (e) {
        if (e.target.name !== "dday") return;
        var r = UM.setDay(e.target.value); dn = r.error ? { text: r.error } : { ok: true, text: "Your orders now come on " + e.target.value + "." }; draw();
      });
      main.addEventListener("submit", function (e) {
        e.preventDefault();
        var r = UM.updateAddress(a);
        if (r.error) { n = { text: r.error }; draw(); return; }
        var mm = r.member; editing = false;
        n = { ok: true, text: mm.zone ? "Saved. Your zone is " + mm.zone.name + ": order by " + mm.zone.cutOffDay + ", delivered " + mm.deliveryDay + "." : "Saved. We don't deliver to " + mm.address.zip + " yet, but you can still order for pickup." };
        draw();
      });
      draw();
    })();

    if (view === "password") (function () {
      var n = null;
      var draw = function () {
        main.innerHTML = '<header class="acct__head"><h1>Change <em>password.</em></h1></header><form class="om__card form acct__form" novalidate>' +
          '<div class="field"><label for="pw-cur">Current password</label><input id="pw-cur" name="current" type="password" autocomplete="current-password"></div>' +
          '<div class="form__row"><div class="field"><label for="pw-new">New password</label><input id="pw-new" name="next" type="password" autocomplete="new-password"><span class="field__hint">At least 6 characters.</span></div>' +
          '<div class="field"><label for="pw-new2">Confirm new password</label><input id="pw-new2" name="confirm" type="password" autocomplete="new-password"></div></div>' + note(n) +
          '<div><button class="btn" type="submit">Change password ' + I.check + "</button></div></form>";
      };
      main.addEventListener("submit", function (e) {
        e.preventDefault(); var f = e.target;
        if (f.next.value.length < 6) n = { text: "Use at least 6 characters for your new password." };
        else if (f.next.value !== f.confirm.value) n = { text: "The two new passwords don't match." };
        else { var r = UM.changePassword(f.current.value, f.next.value); n = r.error ? { text: r.error } : { ok: true, text: "Done. Use your new password next time you log in." }; }
        draw();
      });
      draw();
    })();
  })();
})();
