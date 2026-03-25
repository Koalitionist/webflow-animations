import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose our own matched GSAP on a custom namespace
window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;

// Our GSAP instance has its own ticker separate from Webflow's.
// We need to pump ScrollTrigger.update() on every frame so it
// picks up scroll position changes.
gsap.ticker.add(function () {
  ScrollTrigger.update();
});
