import { useEffect } from "react";

import '../css/stylemain.css';

export default function scrollFade() {
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const nav = document.querySelector(".navbar");

    if (!hero && !nav) return;

    const onScroll = () => {
      const max = window.innerHeight * 0.6;
      const sc = Math.min(window.scrollY / max, 1);

      if (hero) {
        hero.style.setProperty("--bg-opacity", String(1 - sc));
        hero.style.setProperty("--bg-translate", `${sc * 30}px`);
      }

      if (nav) {
        if (window.scrollY > 40) {
          nav.classList.add("navbar-scrolled");
        } else {
          nav.classList.remove("navbar-scrolled");
        }
      }
    };

    onScroll(); // initial state
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}