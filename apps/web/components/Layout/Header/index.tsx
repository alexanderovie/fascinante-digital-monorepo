"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Suspense, useEffect, useRef, useState } from "react";
import DesktopHeader from "./DesktopHeader";
import TopHeader from "./TopHeader";

interface HeaderProps {
  locale?: Locale;
  dict?: Dictionary;
}

const Header = ({ locale: propLocale, dict: propDict }: HeaderProps = {}) => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let acc = 0;
    let ticking = false;
    const THRESH_HIDE = 96;
    const HYSTERESIS = 24;
    const EDGE_REVEAL = 24;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY;
        acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;
        const nearTop = y < THRESH_HIDE;
        const nearEdge = y <= EDGE_REVEAL;

        // Ocultar solo si se acumula suficiente desplazamiento hacia abajo (histéresis)
        if (!nearTop && dy > 0 && !hidden && Math.abs(acc) > HYSTERESIS) setHidden(true);
        if ((dy < 0 && Math.abs(acc) > HYSTERESIS) || nearTop || nearEdge) {
          setHidden(false);
          acc = 0;
        }

        setScrolled(y > 0);
        lastY = y;
        ticking = false;
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY <= EDGE_REVEAL) setHidden(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [hidden]);

  return (
    <header
      ref={headerRef}
      className={`site-header fixed top-0 z-50 w-full transform-gpu will-change-transform transition-transform motion-reduce:transition-none ${hidden ? "duration-300 ease-in -translate-y-full" : "duration-500 ease-out translate-y-0"} ${scrolled ? "shadow-xl" : ""}`}
    >
      <div>
        <TopHeader locale={propLocale} dict={propDict} />
      </div>

      <Suspense fallback={null}>
        <DesktopHeader locale={propLocale} dict={propDict} />
      </Suspense>
    </header>
  );
}

export default Header;
