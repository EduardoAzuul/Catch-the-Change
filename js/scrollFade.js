(function() {
  const hero = document.querySelector('.hero');
  const nav = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const max = window.innerHeight * 0.6;
    const sc = Math.min(window.scrollY / max, 1);

    // control CSS variables for opacity & translate
    hero.style.setProperty('--bg-opacity', 1 - sc);
    hero.style.setProperty('--bg-translate', `${sc * 30}px`);

    // navbar background toggle
    if (window.scrollY > 40) {
      nav.classList.add('navbar-scrolled');
    } else {
      nav.classList.remove('navbar-scrolled');
    }
  }, { passive: true });
})();
