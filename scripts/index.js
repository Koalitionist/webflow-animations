import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Expose on a separate namespace (Webflow's globals are saved/restored by the build wrapper)
window._gsap = gsap;
window._ScrollTrigger = ScrollTrigger;

// Our isolated ScrollTrigger needs its own scroll/resize listeners
// since Webflow's ticker won't pump our instance
window.addEventListener('scroll', function () { ScrollTrigger.update(); }, { passive: true });
window.addEventListener('resize', function () { ScrollTrigger.refresh(); });

// ---- PARALLAX ----
(function () {
  var sections = document.querySelectorAll('[data-parallax], [data-parallax-bg]');
  if (!sections.length) return;

  console.log('[webflow-scripts] parallax loaded');

  document.querySelectorAll('[data-parallax]').forEach(function (section) {
    section.querySelectorAll('[data-parallax-speed]').forEach(function (item) {
      var speed = parseFloat(item.dataset.parallaxSpeed) || 0.5;
      var range = speed * 100;

      gsap.fromTo(
        item,
        { yPercent: -range / 2 },
        {
          yPercent: range / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  });

  document.querySelectorAll('[data-parallax-bg]').forEach(function (el) {
    var speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
    var range = speed * 50;

    gsap.fromTo(
      el,
      { backgroundPositionY: '-' + range + '%' },
      {
        backgroundPositionY: range + '%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
})();

// ---- HERO ANIMATION ----
(function () {
  var els = document.querySelectorAll('[data-animate="fade-up"]');
  if (!els.length) return;

  console.log('[webflow-scripts] hero-animation loaded');

  els.forEach(function (el) {
    gsap.set(el, { y: 60, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      },
    });
  });
})();

// ---- HORIZONTAL SCROLL ----
(function () {
  var sections = document.querySelectorAll('[data-horizontal-scroll]');
  if (!sections.length) return;

  console.log('[webflow-scripts] horizontal-scroll loaded');

  sections.forEach(function (section) {
    var track = section.querySelector('[data-horizontal-track]');
    if (!track) return;

    // Auto-apply required styles
    section.style.height = '100vh';
    section.style.overflow = 'hidden';
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.height = '100%';
    Array.from(track.children).forEach(function (child) {
      child.style.flexShrink = '0';
    });

    var speed = parseFloat(section.dataset.horizontalSpeed) || 1;
    var getScrollDistance = function () {
      return -(track.scrollWidth - window.innerWidth);
    };

    gsap.to(track, {
      x: getScrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: function () {
          return '+=' + Math.abs(getScrollDistance()) * speed;
        },
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
})();

// ---- STAGGER UP ----
(function () {
  var containers = document.querySelectorAll('[data-stagger-up]');
  if (!containers.length) return;

  console.log('[webflow-scripts] stagger-up loaded');

  containers.forEach(function (container) {
    var children = Array.from(container.children);
    if (!children.length) return;

    var delay = parseFloat(container.dataset.staggerDelay) || 0.15;
    var duration = parseFloat(container.dataset.staggerDuration) || 0.8;
    var rotation = parseFloat(container.dataset.staggerRotation) || 6;
    var xOffset = parseFloat(container.dataset.staggerX) || 30;

    container.style.overflow = 'hidden';

    children.forEach(function (child) {
      gsap.set(child, { yPercent: 100, x: xOffset, rotation: rotation, opacity: 0 });
    });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        children.forEach(function (child, i) {
          gsap.to(child, {
            yPercent: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
            duration: duration,
            ease: 'power3.out',
            delay: i * delay,
          });
        });
      },
    });
  });
})();
