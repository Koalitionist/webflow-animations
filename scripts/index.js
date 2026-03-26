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

    var cards = Array.from(track.children);
    var speed = parseFloat(section.dataset.horizontalSpeed) || 1.5;

    // Auto-apply styles: stack cards on top of each other
    section.style.height = '100vh';
    section.style.overflow = 'hidden';
    track.style.position = 'relative';
    track.style.height = '100%';
    track.style.display = 'flex';
    track.style.alignItems = 'center';
    track.style.justifyContent = 'center';

    cards.forEach(function (card) {
      card.style.position = 'absolute';
      card.style.maxWidth = '90vw';
    });

    // Use native sticky for pinning
    section.style.position = 'sticky';
    section.style.top = '0';

    // Wrap in a tall container for scroll room
    var wrapper = document.createElement('div');
    wrapper.style.height = (cards.length * speed * window.innerHeight) + 'px';
    wrapper.style.position = 'relative';
    section.parentNode.insertBefore(wrapper, section);
    wrapper.appendChild(section);

    // Build timeline: cards animate in and out
    var tl = gsap.timeline({ paused: true });

    // First card starts visible
    gsap.set(cards[0], { scale: 1, opacity: 1, zIndex: cards.length });

    // Other cards start hidden, offset right, scaled down
    for (var i = 1; i < cards.length; i++) {
      gsap.set(cards[i], {
        xPercent: 60,
        scale: 0.75,
        opacity: 0,
        zIndex: cards.length - i,
      });
    }

    // Each card transition: current slides left + shrinks, next slides in + grows
    for (var i = 0; i < cards.length - 1; i++) {
      var t = i;

      // Current card exits left and shrinks
      tl.to(cards[i], {
        xPercent: -60,
        scale: 0.75,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
      }, t);

      // Next card enters from right and grows
      tl.to(cards[i + 1], {
        xPercent: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
      }, t);
    }

    // Scrub based on scroll position
    var wrapperHeight = wrapper.offsetHeight;

    function updateCards() {
      var wrapperRect = wrapper.getBoundingClientRect();
      var progress = -wrapperRect.top / (wrapperHeight - window.innerHeight);
      progress = Math.max(0, Math.min(1, progress));
      tl.progress(progress);
    }

    window.addEventListener('scroll', updateCards, { passive: true });
    updateCards();
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

// ---- REFRESH ----
// Recalculate trigger positions after page fully loads and Webflow finishes layout
window.addEventListener('load', function () {
  ScrollTrigger.refresh();
});

// Also refresh after Webflow's own init (may run after load)
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  ScrollTrigger.refresh();
});
