document.addEventListener("DOMContentLoaded", () => {
    // --- Agritech Journey Animations ---
    const ajTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".agritech-journey",
            start: "top 75%",
        }
    });

    // Process line draws
    ajTl.from(".aj-svg-path", {
        strokeDashoffset: 1500, strokeDasharray: 1500, duration: 2, ease: "power2.inOut"
    });
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
      
      const tabBar = section.querySelector('.sfs-tab-bar');
      const prevBtn = section.querySelector('#sfs-nav-prev');
      const nextBtn = section.querySelector('#sfs-nav-next');
      if (prevBtn && nextBtn && tabBar) {
        prevBtn.addEventListener('click', () => {
          const currentActive = section.querySelector('.sfs-tab.sfs-is-active');
          const index = parseInt(currentActive.getAttribute('data-index'), 10);
          const nextIndex = (index - 1 + tabs.length) % tabs.length;
          switchTab(nextIndex);
          resetAutoplay();
        });
        nextBtn.addEventListener('click', () => {
          const currentActive = section.querySelector('.sfs-tab.sfs-is-active');
          const index = parseInt(currentActive.getAttribute('data-index'), 10);
          const nextIndex = (index + 1) % tabs.length;
          switchTab(nextIndex);
          resetAutoplay();
        });
      }
      
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

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
});
