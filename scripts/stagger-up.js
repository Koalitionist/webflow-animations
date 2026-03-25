(function () {
  var gsap = window._gsap;
  var ScrollTrigger = window._ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] stagger-up: load gsap-bundle.js first');
    return;
  }

  function init() {
    console.log('[webflow-scripts] stagger-up loaded');

    document.querySelectorAll('[data-stagger-up]').forEach(function (container) {
      var children = Array.from(container.children);
      if (!children.length) return;

      var delay = parseFloat(container.dataset.staggerDelay) || 0.15;
      var duration = parseFloat(container.dataset.staggerDuration) || 0.8;
      var rotation = parseFloat(container.dataset.staggerRotation) || 6;
      var xOffset = parseFloat(container.dataset.staggerX) || 30;

      container.style.overflow = 'hidden';

      children.forEach(function (child) {
        gsap.set(child, { yPercent: 100, x: xOffset, rotation: rotation, opacity: 0 });
      });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          children.forEach(function (child, i) {
            gsap.to(child, {
              yPercent: 0,
              x: 0,
              rotation: 0,
              opacity: 1,
              duration: duration,
              ease: 'power3.out',
              delay: i * delay,
            });
          });
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
