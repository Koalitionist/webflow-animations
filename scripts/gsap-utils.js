// Grab GSAP from the global scope (Webflow loads it via CDN)
// For local previews, add the CDN scripts to the HTML
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

if (!gsap) {
  console.error('[webflow-scripts] gsap not found on window. Make sure GSAP is loaded before this script.');
}
if (ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
} else {
  console.error('[webflow-scripts] ScrollTrigger not found on window. Make sure ScrollTrigger is loaded before this script.');
}

export { gsap, ScrollTrigger };
