(function () {
  var scope   = document.getElementById('afmScope');
  var burger  = document.getElementById('afmBurger');
  var scrim   = document.getElementById('afmScrim');
  var items   = scope.querySelectorAll('.afm-menu__item');

  function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }

  function closeAllExcept(except) {
    items.forEach(function (item) {
      if (item !== except) {
        item.classList.remove('is-open');
        var t = item.querySelector('.afm-menu__link');
        if (t && t.tagName === 'BUTTON') t.setAttribute('aria-expanded', 'false');
      }
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.afm-menu__link');
    var hasPanel = item.querySelector('.afm-dropdown, .afm-mega');
    if (!hasPanel) return;

    // Desktop: hover opens/closes. Mobile: click/tap toggles + accordion.
    trigger.addEventListener('click', function (e) {
      if (isMobile() && e.target.closest('.afm-menu__caret')) {
        e.preventDefault();
        var willOpen = !item.classList.contains('is-open');
        closeAllExcept(item);
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
        return;
      }
      if (trigger.tagName === 'BUTTON') {
        e.preventDefault();
        var willOpen = !item.classList.contains('is-open');
        closeAllExcept(item);
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      }
    });

    item.addEventListener('mouseenter', function () {
      if (isMobile()) return;
      closeAllExcept(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      if (isMobile()) return;
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  function openMobileMenu() {
    scope.classList.add('is-menu-open');
    burger.setAttribute('aria-expanded', 'true');
  }
  function closeMobileMenu() {
    scope.classList.remove('is-menu-open');
    burger.setAttribute('aria-expanded', 'false');
    closeAllExcept(null);
  }

  burger.addEventListener('click', function () {
    scope.classList.contains('is-menu-open') ? closeMobileMenu() : openMobileMenu();
  });
  scrim.addEventListener('click', closeMobileMenu);
  
  var closeBtn = document.getElementById('afmClose');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    if (!scope.contains(e.target)) closeAllExcept(null);
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) closeMobileMenu();
  });


  // Accordion Logic
  var accordionLists = document.querySelectorAll('.afm-faq__list');
  accordionLists.forEach(function(list) {
    var items = list.querySelectorAll('.afm-faq__item');
    items.forEach(function(item) {
      var btn = item.querySelector('.afm-faq__question');
      var answer = item.querySelector('.afm-faq__answer');
      
      btn.addEventListener('click', function() {
        var isOpen = item.classList.contains('is-active');
        
        // Close all others in this list
        items.forEach(function(otherItem) {
          otherItem.classList.remove('is-active');
          otherItem.querySelector('.afm-faq__question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.afm-faq__answer').style.maxHeight = null;
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('is-active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  });
  // Farming Models Carousel removed (now using CSS Grid)

  // Hero Slider Logic
  var heroSlides = document.querySelectorAll('.afm-hero__slide');
  var heroDots = document.querySelectorAll('.afm-hero__dot');
  var currentSlide = 0;
  var slideInterval;

  function goToSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides[currentSlide].classList.remove('active');
    if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    heroSlides[currentSlide].classList.add('active');
    if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');

    // Toggle weather cards based on active slide
    var cardNew = document.getElementById('weatherCardNew');
    var cardOld = document.getElementById('weatherCardOld');
    if (cardNew && cardOld) {
      if (currentSlide === 1) {
        cardNew.style.display = 'none';
        cardOld.style.display = 'block';
      } else {
        cardNew.style.display = 'block';
        cardOld.style.display = 'none';
      }
    }
  }

  function nextSlide() {
    if (heroSlides.length === 0) return;
    var next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next);
  }

  if (heroSlides.length > 0) {
    slideInterval = setInterval(nextSlide, 5000);
    
    heroDots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        clearInterval(slideInterval);
        goToSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });

    // Swipe and Drag Support
    var heroSection = document.querySelector('.afm-hero');
    if (heroSection) {
      var startX = 0;
      var endX = 0;
      var isDragging = false;

      function handleSwipe() {
        var diff = startX - endX;
        if (Math.abs(diff) > 50) { // 50px swipe threshold
          clearInterval(slideInterval);
          if (diff > 0) {
            nextSlide();
          } else {
            var prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
            goToSlide(prev);
          }
          slideInterval = setInterval(nextSlide, 5000);
        }
      }

      heroSection.addEventListener('touchstart', function(e) {
        startX = e.changedTouches[0].screenX;
      }, {passive: true});

      heroSection.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].screenX;
        handleSwipe();
      }, {passive: true});

      heroSection.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
      });

      heroSection.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        endX = e.clientX;
        handleSwipe();
      });

      heroSection.addEventListener('mouseleave', function(e) {
        if (isDragging) {
          isDragging = false;
          endX = e.clientX;
          handleSwipe();
        }
      });
    }
  }

})();

