(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] horizontal-scroll: gsap or ScrollTrigger not found on window');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    console.log('[webflow-scripts] horizontal-scroll loaded');

    document.querySelectorAll('[data-horizontal-scroll]').forEach(function (section) {
      var track = section.querySelector('[data-horizontal-track]');
      if (!track) return;

      var speed = parseFloat(section.dataset.horizontalSpeed) || 1;

      var getScrollDistance = function () {
        return -(track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: getScrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + Math.abs(getScrollDistance()) * speed; },
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
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
