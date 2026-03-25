(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] parallax: gsap or ScrollTrigger not found');
    return;
  }

  function init() {
    console.log('[webflow-scripts] parallax loaded');

    document.querySelectorAll('[data-parallax]').forEach(function (section) {
      var items = section.querySelectorAll('[data-parallax-speed]');

      items.forEach(function (item) {
        var speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
        var range = speed * 100;

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: function (self) {
            var y = (self.progress - 0.5) * range;
            item.style.transform = 'translateY(' + y + 'px)';
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
          var y = (self.progress - 0.5) * range;
          el.style.backgroundPositionY = y + '%';
        },
      });
    });

    // Force ScrollTrigger to pick up new triggers
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Delay slightly to ensure Webflow's GSAP/ScrollTrigger is fully initialized
    setTimeout(init, 100);
  }
})();
