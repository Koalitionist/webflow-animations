import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose our own matched GSAP on a custom namespace
window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;
