import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose our own matched GSAP on a custom namespace
window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;

// Our GSAP instance is separate from Webflow's, so its ScrollTrigger
// doesn't receive scroll events from Webflow's ticker. We run our own
// rAF loop to keep it in sync.
(function tick() {
  ScrollTrigger.update();
  requestAnimationFrame(tick);
})();
