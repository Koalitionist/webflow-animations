(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] stagger-up: gsap or ScrollTrigger not found');
    return;
  }

  function init() {
    console.log('[webflow-scripts] stagger-up loaded');

    document.querySelectorAll('[data-stagger-up]').forEach(function (container) {
      var children = container.children;
      if (!children.length) return;

      var delay = parseFloat(container.dataset.staggerDelay) || 0.15;
      var duration = parseFloat(container.dataset.staggerDuration) || 0.8;
      var rotation = parseFloat(container.dataset.staggerRotation) || 6;
      var xOffset = parseFloat(container.dataset.staggerX) || 30;

      container.style.overflow = 'hidden';

      var tween = gsap.from(children, {
        yPercent: 100,
        x: xOffset,
        rotation: rotation,
        opacity: 0,
        duration: duration,
        ease: 'power3.out',
        stagger: delay,
        paused: true,
      });

      ScrollTrigger.create({
        trigger: container,
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
