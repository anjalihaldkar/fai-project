/* ==========================================================================
   Future Agri Infra — main script (the ONLY JS file for all pages)

   How it works
   - Every feature is one small init function.
   - Every init function checks that its section exists on the page and
     returns early if not, so one file is safe on all 4 pages.
   - All init functions run once from init() at the bottom.

   Table of contents
   01. Helpers
   02. Navigation (menu, dropdowns, burger)
   03. Hero slider
   04. FAQ accordion
   05. Fade-up on scroll
   06. Services tabs (data + init)
   07. Farming models cards
   08. Academy learning path
   09. Our Journey animation (GSAP)
   10. How We Think stacked panels (GSAP)
   11. Expertise orbit diagram
   12. Values cards + pins
   13. Projects slider
   14. Testimonials slider
   15. Farm plan form wizard (planfarm page)
   16. Init
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     01. Helpers
     ------------------------------------------------------------------------ */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const hasGsap = () =>
    typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Must match the CSS breakpoint where the burger menu replaces the desktop menu
  const MOBILE_NAV_QUERY = '(max-width: 1240px)';

  /* ------------------------------------------------------------------------
     02. Navigation
     ------------------------------------------------------------------------ */
  function initNav() {
    const scope = $('#afmScope');
    const burger = $('#afmBurger');
    const scrim = $('#afmScrim');
    const closeBtn = $('#afmClose');
    if (!scope || !burger) return;

    const items = $$('.afm-menu__item', scope);
    const isMobile = () => window.matchMedia(MOBILE_NAV_QUERY).matches;

    const setOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      const trigger = $('.afm-menu__link', item);
      if (trigger) trigger.setAttribute('aria-expanded', String(open));
    };

    const closeAllExcept = (except) => {
      items.forEach((item) => {
        if (item !== except) setOpen(item, false);
      });
    };

    items.forEach((item) => {
      const trigger = $('.afm-menu__link', item);
      const hasPanel = $('.afm-dropdown, .afm-mega', item);
      if (!trigger || !hasPanel) return;

      const toggle = () => {
        const willOpen = !item.classList.contains('is-open');
        closeAllExcept(item);
        setOpen(item, willOpen);
      };

      trigger.addEventListener('click', (e) => {
        // Mobile: tapping the caret opens the submenu, tapping the text follows the link
        if (isMobile() && e.target.closest('.afm-menu__caret')) {
          e.preventDefault();
          toggle();
          return;
        }
        // Buttons (no link) always toggle
        if (trigger.tagName === 'BUTTON') {
          e.preventDefault();
          toggle();
        }
      });

      // Desktop: hover opens / closes
      item.addEventListener('mouseenter', () => {
        if (isMobile()) return;
        closeAllExcept(item);
        setOpen(item, true);
      });
      item.addEventListener('mouseleave', () => {
        if (isMobile()) return;
        setOpen(item, false);
      });
    });

    const openMobileMenu = () => {
      scope.classList.add('is-menu-open');
      burger.setAttribute('aria-expanded', 'true');
    };
    const closeMobileMenu = () => {
      scope.classList.remove('is-menu-open');
      burger.setAttribute('aria-expanded', 'false');
      closeAllExcept(null);
    };

    burger.addEventListener('click', () => {
      scope.classList.contains('is-menu-open') ? closeMobileMenu() : openMobileMenu();
    });
    if (scrim) scrim.addEventListener('click', closeMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

    document.addEventListener('click', (e) => {
      if (isMobile()) return;
      if (!scope.contains(e.target)) closeAllExcept(null);
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) closeMobileMenu();
    });
  }

  /* ------------------------------------------------------------------------
     Protected structures tabs
     ------------------------------------------------------------------------ */
  function initProtectedStructureTabs() {
    const section = $('.fmps');
    if (!section) return;

    const tabs = $$('.fmps-item__trigger', section);
    const image = $('#fmps-image', section);
    const panel = $('#fmps-image-panel', section);
    if (!tabs.length || !image || !panel) return;

    let activeTab = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    if (activeTab < 0) activeTab = 0;
    let imageRequest = 0;

    const activate = (index, moveFocus = false) => {
      const tab = tabs[index];
      if (!tab) return;
      activeTab = index;

      tabs.forEach((item, itemIndex) => {
        const selected = itemIndex === index;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        item.closest('.fmps-item')?.classList.toggle('fmps-item--active', selected);
      });

      panel.setAttribute('aria-labelledby', tab.id);
      if (moveFocus) tab.focus();

      const source = tab.dataset.image;
      const alt = tab.dataset.alt;
      if (!source || !alt || image.getAttribute('src') === source) return;

      const request = ++imageRequest;
      const nextImage = new Image();
      image.classList.add('is-changing');
      nextImage.onload = () => {
        if (request !== imageRequest) return;
        image.src = source;
        image.alt = alt;
        requestAnimationFrame(() => image.classList.remove('is-changing'));
      };
      nextImage.onerror = () => {
        if (request !== imageRequest) return;
        image.classList.remove('is-changing');
        console.error(`Unable to load protected structure image: ${source}`);
      };
      nextImage.src = source;
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activate(nextIndex, true);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Protected page crop cards carousel (mobile)
     ------------------------------------------------------------------------ */
  function initCropCardsSlider() {
    const root = $('[data-fmcs-slider]');
    if (!root) return;

    const track = $('[data-fmcs-track]', root);
    const cards = $$('.fmcs-card', root);
    const controls = $('[data-fmcs-controls]', root);
    const prev = $('[data-fmcs-prev]', root);
    const next = $('[data-fmcs-next]', root);
    const count = $('[data-fmcs-count]', root);
    if (!track || !cards.length || !controls || !prev || !next || !count) return;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    let current = 0;
    let scrollTimer = null;

    const clamp = (index) => Math.max(0, Math.min(cards.length - 1, index));
    const targetLeft = (index) => cards[index].offsetLeft - track.offsetLeft;

    const nearestCard = () => {
      let closest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const nextDistance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = index;
        }
      });
      return closest;
    };

    const update = () => {
      controls.hidden = !mobileQuery.matches;
      const maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = current === 0;
      next.disabled = current === cards.length - 1 || maxScroll <= 1;
      count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    };

    const goTo = (index) => {
      current = clamp(index);
      track.scrollTo({
        left: targetLeft(current),
        behavior: 'auto'
      });
      update();
    };

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        current = nearestCard();
        update();
      }, 90);
    }, { passive: true });

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(current - 1);
      }
    });

    window.addEventListener('resize', () => {
      update();
      if (mobileQuery.matches) goTo(current);
    });
    mobileQuery.addEventListener('change', update);

    update();
  }

  /* ------------------------------------------------------------------------
     03. Hero slider (home page)
     ------------------------------------------------------------------------ */
  function initHeroSlider() {
    const slides = $$('.afm-hero__slide');
    const dots = $$('.afm-hero__dot');
    const hero = $('.afm-hero');
    if (!slides.length || !hero) return;

    const AUTOPLAY_MS = 5000;
    const SWIPE_MIN_PX = 50;
    const weatherNew = $('#weatherCardNew');
    const weatherOld = $('#weatherCardOld');
    let current = 0;
    let timer = null;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');

      // Slide 2 shows the older weather card, the others show the new one
      if (weatherNew && weatherOld) {
        const showOld = current === 1;
        weatherNew.style.display = showOld ? 'none' : 'block';
        weatherOld.style.display = showOld ? 'block' : 'none';
      }
    };

    const startAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goTo(index);
        startAutoplay();
      });
    });

    // Swipe (touch) and drag (mouse)
    let startX = 0;
    let dragging = false;

    const handleSwipe = (endX) => {
      const diff = startX - endX;
      if (Math.abs(diff) < SWIPE_MIN_PX) return;
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    };

    hero.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
    hero.addEventListener('touchend', (e) => handleSwipe(e.changedTouches[0].screenX), { passive: true });
    hero.addEventListener('mousedown', (e) => { dragging = true; startX = e.clientX; });
    hero.addEventListener('mouseup', (e) => {
      if (!dragging) return;
      dragging = false;
      handleSwipe(e.clientX);
    });
    hero.addEventListener('mouseleave', (e) => {
      if (!dragging) return;
      dragging = false;
      handleSwipe(e.clientX);
    });

    startAutoplay();
  }

  /* ------------------------------------------------------------------------
     04. FAQ accordion
     ------------------------------------------------------------------------ */
  function initFaq() {
    $$('.afm-faq__list').forEach((list) => {
      const items = $$('.afm-faq__item', list);

      items.forEach((item) => {
        const button = $('.afm-faq__question', item);
        const answer = $('.afm-faq__answer', item);
        if (!button || !answer) return;

        button.addEventListener('click', () => {
          const wasOpen = item.classList.contains('is-active');

          // Close everything in this list
          items.forEach((other) => {
            other.classList.remove('is-active');
            const q = $('.afm-faq__question', other);
            const a = $('.afm-faq__answer', other);
            if (q) q.setAttribute('aria-expanded', 'false');
            if (a) a.style.maxHeight = null;
          });

          // Open the clicked one if it was closed
          if (!wasOpen) {
            item.classList.add('is-active');
            button.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = `${answer.scrollHeight}px`;
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     05. Fade-up on scroll (supports both .fm-fade-up and .fade-up)
     ------------------------------------------------------------------------ */
  function initFadeUp() {
    const elements = $$('.fm-fade-up, .fade-up');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     06. Services tabs
     ------------------------------------------------------------------------ */
  // Icon paths are written once and reused by the data below
  const ICONS = {
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/>',
    cube: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    cubeOutline: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
    dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    dollarLine: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    drip: '<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-6M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 12l-4-2M8 12l4-2"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    plusCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    bars: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  };

  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${ICONS[name]}</svg>`;

  const SERVICES = [
    {
      label: 'Protected Structures',
      title: 'Engineered Structures for Every Climate',
      desc: 'We design and deliver greenhouse, polyhouse and net house structures tailored to your crop, location and production goals.',
      image: 'images/farm1.jpeg',
      features: [
        { title: 'Site-Specific Design', desc: 'Customized structures for your land and climate.', icon: 'shield' },
        { title: 'Durable & High-Quality', desc: 'Long-lasting materials and precision engineering.', icon: 'gem' },
        { title: 'Scalable Solutions', desc: 'From small units to large commercial farms.', icon: 'cube' },
        { title: 'Optimized for Crops', desc: 'Designed to maximize yield and efficiency.', icon: 'dollar' },
      ],
    },
    {
      label: 'Growing Systems',
      title: 'Modern Systems for Higher Yield',
      desc: 'Hydroponic, soilless and vertical growing systems planned around your crop cycle, water availability and available space.',
      image: 'images/farm4.jpeg',
      features: [
        { title: 'Hydroponic Setups', desc: 'NFT, DFT and drip systems built for consistency.', icon: 'dollar' },
        { title: 'Space Efficient', desc: 'Vertical and multi-tier layouts to grow more per sq. ft.', icon: 'grid' },
        { title: 'Faster Crop Cycles', desc: 'Controlled nutrition for quicker, uniform growth.', icon: 'dollar' },
        { title: 'Low Water Usage', desc: 'Recirculating systems that cut water waste.', icon: 'drip' },
      ],
    },
    {
      label: 'Crop Solutions',
      title: 'The Right Crop for Your Farm',
      desc: 'Expert agronomy guidance to select, plan and manage high-value crops that suit your climate, soil and market demand.',
      image: 'images/farm5.jpeg',
      features: [
        { title: 'Crop Planning', desc: 'Season-wise plans based on profitability.', icon: 'dollar' },
        { title: 'Quality Inputs', desc: 'Trusted seeds, saplings and nutrients.', icon: 'cubeOutline' },
        { title: 'Disease Management', desc: 'Preventive protocols and expert support.', icon: 'shield' },
        { title: 'Agronomy Support', desc: 'On-ground guidance at every growth stage.', icon: 'users' },
      ],
    },
    {
      label: 'Smart Automation',
      title: 'Automation That Farms Smarter',
      desc: 'Sensor-based controls for irrigation, fertigation and climate so your farm runs efficiently with less manual effort.',
      image: 'images/farm6.jpeg',
      features: [
        { title: 'Auto Irrigation', desc: 'Timed and sensor-driven watering schedules.', icon: 'clock' },
        { title: 'Fertigation Control', desc: 'Precise nutrient dosing, every cycle.', icon: 'dollar' },
        { title: 'Remote Monitoring', desc: 'Track and control from your phone.', icon: 'phone' },
        { title: 'Real-Time Alerts', desc: 'Instant notifications for any deviation.', icon: 'bell' },
      ],
    },
    {
      label: 'Water & Climate Management',
      title: 'Full Control Over Water and Climate',
      desc: 'Efficient irrigation, water quality management and climate control systems that keep crops in their ideal growing conditions.',
      image: 'images/farm1.jpeg',
      features: [
        { title: 'Drip & Micro Irrigation', desc: 'Targeted watering with minimal waste.', icon: 'drip' },
        { title: 'Water Treatment', desc: 'Filtration and quality management.', icon: 'plusCircle' },
        { title: 'Cooling & Ventilation', desc: 'Fans, foggers and cooling pads.', icon: 'dollar' },
        { title: 'Climate Sensors', desc: 'Live temperature and humidity tracking.', icon: 'thermometer' },
      ],
    },
    {
      label: 'Market Linkage',
      title: 'From Harvest to the Right Buyer',
      desc: 'We connect your produce with reliable buyers, retailers and processors so your farm earns steady, fair returns.',
      image: 'images/farm4.jpeg',
      features: [
        { title: 'Buyer Network', desc: 'Access to verified retailers and wholesalers.', icon: 'users' },
        { title: 'Assured Demand', desc: 'Planned production matched to market need.', icon: 'bars' },
        { title: 'Quality Grading', desc: 'Sorting and packing to market standards.', icon: 'gem' },
        { title: 'Better Returns', desc: 'Fair pricing and long-term partnerships.', icon: 'dollarLine' },
      ],
    },
  ];

  function initServicesTabs() {
    const sections = $$('.sfs-section');
    if (!sections.length) return;

    const AUTOPLAY_MS = 6000;
    const FADE_OUT_MS = 200;
    const FADE_IN_MS = 300;

    // Preload service images once
    SERVICES.forEach((service) => { new Image().src = service.image; });

    sections.forEach((section) => {
      const tabs = $$('.sfs-tab', section);
      const panel = $('.sfs-panel', section);
      const out = {
        num: $('#sfs-content-num', section),
        label: $('#sfs-content-label', section),
        title: $('#sfs-content-title', section),
        desc: $('#sfs-content-desc', section),
        features: $('#sfs-content-features', section),
        image: $('#sfs-content-image', section),
      };
      if (!tabs.length || !panel || !out.title) return;

      const autoplay = section.getAttribute('data-autoplay') === 'true';
      let current = Math.max(0, tabs.findIndex((tab) => tab.classList.contains('sfs-is-active')));
      let isChanging = false;
      let timer = null;
      let pendingIndex = null;

      const renderPanel = (index) => {
        const data = SERVICES[index];
        if (!data) return;
        const label = data.label;

        out.num.textContent = `0${index + 1}`;
        out.label.textContent = label.toUpperCase();
        out.title.textContent = data.title;
        out.desc.textContent = data.desc;
        out.image.src = data.image;
        out.image.alt = label;
        out.features.innerHTML = data.features.map((f) => `
          <div class="sfs-feature">
            <span class="sfs-feature-icon">${icon(f.icon)}</span>
            <div class="sfs-feature-text">
              <h4 class="sfs-feature-title">${f.title}</h4>
              <p class="sfs-feature-desc">${f.desc}</p>
            </div>
          </div>`).join('');
      };

      const switchTab = (index) => {
        if (isChanging) {
          pendingIndex = index === current ? null : index;
          return;
        }
        if (index === current) return;
        isChanging = true;

        tabs[current].classList.remove('sfs-is-active');
        tabs[current].setAttribute('aria-selected', 'false');
        tabs[index].classList.add('sfs-is-active');
        tabs[index].setAttribute('aria-selected', 'true');
        current = index;

        panel.classList.add('sfs-is-changing');
        setTimeout(() => {
          renderPanel(index);
          requestAnimationFrame(() => {
            panel.classList.remove('sfs-is-changing');
            setTimeout(() => {
              isChanging = false;
              if (pendingIndex !== null) {
                const nextIndex = pendingIndex;
                pendingIndex = null;
                switchTab(nextIndex);
              }
            }, FADE_IN_MS);
          });
        }, FADE_OUT_MS);
      };

      const stopAutoplay = () => clearInterval(timer);
      const startAutoplay = () => {
        stopAutoplay();                       // never stack two timers
        if (!autoplay) return;
        timer = setInterval(() => switchTab((current + 1) % tabs.length), AUTOPLAY_MS);
      };
      const userSwitch = (index) => { switchTab(index); startAutoplay(); };

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => userSwitch(index));

        tab.addEventListener('keydown', (e) => {
          const last = tabs.length - 1;
          const targets = {
            ArrowRight: (index + 1) % tabs.length,
            ArrowLeft: (index - 1 + tabs.length) % tabs.length,
            Home: 0,
            End: last,
          };
          if (!(e.key in targets)) return;
          e.preventDefault();
          tabs[targets[e.key]].focus();
          userSwitch(targets[e.key]);
        });
      });

      const prev = $('#sfs-nav-prev', section);
      const next = $('#sfs-nav-next', section);
      const getNextIndex = (direction) => {
        const baseIndex = pendingIndex === null ? current : pendingIndex;
        return (baseIndex + direction + tabs.length) % tabs.length;
      };
      if (prev) prev.addEventListener('click', () => userSwitch(getNextIndex(-1)));
      if (next) next.addEventListener('click', () => userSwitch(getNextIndex(1)));

      if (autoplay) {
        startAutoplay();
        section.addEventListener('mouseenter', stopAutoplay);
        section.addEventListener('mouseleave', startAutoplay);
        section.addEventListener('focusin', stopAutoplay);
        section.addEventListener('focusout', startAutoplay);
      }
    });
  }

  /* ------------------------------------------------------------------------
     07. Farming models cards
     ------------------------------------------------------------------------ */
  function initModels() {
    const track = $('#fmdmTrack');
    if (!track) return;

    const cards = $$('.fmdm-card', track);
    const dotsWrap = $('#fmdmDots');
    const viewport = $('.fmdm__viewport');
    if (!cards.length) return;

    const HOVER_DELAY_MS = 70;
    const isSmall = () => window.matchMedia('(max-width: 991px)').matches;
    const defaultIndex = cards.findIndex((card) => card.hasAttribute('data-default'));
    let current = defaultIndex !== -1 ? defaultIndex : 0;
    let hoverTimer;

    const dots = dotsWrap
      ? cards.map((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'fmdm-nav__dot';
          dot.setAttribute('aria-label', `Show model ${i + 1}`);
          dot.addEventListener('click', () => setActive(i, true));
          dotsWrap.appendChild(dot);
          return dot;
        })
      : [];

    // Scroll sideways inside the slider only (never moves the whole page)
    const centerCard = (card) => {
      if (!viewport || !card) return;
      const cardRect = card.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const left = viewport.scrollLeft + cardRect.left + cardRect.width / 2
        - (viewportRect.left + viewport.clientWidth / 2);
      viewport.scrollTo({ left, behavior: 'smooth' });
    };

    function setActive(index, scroll = false) {
      current = (index + cards.length) % cards.length;
      cards.forEach((card, i) => {
        card.classList.toggle('is-active', i === current);
        card.setAttribute('aria-expanded', String(i === current));
      });
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
      if (scroll && isSmall()) centerCard(cards[current]);
    }

    cards.forEach((card, i) => {
      card.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => setActive(i), HOVER_DELAY_MS);
      });
      card.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
      card.addEventListener('focusin', () => setActive(i));
      card.addEventListener('click', (e) => {
        if (card.classList.contains('is-active')) return;
        e.preventDefault();
        setActive(i, true);
      });
    });

    const prev = $('#fmdmPrev');
    const next = $('#fmdmNext');
    if (prev) prev.addEventListener('click', () => setActive(current - 1, true));
    if (next) next.addEventListener('click', () => setActive(current + 1, true));

    if (viewport) {
      let scrollEndTimer;
      let recenterTimer;
      const syncActiveCard = () => {
        if (!isSmall()) return;

        const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        if (nearestIndex !== current) {
          setActive(nearestIndex);
          window.clearTimeout(recenterTimer);
          recenterTimer = window.setTimeout(() => centerCard(cards[nearestIndex]), 500);
        }
      };
      const scheduleActiveCardSync = () => {
        window.clearTimeout(scrollEndTimer);
        window.clearTimeout(recenterTimer);
        scrollEndTimer = window.setTimeout(syncActiveCard, 220);
      };

      viewport.addEventListener('scroll', scheduleActiveCardSync, { passive: true });
      viewport.addEventListener('scrollend', syncActiveCard);
    }

    setActive(current);
  }

  /* ------------------------------------------------------------------------
     08. Academy learning path
     ------------------------------------------------------------------------ */
  function initAcademySteps() {
    const steps = $$('.fmat-step');
    if (!steps.length) return;

    steps.forEach((step) => {
      step.addEventListener('click', () => {
        steps.forEach((s) => s.classList.remove('is-active'));
        step.classList.add('is-active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     09. Our Journey animation (GSAP)
     ------------------------------------------------------------------------ */
  function initJourneyAnimation() {
    if (!hasGsap() || !$('.fmoj')) return;

    const trigger = { trigger: '.fmoj', start: 'top 80%' };

    gsap.from('.fmoj__content', {
      scrollTrigger: trigger, x: -100, opacity: 0, duration: 1, ease: 'power3.out',
    });
    gsap.from('.fmoj__media', {
      scrollTrigger: trigger, y: 100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3,
    });

    if ($('.fmoj-steps')) {
      gsap.from('.fmoj-steps .fmoj-step', {
        scrollTrigger: { trigger: '.fmoj-steps', start: 'top 90%' },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      });
    }
  }

  /* ------------------------------------------------------------------------
     10. How We Think — pinned stacked panels (GSAP, about page)
     ------------------------------------------------------------------------ */
  function initStackedPanels() {
    const root = $('.fmpr');
    if (!root || !hasGsap()) return;

    const pin = $('.fmpr__pin', root);
    const panels = gsap.utils.toArray('.fmpr-panel', root);
    const shades = panels.map((p) => $('.fmpr-panel__shade', p));
    const end = $('.fmpr-end', root);
    if (!pin || panels.length < 2) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.classList.add('fmpr--stack');

      panels.forEach((p, i) => gsap.set(p, { zIndex: i + 1 }));
      gsap.set(panels.slice(1), { yPercent: 100 });   // panels 2-4 wait below

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${(panels.length - 1) * Math.round(window.innerHeight * 0.85)}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 'labels', duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: 'power2.inOut' },
        },
      });

      tl.addLabel('panel1');
      panels.slice(1).forEach((panel, i) => {
        tl.to(panel, { yPercent: 0, duration: 1, ease: 'power2.out' })
          .to(shades[i], { opacity: 0.45, duration: 1 }, '<')
          .to(panels[i], { scale: 0.97, transformOrigin: '50% 0%', duration: 1 }, '<')
          .addLabel(`panel${i + 2}`);
      });

      if (end && end.children.length) {
        gsap.from(end.children, {
          y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: end, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      return () => {                                   // cleanup when the media query stops matching
        root.classList.remove('fmpr--stack');
        gsap.set(panels, { clearProps: 'all' });
        gsap.set(shades, { clearProps: 'all' });
      };
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());   // recalc after images load
  }

  /* ------------------------------------------------------------------------
     11. Expertise orbit diagram (about page)
     ------------------------------------------------------------------------ */
  function initExpertise() {
    const root = $('[data-fmex]');
    if (!root) return;

    const MOBILE_MAX = 767;
    const nodes = $$('[data-fmex-node]', root);
    const labels = $$('[data-fmex-label]', root);
    const slides = $$('[data-fmex-slide]', root);
    const lines = $$('[data-fmex-line]', root);
    const ghost = $('[data-fmex-ghost]', root);
    const stepsTrack = $('.fmex-steps', root);

    let selected = null;     // number chosen by click
    let hovered = null;      // number previewed by hover / focus
    let leaveTimer = null;

    const render = () => {
      const current = hovered !== null ? hovered : selected;     // hover wins over selection
      const key = current === null ? '0' : String(current);

      slides.forEach((s) => s.classList.toggle('is-show', s.getAttribute('data-fmex-slide') === key));
      nodes.forEach((n) => {
        const id = n.getAttribute('data-fmex-node');
        n.classList.toggle('is-active', String(current) === id);
        n.setAttribute('aria-pressed', String(selected !== null && String(selected) === id));
      });
      labels.forEach((l) => l.classList.toggle('is-on', String(current) === l.getAttribute('data-fmex-label')));
      lines.forEach((g) => g.classList.toggle('is-on', String(current) === g.getAttribute('data-fmex-line')));
      if (ghost) {
        ghost.textContent = current === null ? '' : `0${current}`;
        ghost.classList.toggle('is-on', current !== null);
      }
    };

    const preview = (n) => { clearTimeout(leaveTimer); hovered = n; render(); };
    const endPreview = () => {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { hovered = null; render(); }, 60);   // avoids flicker between circle and label
    };
    const toggleSelect = (n) => { selected = selected === n ? null : n; render(); };

    [...nodes, ...labels].forEach((el) => {
      const n = parseInt(el.getAttribute('data-fmex-node') || el.getAttribute('data-fmex-label'), 10);
      el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') preview(n); });
      el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') endPreview(); });
      el.addEventListener('click', () => toggleSelect(n));
    });

    nodes.forEach((btn) => {
      const n = parseInt(btn.getAttribute('data-fmex-node'), 10);
      btn.addEventListener('focus', () => preview(n));
      btn.addEventListener('blur', endPreview);
    });

    // Arrows: desktop cycles the diagram, mobile scrolls the cards
    const prevBtn = $('.fmex-arrow--prev', root);
    const nextBtn = $('.fmex-arrow--next', root);
    const cycle = (dir) => {
      if (window.innerWidth <= MOBILE_MAX) {
        if (stepsTrack) stepsTrack.scrollBy({ left: dir * 250, behavior: 'smooth' });
        return;
      }
      let cur = selected !== null ? selected : (hovered !== null ? hovered : 1);
      cur += dir;
      if (cur < 1) cur = nodes.length;
      if (cur > nodes.length) cur = 1;
      selected = cur;
      render();
    };
    if (prevBtn) prevBtn.addEventListener('click', () => cycle(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => cycle(1));

    root.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      selected = null;
      hovered = null;
      render();
    });

    // Mobile: swapping the centre image while the cards scroll
    if (stepsTrack && 'IntersectionObserver' in window) {
      const coreImages = $$('.fmex-core__img', root);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || window.innerWidth > MOBILE_MAX) return;
          const node = $('.fmex-node', entry.target);
          if (!node) return;
          const id = node.getAttribute('data-fmex-node');
          coreImages.forEach((img) => img.classList.toggle('is-show', img.getAttribute('data-fmex-slide') === String(id)));
        });
      }, { root: stepsTrack, threshold: 0.5 });

      Array.from(stepsTrack.children).forEach((card) => observer.observe(card));
    }

    render();
  }

  /* ------------------------------------------------------------------------
     12. Values cards + pins (about page)
     ------------------------------------------------------------------------ */
  function initValues() {
    const root = $('[data-fmvl]');
    if (!root) return;

    const cards = $$('[data-fmvl-card]', root);
    const pins = $$('[data-fmvl-pin]', root);
    const track = $('.fmvl-cards', root);
    const small = window.matchMedia('(max-width: 1099px)');
    let current = -1;

    const centerCard = (card, smooth) => {
      if (!track || !card) return;
      const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    };

    const activate = (index, fromUser) => {
      if (index === current) return;
      current = index;
      cards.forEach((card, i) => {
        const on = i === index;
        card.classList.toggle('is-active', on);
        card.setAttribute('aria-current', on ? 'true' : 'false');
      });
      pins.forEach((pin, i) => pin.classList.toggle('is-active', i === index));
      if (fromUser && small.matches) centerCard(cards[index], true);
    };

    cards.forEach((card, i) => {
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activate(i, true); });
      card.addEventListener('focus', () => activate(i, false));
      card.addEventListener('click', () => activate(i, true));
    });
    pins.forEach((pin, i) => {
      pin.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activate(i, true); });
      pin.addEventListener('click', () => activate(i, true));
    });

    // Mobile arrows
    const prev = $('.fmvl-arrow--prev', root);
    const next = $('.fmvl-arrow--next', root);
    if (track && prev) prev.addEventListener('click', () => track.scrollBy({ left: -250, behavior: 'smooth' }));
    if (track && next) next.addEventListener('click', () => track.scrollBy({ left: 250, behavior: 'smooth' }));

    const start = cards.findIndex((c) => c.classList.contains('is-active'));
    activate(start > -1 ? start : 2, false);
    if (small.matches) centerCard(cards[current], false);
  }

  /* ------------------------------------------------------------------------
     13. Projects slider (home page)
     ------------------------------------------------------------------------ */
  function initProjectsSlider() {
    const root = $('[data-fmpj]');
    if (!root) return;

    const track = $('[data-fmpj-track]', root);
    const cards = $$('[data-fmpj-card]', root);
    const dots = $$('[data-fmpj-dot]', root);
    const prev = $('[data-fmpj-prev]', root);
    const next = $('[data-fmpj-next]', root);
    if (!track || !cards.length || !prev || !next) return;

    const SETTLE_MS = 90;
    let current = 0;
    let scrollTimer = null;

    const clamp = (n) => Math.max(0, Math.min(cards.length - 1, n));
    const padLeft = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const targetLeft = (i) => cards[i].offsetLeft - padLeft();

    const setActive = (i) => {
      current = clamp(i);
      cards.forEach((card, idx) => {
        card.classList.toggle('is-active', idx === current);
        card.setAttribute('aria-current', idx === current ? 'true' : 'false');
      });
      dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === current));
      prev.disabled = current <= 0;
      next.disabled = current >= cards.length - 1;
    };

    const goTo = (i, smooth) => {
      i = clamp(i);
      setActive(i);
      track.scrollTo({ left: targetLeft(i), behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
    };

    // Which card is closest to the left edge right now
    const nearest = () => {
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((_, i) => {
        const d = Math.abs(targetLeft(i) - track.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    };

    prev.addEventListener('click', () => goTo(current - 1, true));
    next.addEventListener('click', () => goTo(current + 1, true));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i, true)));

    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;               // let "View project" links work
        if (i !== current) goTo(i, true);
      });
    });

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1, true); }
    });

    // Swipe / trackpad: update the active card once scrolling settles
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setActive(nearest()), SETTLE_MS);
    }, { passive: true });

    window.addEventListener('resize', () => goTo(current, false));
    window.addEventListener('load', () => goTo(current, false));

    goTo(0, false);
  }

  /* ------------------------------------------------------------------------
     14. Testimonials slider (home page)
     ------------------------------------------------------------------------ */
  function initTestimonials() {
    const root = $('[data-fmts]');
    if (!root) return;

    const track = $('[data-fmts-track]', root);
    const prev = $('[data-fmts-prev]', root);
    const next = $('[data-fmts-next]', root);
    const nav = $('[data-fmts-nav]', root);
    if (!track || !prev || !next) return;

    let ticking = false;

    const stepSize = () => {
      const card = $('[data-fmts-card]', track);
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (nav) nav.hidden = max <= 2;                    // everything fits: hide arrows
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      ticking = false;
    };

    const go = (dir) => {
      track.scrollBy({ left: dir * stepSize(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update);
    window.addEventListener('load', update);

    update();
  }

  /* ------------------------------------------------------------------------
     15. Farm plan form wizard (planfarm page)
     ------------------------------------------------------------------------ */
  function initFarmPlanForm() {
    const root = $('[data-fmfp]');
    if (!root) return;

    const form = $('[data-fmfp-form]', root);
    const steps = $$('[data-fmfp-step]', root);
    const panels = $$('[data-fmfp-panel]', root);
    const next = $('[data-fmfp-next]', root);
    const nextText = $('[data-fmfp-btn-label]', root);
    const back = $('[data-fmfp-back]', root);
    const sample = $('[data-fmfp-sample]', root);
    const bar = $('[data-fmfp-bar]', root);
    const errorBox = $('[data-fmfp-error]', root);
    const preview = $('[data-fmfp-preview]', root);
    if (!form || !panels.length || !next) return;

    const SAMPLE_RESULT = {
      crop: 'Capsicum',
      model: 'Polyhouse',
      invest: '₹25 - 40 Lakhs',
      roi: '2.5 - 3.5 Years',
      scale: '2 Acres',
    };
    let current = 0;
    let reached = 0;

    const setOutput = (key, value) => {
      const el = $(`[data-fmfp-out="${key}"]`, root);
      if (el) el.textContent = value;
    };

    const isPanelValid = (index) => {
      let ok = true;
      let firstInvalid = null;
      $$('input, select, textarea', panels[index]).forEach((control) => {
        const wrap = control.closest('.fmfp-field');
        const good = control.checkValidity();
        if (wrap) wrap.classList.toggle('is-invalid', !good);
        if (!good) {
          ok = false;
          if (!firstInvalid) firstInvalid = control;
        }
      });
      if (errorBox) errorBox.hidden = ok;
      if (firstInvalid) firstInvalid.focus();
      return ok;
    };

    const goTo = (index) => {
      current = index;
      reached = Math.max(reached, index);

      panels.forEach((panel, i) => { panel.hidden = i !== index; });
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === index);
        step.classList.toggle('is-done', i < index);
        if (i === index) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });

      if (bar) bar.style.width = `${((index + 1) / panels.length) * 100}%`;
      if (nextText) nextText.textContent = panels[index].getAttribute('data-fmfp-next-label') || 'Next';
      if (back) back.hidden = index === 0;
      if (sample) sample.hidden = index !== 0;
      if (errorBox) errorBox.hidden = true;
    };

    next.addEventListener('click', () => {
      if (!isPanelValid(current)) return;
      if (current < panels.length - 1) goTo(current + 1);
      else if (form.requestSubmit) form.requestSubmit();
      else form.submit();
    });

    if (back) back.addEventListener('click', () => { if (current > 0) goTo(current - 1); });

    steps.forEach((step, i) => {
      step.addEventListener('click', () => {
        if (i <= reached && i !== current) goTo(i);
        else if (i === current + 1 && isPanelValid(current)) goTo(i);
      });
    });

    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') {
        e.preventDefault();
        next.click();
      }
    });

    // Live update of the preview card while the user types
    const syncPreview = () => {
      const f = form.elements;
      if (f.area && f.area.value) setOutput('scale', `${f.area.value} ${f.unit ? f.unit.value : ''}`.trim());
      if (f.crop && f.crop.value) setOutput('crop', f.crop.value);
      if (f.method && f.method.value) setOutput('model', f.method.value);
    };
    form.addEventListener('input', syncPreview);
    form.addEventListener('change', syncPreview);

    if (sample) {
      sample.addEventListener('click', () => {
        Object.keys(SAMPLE_RESULT).forEach((key) => setOutput(key, SAMPLE_RESULT[key]));
        if (!preview) return;
        preview.classList.remove('is-flash');
        void preview.offsetWidth;                           // restart the CSS animation
        preview.classList.add('is-flash');
        preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    goTo(0);
  }

  /* ------------------------------------------------------------------------
     16. Blog Listing Section (fmbl)
     ------------------------------------------------------------------------ */
  function initBlogListing() {
    const blogSection = $('#blog');
    if (!blogSection) return;

    const pills = $$('.fmbl-pill', blogSection);
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const href = pill.getAttribute('href');
        if (href && (href.startsWith('#') || href === '/blog' || href === '')) {
          pills.forEach((p) => {
            p.classList.remove('is-active');
            p.removeAttribute('aria-current');
          });
          pill.classList.add('is-active');
          pill.setAttribute('aria-current', 'page');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     17. Init
     ------------------------------------------------------------------------ */
  function init() {
    if (hasGsap()) gsap.registerPlugin(ScrollTrigger);   // register once, here only

    // Every page
    initNav();
    initFadeUp();
    initFaq();
    initProtectedStructureTabs();
    initCropCardsSlider();
    initBlogListing();

    // Home page
    initHeroSlider();
    initServicesTabs();
    initModels();
    initAcademySteps();
    initJourneyAnimation();
    initProjectsSlider();
    initTestimonials();

    // About page
    initStackedPanels();
    initExpertise();
    initValues();

    // Plan Your Farm page
    initFarmPlanForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
