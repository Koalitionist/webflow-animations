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
    var speed = parseFloat(section.dataset.horizontalSpeed) || 0.8;
    var visible = parseInt(section.dataset.horizontalVisible) || 3;
    var gap = 20; // px gap between cards

    // Auto-apply styles
    section.style.height = '100vh';
    section.style.overflow = 'hidden';
    track.style.position = 'relative';
    track.style.height = '100%';
    track.style.display = 'flex';
    track.style.alignItems = 'center';
    track.style.justifyContent = 'center';
    track.style.gap = gap + 'px';

    // Cards share the viewport width
    var cardWidth = (window.innerWidth - gap * (visible + 1)) / visible;
    cards.forEach(function (card) {
      card.style.flexShrink = '0';
      card.style.width = cardWidth + 'px';
    });

    var scrollDistance = track.scrollWidth - window.innerWidth;
    if (scrollDistance <= 0) return;

    // Use native sticky for pinning
    section.style.position = 'sticky';
    section.style.top = '0';
    track.style.paddingLeft = gap + 'px';
    track.style.paddingRight = gap + 'px';

    // Wrap in a tall container for scroll room
    var steps = cards.length - visible;
    var wrapper = document.createElement('div');
    wrapper.style.height = (steps * speed * window.innerHeight + window.innerHeight) + 'px';
    wrapper.style.position = 'relative';
    section.parentNode.insertBefore(wrapper, section);
    wrapper.appendChild(section);

    // Set initial card states: first `visible` are full, rest are scaled/faded
    cards.forEach(function (card, i) {
      if (i < visible) {
        gsap.set(card, { scale: 1, opacity: 1 });
      } else {
        gsap.set(card, { scale: 0.8, opacity: 0 });
      }
    });

    // Build timeline: slide track one card width at a time
    // leading card exits + shrinks, new card enters + grows
    var tl = gsap.timeline({ paused: true });
    var stepWidth = cardWidth + gap;

    for (var i = 0; i < steps; i++) {
      var t = i;

      // Slide track left by one card
      tl.to(track, {
        x: -(stepWidth * (i + 1)),
        duration: 1,
        ease: 'power1.inOut',
      }, t);

      // Exiting card (left side) shrinks and fades
      tl.to(cards[i], {
        scale: 0.85,
        opacity: 0.3,
        duration: 0.8,
        ease: 'power2.in',
      }, t);

      // Entering card (right side) grows and fades in
      if (cards[i + visible]) {
        tl.to(cards[i + visible], {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, t + 0.2);
      }
    }

    // Scrub based on scroll position
    var wrapperHeight = wrapper.offsetHeight;

    function updateCards() {
      var wrapperRect = wrapper.getBoundingClientRect();
      var progress = -wrapperRect.top / (wrapperHeight - window.innerHeight);
      progress = Math.max(0, Math.min(1, progress));

      // Drive track position via CSS (reliable)
      var trackX = progress * steps * stepWidth;
      track.style.transform = 'translateX(' + (-trackX) + 'px)';

      // Drive card effects via timeline
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
