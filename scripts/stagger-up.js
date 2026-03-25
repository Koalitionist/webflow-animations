import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function init() {
  console.log('[webflow-scripts] stagger-up loaded');

  // Usage:
  // <div data-stagger-up>
  //   <div>Child 1</div>
  //   <div>Child 2</div>
  //   <div>Child 3</div>
  // </div>
  //
  // Optional attributes on the parent:
  //   data-stagger-delay="0.15"    — delay between each child (default 0.15)
  //   data-stagger-duration="0.8"  — animation duration per child (default 0.8)
  //   data-stagger-rotation="6"    — starting rotation in degrees (default 6)
  //   data-stagger-x="30"          — starting x offset in px (default 30)

  document.querySelectorAll('[data-stagger-up]').forEach((container) => {
    const children = container.children;
    if (!children.length) return;

    const delay = parseFloat(container.dataset.staggerDelay) || 0.15;
    const duration = parseFloat(container.dataset.staggerDuration) || 0.8;
    const rotation = parseFloat(container.dataset.staggerRotation) || 6;
    const xOffset = parseFloat(container.dataset.staggerX) || 30;

    // Set overflow hidden on parent so children are clipped while below
    container.style.overflow = 'hidden';

    gsap.from(children, {
      yPercent: 100,
      x: xOffset,
      rotation: rotation,
      opacity: 0,
      duration: duration,
      ease: 'power3.out',
      stagger: delay,
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
