(function () {
  var gsap = window._gsap;
  var ScrollTrigger = window._ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] horizontal-scroll: load gsap-bundle.js first');
    return;
  }

  function init() {
    console.log('[webflow-scripts] horizontal-scroll loaded');

    document.querySelectorAll('[data-horizontal-scroll]').forEach(function (section) {
      var track = section.querySelector('[data-horizontal-track]');
      if (!track) return;

      var speed = parseFloat(section.dataset.horizontalSpeed) || 1;

      var getScrollDistance = function () {
        return -(track.scrollWidth - window.innerWidth);
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: function () {
          return '+=' + Math.abs(getScrollDistance()) * speed;
        },
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          gsap.set(track, { x: self.progress * getScrollDistance() });
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
