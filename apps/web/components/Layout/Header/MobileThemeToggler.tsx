"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

const MobileThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center"
    >
      <span>
        <Image src={"/images/icon/white-sun-icon.svg"} alt="sun-icon" width={24} height={24} className={`hidden dark:block `} />
        <Image src={"/images/icon/moon-icon.svg"} alt="moon-icon" width={24} height={24} className={`block dark:hidden`} />
      </span>
    </button>
  );
};

export default MobileThemeToggler;
