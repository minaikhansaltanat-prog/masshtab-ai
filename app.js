(function () {
  "use strict";

  /* ---------- i18n ---------- */
  var LANG_KEY = "masshtab-lang";
  var currentLang = localStorage.getItem(LANG_KEY) || "ru";

  function applyLang(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang === "kk" ? "kk" : "ru");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key]) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      var pressed = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
    localStorage.setItem(LANG_KEY, lang);
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  applyLang(currentLang);

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  var lastScrolled = false;
  function onScroll() {
    var scrolled = window.scrollY > 8;
    if (scrolled !== lastScrolled) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrolled = scrolled;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var drawer = document.getElementById("mobileDrawer");
  var scrollLockY = 0;

  function openMenu() {
    scrollLockY = window.scrollY;
    document.body.style.top = -scrollLockY + "px";
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    var dict = window.I18N[currentLang];
    menuToggle.setAttribute("aria-label", currentLang === "kk" ? "Мәзірді жабу" : "Закрыть меню");
  }
  function closeMenu() {
    document.body.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollLockY);
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", currentLang === "kk" ? "Мәзірді ашу" : "Открыть меню");
  }
  menuToggle.addEventListener("click", function () {
    if (document.body.classList.contains("menu-open")) closeMenu();
    else openMenu();
  });
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && document.body.classList.contains("menu-open")) closeMenu();
  });

  /* ---------- Hero video: adaptive load ---------- */
  var video = document.getElementById("heroVideo");
  var playBtn = document.getElementById("heroPlay");
  var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  var isSlow = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));

  function startVideo() {
    if (!video) return;
    video.setAttribute("src", "assets/video/hero.mp4");
    video.load();
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        /* autoplay blocked — keep play button visible */
      });
    }
    video.addEventListener("playing", function () {
      video.classList.add("is-visible");
      if (playBtn) playBtn.classList.add("is-hidden");
    });
  }

  if (video) {
    if (!isSlow) {
      startVideo();
    }
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        startVideo();
      });
    }
  }

  /* ---------- Hero ledger strikethrough trigger ---------- */
  var heroSlip = document.getElementById("heroSlip");
  if (heroSlip) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        heroSlip.classList.add("is-active");
      }, 350);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- Close mobile drawer on hash-link click within same page ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (document.body.classList.contains("menu-open")) closeMenu();
    });
  });
})();
