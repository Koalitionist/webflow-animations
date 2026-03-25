(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] hero-animation: gsap or ScrollTrigger not found');
    return;
  }

  function init() {
    console.log('[webflow-scripts] hero-animation loaded');

    document.querySelectorAll('[data-animate="fade-up"]').forEach(function (el) {
      var tween = gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        paused: true,
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
        animation: tween,
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