// Academy & Training Steps
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll('.fmat-step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('is-active'));
      step.classList.add('is-active');
    });
  });
});

// Our Journey Animation
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const fmojSection = document.querySelector(".fmoj");
    if (fmojSection) {
      // Left to right animation for content
      gsap.from(".fmoj__content", {
        scrollTrigger: {
          trigger: ".fmoj",
          start: "top 80%",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Bottom to up animation for media and steps
      gsap.from(".fmoj__media", {
        scrollTrigger: {
          trigger: ".fmoj",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
      });
    }

    const fmojSteps = document.querySelector(".fmoj-steps");
    if (fmojSteps) {
      gsap.from(".fmoj-steps .fmoj-step", {
        scrollTrigger: {
          trigger: ".fmoj-steps",
          start: "top 90%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  var fadeElements = document.querySelectorAll('.fm-fade-up');
  if (fadeElements.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  }
});
(function() {
  'use strict';

  const tabData = [
    {
      label: "Protected\nStructures",
      title: "Engineered Structures for Every Climate",
      desc: "We design and deliver greenhouse, polyhouse and net house structures tailored to your crop, location and production goals.",
      image: "images/farm1.jpeg",
      features: [
        { title: "Site-Specific Design", desc: "Customized structures for your land and climate.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
        { title: "Durable & High-Quality", desc: "Long-lasting materials and precision engineering.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>' },
        { title: "Scalable Solutions", desc: "From small units to large commercial farms.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' },
        { title: "Optimized for Crops", desc: "Designed to maximize yield and efficiency.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' }
      ]
    },
    {
      label: "Growing\nSystems",
      title: "Modern Systems for Higher Yield",
      desc: "Hydroponic, soilless and vertical growing systems planned around your crop cycle, water availability and available space.",
      image: "images/farm4.jpeg",
      features: [
        { title: "Hydroponic Setups", desc: "NFT, DFT and drip systems built for consistency.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { title: "Space Efficient", desc: "Vertical and multi-tier layouts to grow more per sq. ft.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>' },
        { title: "Faster Crop Cycles", desc: "Controlled nutrition for quicker, uniform growth.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { title: "Low Water Usage", desc: "Recirculating systems that cut water waste.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-6M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 12l-4-2M8 12l4-2"/></svg>' }
      ]
    },
    {
      label: "Crop\nSolutions",
      title: "The Right Crop for Your Farm",
      desc: "Expert agronomy guidance to select, plan and manage high-value crops that suit your climate, soil and market demand.",
      image: "images/farm5.jpeg",
      features: [
        { title: "Crop Planning", desc: "Season-wise plans based on profitability.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { title: "Quality Inputs", desc: "Trusted seeds, saplings and nutrients.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
        { title: "Disease Management", desc: "Preventive protocols and expert support.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
        { title: "Agronomy Support", desc: "On-ground guidance at every growth stage.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' }
      ]
    },
    {
      label: "Smart\nAutomation",
      title: "Automation That Farms Smarter",
      desc: "Sensor-based controls for irrigation, fertigation and climate so your farm runs efficiently with less manual effort.",
      image: "images/farm6.jpeg",
      features: [
        { title: "Auto Irrigation", desc: "Timed and sensor-driven watering schedules.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { title: "Fertigation Control", desc: "Precise nutrient dosing, every cycle.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { title: "Remote Monitoring", desc: "Track and control from your phone.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
        { title: "Real-Time Alerts", desc: "Instant notifications for any deviation.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }
      ]
    },
    {
      label: "Water & Climate\nManagement",
      title: "Full Control Over Water and Climate",
      desc: "Efficient irrigation, water quality management and climate control systems that keep crops in their ideal growing conditions.",
      image: "images/farm1.jpeg",
      features: [
        { title: "Drip & Micro Irrigation", desc: "Targeted watering with minimal waste.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-6M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 12l-4-2M8 12l4-2"/></svg>' },
        { title: "Water Treatment", desc: "Filtration and quality management.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>' },
        { title: "Cooling & Ventilation", desc: "Fans, foggers and cooling pads.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { title: "Climate Sensors", desc: "Live temperature and humidity tracking.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>' }
      ]
    },
    {
      label: "Market\nLinkage",
      title: "From Harvest to the Right Buyer",
      desc: "We connect your produce with reliable buyers, retailers and processors so your farm earns steady, fair returns.",
      image: "images/farm4.jpeg",
      features: [
        { title: "Buyer Network", desc: "Access to verified retailers and wholesalers.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { title: "Assured Demand", desc: "Planned production matched to market need.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
        { title: "Quality Grading", desc: "Sorting and packing to market standards.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>' },
        { title: "Better Returns", desc: "Fair pricing and long-term partnerships.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' }
      ]
    }
  ];

  function initServicesTabs() {
    const sections = document.querySelectorAll('.sfs-section');
    
    sections.forEach(section => {
      const tabs = section.querySelectorAll('.sfs-tab');
      const panel = section.querySelector('.sfs-panel');
      const contentNum = section.querySelector('#sfs-content-num');
      const contentLabel = section.querySelector('#sfs-content-label');
      const contentTitle = section.querySelector('#sfs-content-title');
      const contentDesc = section.querySelector('#sfs-content-desc');
      const contentFeatures = section.querySelector('#sfs-content-features');
      const contentImage = section.querySelector('#sfs-content-image');
      const autoplaySetting = section.getAttribute('data-autoplay') === 'true';
      
      let isChanging = false;
      let autoplayInterval;
      
      // Preload images
      tabData.forEach(data => {
        const img = new Image();
        img.src = data.image;
      });

      function switchTab(index) {
        if (isChanging) return;
        const currentActive = section.querySelector('.sfs-tab.sfs-is-active');
        const nextActive = tabs[index];
        
        if (currentActive === nextActive) return;

        isChanging = true;
        
        // Update tabs
        currentActive.classList.remove('sfs-is-active');
        currentActive.setAttribute('aria-selected', 'false');
        
        nextActive.classList.add('sfs-is-active');
        nextActive.setAttribute('aria-selected', 'true');
        
        // Scroll tab into view if needed (Disabled to prevent horizontal layout shift)
        // nextActive.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        
        // Start animation
        panel.classList.add('sfs-is-changing');
        
        setTimeout(() => {
          const data = tabData[index];
          
          contentNum.textContent = `0${index + 1}`;
          contentLabel.textContent = data.label.replace('\n', ' ').toUpperCase();
          contentTitle.textContent = data.title;
          contentDesc.textContent = data.desc;
          contentImage.src = data.image;
          contentImage.alt = data.label.replace('\n', ' ');
          
          let featuresHtml = '';
          data.features.forEach(feature => {
            featuresHtml += `
              <div class="sfs-feature">
                <span class="sfs-feature-icon">${feature.icon}</span>
                <div class="sfs-feature-text">
                  <h4 class="sfs-feature-title">${feature.title}</h4>
                  <p class="sfs-feature-desc">${feature.desc}</p>
                </div>
              </div>
            `;
          });
          contentFeatures.innerHTML = featuresHtml;
          
          // Remove animation class after content swap
          requestAnimationFrame(() => {
            panel.classList.remove('sfs-is-changing');
            setTimeout(() => {
              isChanging = false;
            }, 300); // Wait for transition to finish
          });
          
        }, 200);
      }

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          switchTab(index);
          resetAutoplay();
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
          let nextIndex = null;
          if (e.key === 'ArrowRight') {
            nextIndex = (index + 1) % tabs.length;
          } else if (e.key === 'ArrowLeft') {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (e.key === 'Home') {
            nextIndex = 0;
          } else if (e.key === 'End') {
            nextIndex = tabs.length - 1;
          }
          
          if (nextIndex !== null) {
            e.preventDefault();
            tabs[nextIndex].focus();
            switchTab(nextIndex);
            resetAutoplay();
          }
        });
      });

      function startAutoplay() {
        if (!autoplaySetting) return;
        autoplayInterval = setInterval(() => {
          const currentActive = section.querySelector('.sfs-tab.sfs-is-active');
          const index = parseInt(currentActive.getAttribute('data-index'), 10);
          switchTab((index + 1) % tabs.length);
        }, 6000);
      }

      function stopAutoplay() {
        clearInterval(autoplayInterval);
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      if (autoplaySetting) {
        startAutoplay();
        section.addEventListener('mouseenter', stopAutoplay);
        section.addEventListener('mouseleave', startAutoplay);
        section.addEventListener('focusin', stopAutoplay);
        section.addEventListener('focusout', startAutoplay);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesTabs);
  } else {
    initServicesTabs();
  }
})();

// Different Models Section JS
document.addEventListener("DOMContentLoaded", function() {
  const track = document.getElementById('fmdmTrack');
  if (!track) return;
  const cards = [...track.querySelectorAll('.fmdm-card')];
  const dotsWrap = document.getElementById('fmdmDots');
  const defaultIdx = cards.findIndex(c => c.hasAttribute('data-default'));
  let current = defaultIdx !== -1 ? defaultIdx : 0;
  let hoverTimer;

  cards.forEach((_, i) => { const d = document.createElement('button'); d.className = 'fmdm-nav__dot'; d.setAttribute('aria-label', 'Show model ' + (i+1)); d.onclick = () => setActive(i, true); dotsWrap.appendChild(d); });
  const dots = [...dotsWrap.children];

  function setActive(i, scroll) {
    current = (i + cards.length) % cards.length;
    cards.forEach((c, idx) => { c.classList.toggle('is-active', idx === current); c.setAttribute('aria-expanded', idx === current); });
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
    if (scroll || window.matchMedia('(max-width: 991px)').matches) {
      cards[current].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
  cards.forEach((c, i) => {
    c.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) { clearTimeout(hoverTimer); hoverTimer = setTimeout(() => setActive(i), 70); } });
    c.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
    c.addEventListener('focusin', () => setActive(i));
    c.addEventListener('click', e => { if (!c.classList.contains('is-active')) { e.preventDefault(); setActive(i); } });
  });
  
  const prevBtn = document.getElementById('fmdmPrev');
  const nextBtn = document.getElementById('fmdmNext');
  if (prevBtn) prevBtn.onclick = () => setActive(current - 1, true);
  if (nextBtn) nextBtn.onclick = () => setActive(current + 1, true);
  setActive(current);
});

// ===================================================================
// Code Moved from about.html
// ===================================================================

document.addEventListener('DOMContentLoaded', function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const root   = document.querySelector('.fmpr');
  if (!root) return;
  const pin    = root.querySelector('.fmpr__pin');
  const panels = gsap.utils.toArray('.fmpr-panel', root);
  const shades = panels.map(p => p.querySelector('.fmpr-panel__shade'));
  const end    = root.querySelector('.fmpr-end');
  const mm     = gsap.matchMedia();

  /* ALL SCREENS: pinned stacked slide-up */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('fmpr--stack');

    panels.forEach((p, i) => gsap.set(p, { zIndex: i + 1 }));
    gsap.set(panels.slice(1), { yPercent: 100 });              // panels 2-4 wait below

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + (panels.length - 1) * Math.round(window.innerHeight * 0.85),
        pin: true,
        pinSpacing: true,
        scrub: 1,                                              // smooth follow
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 'labels', duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: 'power2.inOut' }
      }
    });

    tl.addLabel('panel1');
    panels.slice(1).forEach((panel, idx) => {
      const prev = idx;                                        // index of the panel being covered
      tl.to(panel, { yPercent: 0, duration: 1, ease: 'power2.out' })
        .to(shades[prev], { opacity: 0.45, duration: 1 }, '<')
        .to(panels[prev], { scale: 0.97, transformOrigin: '50% 0%', duration: 1 }, '<')
        .addLabel('panel' + (idx + 2));
    });

    // closing banner reveal
    gsap.from(end.children, {
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: end, start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    return () => {                                              // cleanup when leaving desktop
      root.classList.remove('fmpr--stack');
      gsap.set(panels, { clearProps: 'all' });
      gsap.set(shades, { clearProps: 'all' });
    };
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());   // recalc after images load
});

document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var root = document.querySelector('[data-fmex]');
  if (!root) return;

  var nodes  = Array.prototype.slice.call(root.querySelectorAll('[data-fmex-node]'));
  var labels = Array.prototype.slice.call(root.querySelectorAll('[data-fmex-label]'));
  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-fmex-slide]'));
  var lines  = Array.prototype.slice.call(root.querySelectorAll('[data-fmex-line]'));
  var ghost  = root.querySelector('[data-fmex-ghost]');

  var selected = null;      // number chosen by click (or null)
  var hovered  = null;      // number being previewed by hover/focus (or null)
  var leaveTimer = null;

  function render() {
    var current = hovered !== null ? hovered : selected;          // hover wins over selection
    var slideKey = current === null ? '0' : String(current);

    slides.forEach(function (s) {
      s.classList.toggle('is-show', s.getAttribute('data-fmex-slide') === slideKey);
    });
    nodes.forEach(function (n) {
      var on = String(current) === n.getAttribute('data-fmex-node');
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-pressed', String(selected !== null && String(selected) === n.getAttribute('data-fmex-node')));
    });
    labels.forEach(function (l) {
      l.classList.toggle('is-on', String(current) === l.getAttribute('data-fmex-label'));
    });
    lines.forEach(function (g) {
      g.classList.toggle('is-on', String(current) === g.getAttribute('data-fmex-line'));
    });
    if (ghost) {
      ghost.textContent = current === null ? '' : ('0' + current);
      ghost.classList.toggle('is-on', current !== null);
    }
  }

  function preview(n) { clearTimeout(leaveTimer); hovered = n; render(); }
  function endPreview() { clearTimeout(leaveTimer); leaveTimer = setTimeout(function () { hovered = null; render(); }, 60); }   // 60ms avoids flicker when moving between a circle and its label
  function toggleSelect(n) { selected = (selected === n) ? null : n; render(); }

  nodes.concat(labels).forEach(function (el) {
    var n = parseInt(el.getAttribute('data-fmex-node') || el.getAttribute('data-fmex-label'), 10);

    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') preview(n); });
    el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') endPreview(); });
    el.addEventListener('click', function () { toggleSelect(n); });
  });

  nodes.forEach(function (btn) {
    var n = parseInt(btn.getAttribute('data-fmex-node'), 10);
    btn.addEventListener('focus', function () { preview(n); });
    btn.addEventListener('blur',  function () { endPreview(); });
  });

  // Desktop Arrow Controls for Orbit Diagram
  var prevBtnEx = root.querySelector('.fmex-arrow--prev');
  var nextBtnEx = root.querySelector('.fmex-arrow--next');
  if (prevBtnEx && nextBtnEx) {
    prevBtnEx.addEventListener('click', function() {
      if (window.innerWidth <= 767) return; // Let mobile scroll handle it
      var cur = (selected !== null) ? selected : (hovered !== null ? hovered : 1);
      cur--;
      if (cur < 1) cur = nodes.length;
      selected = cur;
      render();
    });
    nextBtnEx.addEventListener('click', function() {
      if (window.innerWidth <= 767) return; // Let mobile scroll handle it
      var cur = (selected !== null) ? selected : (hovered !== null ? hovered : 1);
      cur++;
      if (cur > nodes.length) cur = 1;
      selected = cur;
      render();
    });
  }

  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { selected = null; hovered = null; render(); }
  });

  render();
});

document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var root = document.querySelector('[data-fmvl]');
  if (!root) return;

  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-fmvl-card]'));
  var pins  = Array.prototype.slice.call(root.querySelectorAll('[data-fmvl-pin]'));
  var track = root.querySelector('.fmvl-cards');
  var current = -1;
  var small = window.matchMedia('(max-width: 1099px)');

  function activate(index, fromUser) {
    if (index === current) return;
    current = index;
    cards.forEach(function (c, i) {
      var on = i === index;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-current', on ? 'true' : 'false');
    });
    pins.forEach(function (p, i) { p.classList.toggle('is-active', i === index); });
    if (fromUser && small.matches) centerCard(cards[index], true);
  }

  function centerCard(card, smooth) {
    if (!track || !card) return;
    var left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: left, behavior: smooth ? 'smooth' : 'auto' });
  }

  cards.forEach(function (card, i) {
    card.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') activate(i, true); });
    card.addEventListener('focus', function () { activate(i, false); });
    card.addEventListener('click', function () { activate(i, true); });
  });

  pins.forEach(function (pin, i) {
    pin.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') activate(i, true); });
    pin.addEventListener('click', function () { activate(i, true); });
  });

  var start = cards.findIndex(function (c) { return c.classList.contains('is-active'); });
  activate(start > -1 ? start : 2, false);
  if (small.matches) centerCard(cards[current], false);
});

document.addEventListener('DOMContentLoaded', function() {
  // Our Values Mobile Slider Arrows
  var prevBtnVal = document.querySelector('.fmvl-arrow--prev');
  var nextBtnVal = document.querySelector('.fmvl-arrow--next');
  var cardsContainerVal = document.querySelector('.fmvl-cards');
  if (prevBtnVal && nextBtnVal && cardsContainerVal) {
    prevBtnVal.addEventListener('click', function() { 
      cardsContainerVal.scrollBy({ left: -250, behavior: 'smooth' }); 
    });
    nextBtnVal.addEventListener('click', function() { 
      cardsContainerVal.scrollBy({ left: 250, behavior: 'smooth' }); 
    });
  }

  // Our Expertise Mobile Slider Arrows
  var prevBtnEx = document.querySelector('.fmex-arrow--prev');
  var nextBtnEx = document.querySelector('.fmex-arrow--next');
  var cardsContainerEx = document.querySelector('.fmex-steps');
  if (prevBtnEx && nextBtnEx && cardsContainerEx) {
    prevBtnEx.addEventListener('click', function() { 
      cardsContainerEx.scrollBy({ left: -250, behavior: 'smooth' }); 
    });
    nextBtnEx.addEventListener('click', function() { 
      cardsContainerEx.scrollBy({ left: 250, behavior: 'smooth' }); 
    });

    if (window.IntersectionObserver) {
      var slidesImgs = document.querySelectorAll('.fmex-core__img');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && window.innerWidth <= 767) {
            var nodeBtn = entry.target.querySelector('.fmex-node');
            if (nodeBtn) {
              var idx = nodeBtn.getAttribute('data-fmex-node');
              slidesImgs.forEach(function(img) {
                img.classList.toggle('is-show', img.getAttribute('data-fmex-slide') === String(idx));
              });
            }
          }
        });
      }, {
        root: cardsContainerEx,
        threshold: 0.5
      });
      
      Array.from(cardsContainerEx.children).forEach(function(card) {
        observer.observe(card);
      });
    }
  }
});
