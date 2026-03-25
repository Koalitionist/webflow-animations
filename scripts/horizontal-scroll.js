import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function init() {
  console.log('[webflow-scripts] horizontal-scroll loaded');

  // Usage:
  // <section data-horizontal-scroll>
  //   <div data-horizontal-track>
  //     <div>Card 1</div>
  //     <div>Card 2</div>
  //     <div>Card 3</div>
  //   </div>
  // </section>
  //
  // Optional: data-horizontal-speed="0.5" on the section to control scroll length
  //   1 = default, 0.5 = faster scroll, 2 = slower/longer scroll

  document.querySelectorAll('[data-horizontal-scroll]').forEach((section) => {
    const track = section.querySelector('[data-horizontal-track]');
    if (!track) return;

    const speed = parseFloat(section.dataset.horizontalSpeed) || 1;

    // Calculate how far to scroll: track width minus the viewport
    const getScrollDistance = () => -(track.scrollWidth - window.innerWidth);

    gsap.to(track, {
      x: getScrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollDistance()) * speed}`,
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
