'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-999">
      <div className="flex items-center gap-2.5">
        <Link href={"https://getnextjstemplates.com/products/gleamer-nextjs-template"} className="hidden lg:block bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary text-sm text-white font-medium px-4 py-3.5 leading-none rounded-lg text-nowrap transition-all duration-300">
          Book Now
        </Link>
        {isVisible && (
          <div
            onClick={scrollToTop}
            aria-label="scroll to top"
            className="back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary text-white shadow-md transition-all duration-300"
          >
            <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"></span>
          </div>
        )}
      </div>
    </div>
  );
}
