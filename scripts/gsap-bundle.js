import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose our own matched GSAP on a custom namespace
window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;

// Our GSAP/ScrollTrigger instance is isolated from Webflow's, so it
// misses native scroll events. We explicitly listen and pump updates.
window.addEventListener('scroll', function () {
  ScrollTrigger.update();
}, { passive: true });

// Also update on resize
window.addEventListener('resize', function () {
  ScrollTrigger.refresh();
});

// Initial sync
ScrollTrigger.refresh();
