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
      gsap.set(el, { y: 60, opacity: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
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
