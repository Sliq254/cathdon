'use strict';

(function () {
  var WHATSAPP_NUMBER = '254702831153';
  var EMAIL_ADDRESS = 'cathdoncatering@gmail.com';

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initSeoUrls();
    initMobileDrawer();
    initScrollSpy();
    initScrollAnimations();
    initStatCounters();
    initServicePreselect();
    initGalleryCarousel();
    initQuoteFocusButtons();
    initEnquiryForm();
    initImageFallbacks();
  });

  function initYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initSeoUrls() {
    if (!window.location || !window.location.origin || window.location.origin === 'null') return;
    var cleanPath = window.location.pathname === '/index.html' ? '/' : window.location.pathname;
    var canonicalUrl = window.location.origin + cleanPath;

    var canonicalLink = document.getElementById('canonical-link');
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl);

    var ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    var shareImgPath = 'assets/aistudio/IMG-20261123-WA0013_24ce8085.jpg';
    var baseDir = canonicalUrl.endsWith('/') ? canonicalUrl : canonicalUrl + '/';
    var absImgUrl = baseDir + shareImgPath;

    var ogImage = document.getElementById('og-image');
    if (ogImage) ogImage.setAttribute('content', absImgUrl);

    var twitterImage = document.getElementById('twitter-image');
    if (twitterImage) twitterImage.setAttribute('content', absImgUrl);
  }

  /* ------------------------------------------------------------------------
     Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  function initMobileDrawer() {
    var toggleBtn = document.getElementById('mobile-menu-toggle');
    var drawer = document.getElementById('mobile-drawer');
    if (!toggleBtn || !drawer) return;

    function setOpen(isOpen) {
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      drawer.hidden = !isOpen;
    }

    toggleBtn.addEventListener('click', function () {
      var currentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      setOpen(!currentlyOpen);
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggleBtn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && !drawer.hidden) {
        setOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Active Nav Link Scroll Spy
     ------------------------------------------------------------------------ */
  function initScrollSpy() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav .nav-link'));
    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    var sections = navLinks
      .map(function (link) {
        var href = link.getAttribute('href');
        return href && href.startsWith('#') ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var activeId = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === activeId);
          });
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Service Links & Menu CTA Pre-select Quotation Form
     ------------------------------------------------------------------------ */
  function initServicePreselect() {
    var links = document.querySelectorAll('.service-link');
    var selectEl = document.getElementById('quote-service-type');
    var form = document.getElementById('enquiry-form');
    var formCard = document.getElementById('quote-form');
    var confirmation = document.getElementById('enquiry-confirmation');

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var chosenService = link.getAttribute('data-service');
        if (selectEl && chosenService) {
          selectEl.value = chosenService;
        }
        if (confirmation && form && !confirmation.hidden) {
          confirmation.classList.remove('is-entering', 'is-leaving');
          confirmation.hidden = true;
          form.classList.remove('is-leaving');
          form.hidden = false;
          if (formCard) formCard.classList.remove('is-confirmed');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Request a Quote Focus Buttons
     ------------------------------------------------------------------------ */
  function initQuoteFocusButtons() {
    var focusTriggers = document.querySelectorAll('[data-focus-quote]');
    var nameInput = document.getElementById('quote-name');
    if (!focusTriggers.length || !nameInput) return;

    focusTriggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(function () {
          nameInput.focus({ preventScroll: true });
        }, 250);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Photo Gallery Carousel (Auto-Scroll 3s, Buttons, Thumbnails, Keyboard & Touch Swipe)
     ------------------------------------------------------------------------ */
  function initGalleryCarousel() {
    var carousel = document.getElementById('gallery-carousel');
    var track = document.getElementById('gallery-track');
    var prevBtn = document.getElementById('gallery-prev-btn');
    var nextBtn = document.getElementById('gallery-next-btn');
    var counterEl = document.getElementById('gallery-counter');
    var categoryEl = document.getElementById('gallery-caption-category');
    var captionEl = document.getElementById('gallery-caption-text');

    if (!carousel || !track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.gallery-slide'));
    var thumbs = Array.prototype.slice.call(carousel.querySelectorAll('.gallery-thumb'));
    var total = slides.length;
    if (!total) return;

    var AUTO_SCROLL_MS = 3000;
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var currentIndex = 0;
    var autoTimer = null;
    var isHovered = false;
    var isFocused = false;
    var isTouching = false;
    var isInViewport = true;

    function formatIndex(num) {
      return num < 10 ? '0' + String(num) : String(num);
    }

    function warmSlideImage(idx) {
      var slide = slides[((idx % total) + total) % total];
      if (!slide) return;
      var img = slide.querySelector('img');
      if (!img) return;
      if (img.getAttribute('loading') === 'lazy') {
        img.setAttribute('loading', 'eager');
        img.removeAttribute('fetchpriority');
      }
      if (typeof img.decode === 'function' && !img.complete) {
        img.decode().catch(function () {});
      }
    }

    function goToSlide(nextIndex) {
      currentIndex = ((nextIndex % total) + total) % total;
      track.style.transform = 'translate3d(' + String(-currentIndex * 100) + '%, 0, 0)';

      var activeSlide = slides[currentIndex];
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === currentIndex);
      });

      warmSlideImage(currentIndex);
      warmSlideImage(currentIndex + 1);
      warmSlideImage(currentIndex - 1);

      if (counterEl) {
        counterEl.textContent = formatIndex(currentIndex + 1) + ' / ' + formatIndex(total);
      }
      if (categoryEl && activeSlide) {
        categoryEl.textContent = activeSlide.getAttribute('data-category') || '';
      }
      if (captionEl && activeSlide) {
        captionEl.textContent = activeSlide.getAttribute('data-caption') || '';
      }

      thumbs.forEach(function (thumb, idx) {
        var isActive = idx === currentIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function stopAutoScroll() {
      if (autoTimer !== null) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoScroll() {
      stopAutoScroll();
      if (
        prefersReducedMotion ||
        total < 2 ||
        isHovered ||
        isFocused ||
        isTouching ||
        !isInViewport ||
        document.hidden
      ) {
        return;
      }
      autoTimer = window.setInterval(function () {
        goToSlide(currentIndex + 1);
      }, AUTO_SCROLL_MS);
    }

    function navigateManual(nextIndex) {
      goToSlide(nextIndex);
      startAutoScroll();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        navigateManual(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        navigateManual(currentIndex + 1);
      });
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var idx = parseInt(thumb.getAttribute('data-slide-index') || '0', 10);
        if (!isNaN(idx)) {
          navigateManual(idx);
        }
      });
    });

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateManual(currentIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateManual(currentIndex + 1);
      }
    });

    carousel.addEventListener('mouseenter', function () {
      isHovered = true;
      stopAutoScroll();
    });

    carousel.addEventListener('mouseleave', function () {
      isHovered = false;
      startAutoScroll();
    });

    carousel.addEventListener('focusin', function () {
      isFocused = true;
      stopAutoScroll();
    });

    carousel.addEventListener('focusout', function (event) {
      if (!carousel.contains(event.relatedTarget)) {
        isFocused = false;
        startAutoScroll();
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });

    if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isInViewport = entry.isIntersecting;
            if (isInViewport) {
              startAutoScroll();
            } else {
              stopAutoScroll();
            }
          });
        },
        { threshold: 0.1 }
      );
      visibilityObserver.observe(carousel);

      var warmObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            warmSlideImage(currentIndex + 1);
            warmSlideImage(currentIndex + 2);
            thumbs.forEach(function (thumb) {
              var thumbImg = thumb.querySelector('img');
              if (thumbImg && thumbImg.getAttribute('loading') === 'lazy') {
                thumbImg.setAttribute('loading', 'eager');
              }
            });
          });
        },
        { rootMargin: '400px 0px 400px 0px', threshold: 0 }
      );
      warmObserver.observe(carousel);
    }

    var touchStartX = 0;
    var touchStartY = 0;

    track.addEventListener(
      'touchstart',
      function (event) {
        if (!event.touches || !event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isTouching = true;
        stopAutoScroll();
      },
      { passive: true }
    );

    track.addEventListener(
      'touchend',
      function (event) {
        if (!isTouching) return;
        isTouching = false;
        if (event.changedTouches && event.changedTouches.length) {
          var deltaX = event.changedTouches[0].clientX - touchStartX;
          var deltaY = event.changedTouches[0].clientY - touchStartY;
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              goToSlide(currentIndex + 1);
            } else {
              goToSlide(currentIndex - 1);
            }
          }
        }
        startAutoScroll();
      },
      { passive: true }
    );

    track.addEventListener(
      'touchcancel',
      function () {
        isTouching = false;
        startAutoScroll();
      },
      { passive: true }
    );

    goToSlide(0);
    startAutoScroll();
  }

  /* ------------------------------------------------------------------------
     Subtle Stat Counter Animation
     ------------------------------------------------------------------------ */
  function initStatCounters() {
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    var counters = document.querySelectorAll('[data-count-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);

          var target = parseInt(el.getAttribute('data-count-target') || '0', 10);
          var suffix = el.getAttribute('data-count-suffix') || '';
          if (!target || target <= 0) return;

          var duration = 420;
          var start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.max(1, Math.round(eased * target));
            el.textContent = String(current) + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = String(target) + suffix;
            }
          }

          window.requestAnimationFrame(step);
        });
      },
      { threshold: 0.1 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Catering Quotation Form Validation & WhatsApp / Email Handoff
     ------------------------------------------------------------------------ */
  function initEnquiryForm() {
    var form = document.getElementById('enquiry-form');
    var formCard = document.getElementById('quote-form');
    var submitBtn = document.getElementById('enquiry-submit-btn');
    var submitLabel = submitBtn ? submitBtn.querySelector('.btn-submit-label') : null;
    var confirmation = document.getElementById('enquiry-confirmation');
    var summaryEl = document.getElementById('confirmation-summary');
    var whatsappLink = document.getElementById('whatsapp-send-link');
    var emailLink = document.getElementById('email-send-link');
    var resetBtn = document.getElementById('reset-enquiry-btn');

    if (!form) return;

    var defaultSubmitText = submitLabel ? submitLabel.textContent : 'Send Catering Enquiry';
    var isTransitioning = false;

    function prefersReducedMotion() {
      return Boolean(
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }

    function setFieldError(inputId, errorId, message) {
      var input = document.getElementById(inputId);
      var errorEl = document.getElementById(errorId);
      if (input && input.parentElement) {
        input.parentElement.classList.toggle('has-error', Boolean(message));
      }
      if (errorEl) {
        errorEl.textContent = message || '';
      }
    }

    function nudgeField(input) {
      if (!input || !input.parentElement || prefersReducedMotion()) return;
      var fieldWrap = input.parentElement;
      fieldWrap.classList.remove('is-shaking');
      void fieldWrap.offsetWidth;
      fieldWrap.classList.add('is-shaking');
      fieldWrap.addEventListener(
        'animationend',
        function () {
          fieldWrap.classList.remove('is-shaking');
        },
        { once: true }
      );
    }

    function validateField(name, value) {
      var trimmed = String(value || '').trim();
      switch (name) {
        case 'fullName':
          return trimmed.length >= 2 ? '' : 'Please enter your full name.';
        case 'organization':
          return trimmed.length >= 2 ? '' : 'Please enter your organization or company name.';
        case 'phone': {
          var digits = trimmed.replace(/\D/g, '');
          return digits.length >= 9 ? '' : 'Enter a valid phone or WhatsApp number.';
        }
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
            ? ''
            : 'Please enter a valid email address.';
        case 'serviceType':
          return trimmed ? '' : 'Please select a type of catering service.';
        case 'guestCount': {
          var count = parseInt(trimmed, 10);
          return !isNaN(count) && count >= 1 ? '' : 'Enter the estimated number of people.';
        }
        default:
          return '';
      }
    }

    var requiredFields = [
      { id: 'quote-name', err: 'error-name', name: 'fullName' },
      { id: 'quote-org', err: 'error-org', name: 'organization' },
      { id: 'quote-phone', err: 'error-phone', name: 'phone' },
      { id: 'quote-email', err: 'error-email', name: 'email' },
      { id: 'quote-service-type', err: 'error-serviceType', name: 'serviceType' },
      { id: 'quote-guests', err: 'error-guests', name: 'guestCount' },
    ];

    requiredFields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el) return;
      el.addEventListener('blur', function () {
        setFieldError(field.id, field.err, validateField(field.name, el.value));
      });
      el.addEventListener('input', function () {
        if (el.parentElement && el.parentElement.classList.contains('has-error')) {
          setFieldError(field.id, field.err, validateField(field.name, el.value));
        }
      });
    });

    function showConfirmationPanel() {
      form.classList.remove('is-leaving', 'is-entering');
      form.hidden = true;
      if (submitBtn) {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;
      }
      if (submitLabel) {
        submitLabel.textContent = defaultSubmitText;
      }
      if (formCard) {
        formCard.classList.add('is-confirmed');
      }
      if (confirmation) {
        confirmation.classList.remove('is-leaving', 'is-entering');
        confirmation.hidden = false;
        if (!prefersReducedMotion()) {
          void confirmation.offsetWidth;
          confirmation.classList.add('is-entering');
        }
        confirmation.focus({ preventScroll: true });
      }
      isTransitioning = false;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (isTransitioning) return;

      var hasErrors = false;
      var firstInvalid = null;

      requiredFields.forEach(function (field) {
        var el = document.getElementById(field.id);
        var val = el ? el.value : '';
        var errMsg = validateField(field.name, val);
        setFieldError(field.id, field.err, errMsg);
        if (errMsg) {
          nudgeField(el);
          if (!hasErrors) {
            hasErrors = true;
            firstInvalid = el;
          }
        }
      });

      if (hasErrors) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var fullName = document.getElementById('quote-name').value.trim();
      var organization = document.getElementById('quote-org').value.trim();
      var phone = document.getElementById('quote-phone').value.trim();
      var email = document.getElementById('quote-email').value.trim();
      var serviceType = document.getElementById('quote-service-type').value;
      var guests = document.getElementById('quote-guests').value.trim();
      var eventDate = (document.getElementById('quote-date').value || '').trim();
      var location = (document.getElementById('quote-location').value || '').trim();
      var details = (document.getElementById('quote-details').value || '').trim();

      if (summaryEl) {
        summaryEl.textContent =
          'Thank you, ' +
          fullName +
          ' (' +
          organization +
          '). Your quotation enquiry for ' +
          serviceType +
          ' (' +
          guests +
          ' people) is ready to send directly to Cathdon Catering Services.';
      }

      var messageLines = [
        'Hello Cathdon Catering Services,',
        'Catering Quotation Enquiry:',
        'Full Name: ' + fullName,
        'Organization: ' + organization,
        'Phone: ' + phone,
        'Email: ' + email,
        'Service Type: ' + serviceType,
        'Number of People: ' + guests,
      ];
      if (eventDate) messageLines.push('Event / Start Date: ' + eventDate);
      if (location) messageLines.push('Catering Location: ' + location);
      if (details) messageLines.push('Additional Details: ' + details);

      var encodedBody = encodeURIComponent(messageLines.join('\n'));

      if (whatsappLink) {
        whatsappLink.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedBody;
      }

      if (emailLink) {
        var subject = encodeURIComponent(
          'Catering Quote Request: ' + serviceType + ' - ' + organization
        );
        emailLink.href = 'mailto:' + EMAIL_ADDRESS + '?subject=' + subject + '&body=' + encodedBody;
      }

      if (prefersReducedMotion()) {
        showConfirmationPanel();
        return;
      }

      isTransitioning = true;
      if (submitBtn) {
        submitBtn.classList.add('is-submitting');
        submitBtn.disabled = true;
      }
      if (submitLabel) {
        submitLabel.textContent = 'Preparing Enquiry...';
      }

      window.setTimeout(function () {
        form.classList.add('is-leaving');
        window.setTimeout(showConfirmationPanel, 190);
      }, 220);
    });

    if (resetBtn && confirmation) {
      resetBtn.addEventListener('click', function () {
        if (isTransitioning) return;

        function restoreForm() {
          confirmation.classList.remove('is-leaving', 'is-entering');
          confirmation.hidden = true;
          if (formCard) {
            formCard.classList.remove('is-confirmed');
          }
          form.classList.remove('is-leaving', 'is-entering');
          form.hidden = false;
          if (!prefersReducedMotion()) {
            void form.offsetWidth;
            form.classList.add('is-entering');
          }
          var nameInput = document.getElementById('quote-name');
          if (nameInput) nameInput.focus({ preventScroll: true });
          isTransitioning = false;
        }

        if (prefersReducedMotion()) {
          restoreForm();
          return;
        }

        isTransitioning = true;
        confirmation.classList.remove('is-entering');
        confirmation.classList.add('is-leaving');
        window.setTimeout(restoreForm, 170);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Scroll Reveal & Sticky Header Scroll State
     ------------------------------------------------------------------------ */
  function initScrollAnimations() {
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var header = document.getElementById('site-header');

    var ticking = false;
    var lastScrolled = null;
    function onScrollFrame() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var isScrolled = scrollY > 24;
      if (header && isScrolled !== lastScrolled) {
        header.classList.toggle('is-scrolled', isScrolled);
        lastScrolled = isScrolled;
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(onScrollFrame);
        }
      },
      { passive: true }
    );
    onScrollFrame();

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      return;
    }

    document.documentElement.classList.add('has-scroll-anim');

    var revealGroups = [
      { selector: '.section-header, .section-header-split > .section-subtitle', stagger: 35 },
      { selector: '.stat-item', stagger: 30 },
      { selector: '.overview-copy-col, .story-divider-band', stagger: 0 },
      { selector: '.mv-column, .value-row-item', stagger: 25 },
      { selector: '.service-row, .offering-entry', stagger: 25 },
      { selector: '.reason-entry, .compliance-copy', stagger: 25 },
      { selector: '.dark-split > div, .dark-ledger-item, .dark-standard-item', stagger: 25 },
      { selector: '.team-row', stagger: 25 },
      { selector: '.portfolio-table-wrap, .testimonial-quote-block', stagger: 30 },
      { selector: '.contact-info, .contact-form-card', stagger: 35 },
    ];

    var targets = [];
    revealGroups.forEach(function (group) {
      var nodes = document.querySelectorAll(group.selector);
      nodes.forEach(function (el, idx) {
        if (el.parentElement && el.parentElement.closest('.reveal-item')) {
          return;
        }
        el.classList.add('reveal-item');
        el.style.setProperty('--reveal-delay', Math.min(idx * group.stagger, 90) + 'ms');
        targets.push(el);
      });
    });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 160) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '160px 0px 160px 0px', threshold: 0 }
    );

    function revealVisibleTargets() {
      var cutoff = window.innerHeight + 160;
      targets.forEach(function (el) {
        if (el.classList.contains('is-visible')) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < cutoff) {
          el.style.setProperty('--reveal-delay', '0ms');
          el.classList.add('is-visible');
          observer.unobserve(el);
        } else {
          observer.observe(el);
        }
      });
    }

    revealVisibleTargets();
    window.addEventListener('hashchange', revealVisibleTargets, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Zero-Broken-Image Resilience & Smooth Image Load Transitions
     ------------------------------------------------------------------------ */
  function initImageFallbacks() {
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('img.cover-image').forEach(function (img) {
      function showFallback() {
        img.classList.remove('is-pending');
        img.style.opacity = '0';
        var parent = img.parentElement;
        if (parent) {
          var fallback = parent.querySelector('.media-fallback');
          if (fallback) {
            fallback.classList.add('is-visible');
          }
        }
      }

      function markReady() {
        img.classList.remove('is-pending');
      }

      img.addEventListener('error', showFallback);

      if (img.complete) {
        if (img.naturalWidth === 0) {
          showFallback();
        }
      } else if (!prefersReducedMotion) {
        img.classList.add('is-pending');
        img.addEventListener('load', markReady, { once: true });
      }
    });

    document.querySelectorAll('.section-bg-blur-img').forEach(function (img) {
      function markLoaded() {
        img.classList.add('is-loaded');
      }

      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
      }
    });
  }
})();
