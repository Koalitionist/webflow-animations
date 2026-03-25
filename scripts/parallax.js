import { gsap } from './gsap-utils.js';

function init() {
  console.log('[webflow-scripts] parallax loaded');

  // --- Section parallax: elements move at different rates within a section ---
  // Usage: <div data-parallax>
  //          <div data-parallax-speed="0.3">slow</div>
  //          <div data-parallax-speed="1.2">fast</div>
  //        </div>
  //
  // Speed guide: 0 = no movement, 0.5 = subtle, 1 = normal scroll, 1.5+ = fast
  // Negative values = moves opposite to scroll direction

  document.querySelectorAll('[data-parallax]').forEach((section) => {
    const items = section.querySelectorAll('[data-parallax-speed]');

    items.forEach((item) => {
      const speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
      // Convert speed to a y offset: higher speed = more movement
      const yPercent = speed * 100;

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

  // --- Page-wide background parallax ---
  // Usage: <div data-parallax-bg data-parallax-speed="0.3">
  //   Background image moves slower than scroll (classic parallax)
  // </div>

  document.querySelectorAll('[data-parallax-bg]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
    const yPercent = speed * 50;

    gsap.fromTo(
      el,
      { backgroundPositionY: `-${yPercent}%` },
      {
        backgroundPositionY: `${yPercent}%`,
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
