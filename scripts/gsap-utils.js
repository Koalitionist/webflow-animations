// Use Webflow's global GSAP if available, otherwise use our bundled version
import _gsap from 'gsap';
import { ScrollTrigger as _ScrollTrigger } from 'gsap/ScrollTrigger';

const gsap = window.gsap || _gsap;
const ScrollTrigger = window.ScrollTrigger || _ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
