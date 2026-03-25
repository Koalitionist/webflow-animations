(function () {
  var gsap = window._gsap;
  var ScrollTrigger = window._ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] hero-animation: load gsap-bundle.js first');
    return;
  }

  function init() {
    console.log('[webflow-scripts] hero-animation loaded');

    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
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
