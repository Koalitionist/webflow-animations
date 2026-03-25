import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;
