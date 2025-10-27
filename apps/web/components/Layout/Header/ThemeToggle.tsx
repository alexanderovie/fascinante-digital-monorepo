"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group flex items-center cursor-pointer justify-center"
    >
      <span>
        <Image src={"/images/icon/white-sun-icon.svg"} alt="sun-icon" width={18} height={18} className={`hidden dark:block md:w-5 md:h-5`} />
        <Image src={"/images/icon/white-sun-icon.svg"} alt="moon-icon" width={18} height={18} className={`block dark:hidden md:w-5 md:h-5`} />
      </span>
    </button>
  );
};

export default ThemeToggler;
