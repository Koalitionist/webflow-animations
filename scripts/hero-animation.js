(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] hero-animation: gsap or ScrollTrigger not found on window');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    console.log('[webflow-scripts] hero-animation loaded');

    var elements = document.querySelectorAll('[data-animate="fade-up"]');

    elements.forEach(function (el) {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
