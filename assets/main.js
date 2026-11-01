(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Active table-of-contents link
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var link = map[en.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) tio.observe(s); });
  }

  // Contact form: validate, then open the visitor's e-mail app with the message filled in
  var form = document.getElementById('contact-form');
  if (form) {
    var setError = function (field, show) { field.classList.toggle('invalid', show); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var firstInvalid = null;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.type === 'checkbox' ? input.checked : input.checkValidity() && input.value.trim() !== '';
        if (field) setError(field, !valid);
        if (!valid) { ok = false; if (!firstInvalid) firstInvalid = input; }
      });
      if (!ok) { firstInvalid.focus(); return; }

      var data = new FormData(form);
      var subject = 'Contactaanvraag via website – ' + (data.get('onderwerp') || 'Algemeen');
      var body =
        'Naam: ' + data.get('naam') + '\n' +
        'Bedrijf: ' + (data.get('bedrijf') || '-') + '\n' +
        'E-mail: ' + data.get('email') + '\n' +
        'Telefoon: ' + (data.get('telefoon') || '-') + '\n' +
        'Onderwerp: ' + data.get('onderwerp') + '\n\n' +
        data.get('bericht');
      window.location.href = 'mailto:info@thefinancialbutler.nl?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = document.getElementById('form-status');
      if (status) status.classList.add('show');
    });
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('invalid')) setError(field, !input.checkValidity());
      });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
