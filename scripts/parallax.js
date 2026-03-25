(function () {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.error('[webflow-scripts] parallax: gsap or ScrollTrigger not found on window');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function init() {
    console.log('[webflow-scripts] parallax loaded');

    document.querySelectorAll('[data-parallax]').forEach(function (section) {
      var items = section.querySelectorAll('[data-parallax-speed]');

      items.forEach(function (item) {
        var speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
        var yPercent = speed * 100;

        gsap.fromTo(
          item,
          { yPercent: -yPercent / 2 },
          {
            yPercent: yPercent / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    document.querySelectorAll('[data-parallax-bg]').forEach(function (el) {
      var speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      var yPercent = speed * 50;

      gsap.fromTo(
        el,
        { backgroundPositionY: '-' + yPercent + '%' },
        {
          backgroundPositionY: yPercent + '%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
