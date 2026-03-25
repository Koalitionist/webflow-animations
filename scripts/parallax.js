(function () {
  'use strict';

  function init() {
    console.log('[webflow-scripts] parallax loaded');

    var sections = document.querySelectorAll('[data-parallax]');
    var bgElements = document.querySelectorAll('[data-parallax-bg]');

    if (!sections.length && !bgElements.length) return;

    var items = [];

    sections.forEach(function (section) {
      section.querySelectorAll('[data-parallax-speed]').forEach(function (el) {
        items.push({
          el: el,
          trigger: section,
          speed: parseFloat(el.dataset.parallaxSpeed) || 0.5,
          type: 'transform',
        });
      });
    });

    bgElements.forEach(function (el) {
      items.push({
        el: el,
        trigger: el,
        speed: parseFloat(el.dataset.parallaxSpeed) || 0.3,
        type: 'background',
      });
    });

    var ticking = false;

    function update() {
      var viewH = window.innerHeight;

      items.forEach(function (item) {
        var rect = item.trigger.getBoundingClientRect();
        var progress = 1 - rect.bottom / (viewH + rect.height);
        progress = Math.max(0, Math.min(1, progress));

        if (item.type === 'transform') {
          var y = (progress - 0.5) * item.speed * 100;
          item.el.style.transform = 'translateY(' + y + 'px)';
        } else {
          var bgY = (progress - 0.5) * item.speed * 50;
          item.el.style.backgroundPositionY = bgY + '%';
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
