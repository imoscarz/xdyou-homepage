"use client";

import { useEffect } from "react";

export default function HomeEffects() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      "[data-home-reveal], #downloads, .contributor-field",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
          if (entry.isIntersecting) entry.target.classList.add("has-entered");
        }
      },
      { threshold: 0.08 },
    );
    targets.forEach((target) => observer.observe(target));
    // Keyboard navigation must also bring a covered sticky page back into view.
    const revealFocusedPage = (event: FocusEvent) => {
      const target = event.target;
      // TOC navigation focuses a heading with preventScroll; do not override it.
      // This recovery is only for tabbing into interactive controls on a covered page.
      if (
        !(target instanceof HTMLElement) ||
        !target.matches("a, button, input, select, textarea, [role='button']")
      )
        return;
      const page = target.closest<HTMLElement>("[data-page]");
      if (!page) return;
      const marker = document.getElementById(page.dataset.page!);
      const next = page.nextElementSibling;
      if (marker && next && next.getBoundingClientRect().top < 100) {
        marker.scrollIntoView({ behavior: "instant", block: "start" });
      }
    };
    document.addEventListener("focusin", revealFocusedPage);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", revealFocusedPage);
    };
  }, []);
  return null;
}
