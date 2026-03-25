import { gsap } from './gsap-utils.js';

// Wait for DOM ready
function init() {
  console.log('[webflow-scripts] hero-animation loaded');

  // Example: fade-in + slide-up for elements with [data-animate="fade-up"]
  const elements = document.querySelectorAll('[data-animate="fade-up"]');

  elements.forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
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
