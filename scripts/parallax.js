import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function init() {
  console.log('[webflow-scripts] parallax loaded');

  document.querySelectorAll('[data-parallax]').forEach(function (section) {
    section.querySelectorAll('[data-parallax-speed]').forEach(function (item) {
      var speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
      var range = speed * 100;

      gsap.fromTo(
        item,
        { yPercent: -range / 2 },
        {
          yPercent: range / 2,
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
    var range = speed * 50;

    gsap.fromTo(
      el,
      { backgroundPositionY: '-' + range + '%' },
      {
        backgroundPositionY: range + '%',
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
