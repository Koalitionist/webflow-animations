(function () {
  var gsap = window._gsap;
  var ScrollTrigger = window._ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] parallax: load gsap-bundle.js first');
    return;
  }

  function init() {
    console.log('[webflow-scripts] parallax loaded');

    document.querySelectorAll('[data-parallax]').forEach(function (section) {
      section.querySelectorAll('[data-parallax-speed]').forEach(function (item) {
        var speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
        var range = speed * 100;

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: function (self) {
            gsap.set(item, { yPercent: (self.progress - 0.5) * range });
          },
        });
      });
    });

    document.querySelectorAll('[data-parallax-bg]').forEach(function (el) {
      var speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      var range = speed * 50;

      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: function (self) {
          el.style.backgroundPositionY = (self.progress - 0.5) * range + '%';
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
