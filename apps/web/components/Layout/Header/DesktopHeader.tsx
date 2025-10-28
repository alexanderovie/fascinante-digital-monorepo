"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from "@/app/[locale]/i18n-context";
import { supabase } from "@/app/supabase/supabaseClient";
import { useLocale } from "@/lib/hooks/use-locale";
import type { Locale } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BookServicesModal from "./BookServicesModal";
import Logo from "./Logo";
import { useMenuData } from "./Menudata";
import MobileThemeToggler from "./MobileThemeToggler";

interface DesktopHeaderProps {
  locale?: Locale;
  dict?: Dictionary;
}

const DesktopHeader = ({ locale: propLocale, dict: propDict }: DesktopHeaderProps = {}) => {
  // Try to use context, fallback to props (SSG-safe)
  let dict, locale;
  try {
    const context = useI18n();
    dict = context.dict;
    locale = context.locale;
  } catch {
    dict = propDict;
    locale = propLocale || useLocale();
  }

  if (!dict || !locale) return null;

  const menuData = useMenuData(locale, dict);
  const header = dict.header as Record<string, string>;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState<{ user: unknown } | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tooltipRef = useRef(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session);
    };
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && (event.target instanceof Node) && (tooltipRef.current as unknown as Node).contains) {
        if (!(tooltipRef.current as unknown as Node).contains(event.target)) {
          setShowTooltip(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    getSession();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [pathname]);

  useEffect(() => {
    const updateActiveLink = () => {
      const fullPath = window.location.hash
        ? `${pathname}${window.location.hash}`
        : pathname;
      setActiveLink(fullPath);
    };
    updateActiveLink();
  }, [pathname, searchParams, setActiveLink]);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <div className="py-[15px] md:py-[17.5px] lg:py-5 bg-white dark:bg-secondary shadow-xl">
      <div className="container">
        <div className="flex justify-between items-center">
          {/* ZONA 1: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* ZONA 2: Menú Centrado */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-0 xl:gap-1">
              {menuData.map((value, index) => {
                return (
                  <li key={index} className="group">
                    <Link href={value.path} className={`block px-1.5 xl:px-3 xxl:px-4 py-2 rounded-md ${activeLink === value.path ? "bg-gray-100" : ""} hover:bg-gray-100 transition duration-300`}>
                      <p className={`text-[15px] xl:text-base font-semibold ${activeLink === value.path ? "text-secondary dark:text-white" : "text-secondary dark:text-white"} group-hover:text-secondary dark:group-hover:text-white`}>{value.title}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ZONA 3: CTAs se mantienen igual */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Link href={"tel:(800) 886-4981"} className="flex items-center gap-0.5 xl:gap-2 px-2 xl:px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/25 rounded-md transition duration-300">
              <Image src={"/images/header/phone-icon.svg"} alt="phone-icon" width={24} height={24} className="dark:hidden" />
              <Image src={"/images/header/phone-white-icon.svg"} alt="phone-icon" width={24} height={24} className="hidden dark:block" />
              <p className="hidden xl:block text-[15px] xl:text-base font-semibold dark:text-white">(800) 886-4981</p>
            </Link>
            <div onClick={() => setModalOpen(true)} className="group flex items-center py-2.5 xl:py-3 px-3 xl:px-4 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm cursor-pointer transition-all duration-300">
              <span className="text-sm text-white group-hover:text-white font-bold">{header.bookService}</span>
            </div>
            {modalOpen && (
              <BookServicesModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} dict={dict} />
            )}
            {user?.user?.email ? (
              <>
                <div className="relative group flex items-center justify-center">
                  <Image src={"/images/avatar/avatar_1.jpg"} alt="avatar" width={42} height={42} className="rounded-full cursor-pointer" onClick={toggleTooltip} />
                  <Link href={`/${locale}/profile`}>
                    <p onClick={() => { setShowTooltip(false) }} className={`absolute w-fit text-sm font-medium text-center z-10 transition-opacity duration-200 bg-primary dark:bg-middlegreen text-creamwhite hover:text-secondary py-2 px-4 min-w-28 rounded-md shadow-2xl top-full left-1/2 transform -translate-x-1/2 mt-3 ${showTooltip ? "visible opacity-100" : "invisible opacity-0"}`}>
                      {header.viewProfile}
                    </p>
                  </Link>
                </div>
              </>
            ) : (
              <Link href={"https://app.fascinantedigital.com/"} className="bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary flex items-center py-2.5 xl:py-3 px-3 xl:px-4 rounded-sm transition-all duration-300">
                <span className="text-sm text-white font-bold">{header.signInUp}</span>
              </Link>
            )}

          </div>

          {/* ------------------------- Mobile sidebar button starts ------------------------- */}
          <div className="flex lg:hidden gap-5">
            <MobileThemeToggler />
            {user?.user?.email &&
              <div className="relative group flex items-center justify-center">
                <Image src={"/images/avatar/avatar_1.jpg"} alt="avatar" width={35} height={35} className="rounded-full cursor-pointer" onClick={toggleTooltip} />
                <Link href={`/${locale}/profile`}>
                  <p onClick={() => { setShowTooltip(false) }} className={`absolute w-fit text-sm font-medium text-center z-10 transition-opacity duration-200 bg-primary dark:bg-middlegreen text-creamwhite hover:text-secondary py-2 px-4 min-w-28 rounded-md shadow-2xl top-full left-1/2 transform -translate-x-1/2 mt-3 ${showTooltip ? "visible opacity-100" : "invisible opacity-0"}`}>
                    {header.viewProfile}
                  </p>
                </Link>
              </div>
            }
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex lg:hidden items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
              aria-label={sidebarOpen ? header.closeMenu : header.openMenu}
            >
              {sidebarOpen ? (
                <X size={24} className="text-secondary dark:text-white transition-transform duration-200" />
              ) : (
                <Menu size={24} className="text-secondary dark:text-white transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* ------------------------- Mobile sidebar starts ------------------------- */}
          {typeof document !== "undefined" && sidebarOpen && createPortal(
            <>
              <div
                className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 cursor-pointer"
                onClick={() => setSidebarOpen(false)}
                aria-label={header.closeMenuOverlay}
              />
              <div
                className={`fixed top-0 right-0 h-full w-full bg-white dark:bg-secondary shadow-lg transform transition-transform duration-500 max-w-xs ${sidebarOpen ? "translate-x-0" : "translate-x-full"} z-50`}
                role="dialog"
                aria-modal="true"
              >
                <div className='flex items-center justify-between p-4'>
                  <h2 className="text-lg font-bold dark:text-white">{header.menu}</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
                    aria-label={header.closeMenu}
                  >
                    <X size={20} className="text-secondary dark:text-white" />
                  </button>
                </div>

                <div className='p-6'>
                  <ul className="flex flex-col">
                    {menuData.map((value, index) => {
                      return (
                        <Link key={index} href={value.path} onClick={() => setSidebarOpen(false)}>
                          <li className="py-1.5">
                            <p className="font-semibold dark:text-white">{value.title}</p>
                          </li>
                        </Link>
                      )
                    })}
                  </ul>
                  <Link href={"https://app.fascinantedigital.com/"} className="bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary mt-4 flex items-center py-2.5 xl:py-3 px-3 xl:px-4 rounded-sm transition-all duration-300">
                    <span className="text-sm text-white font-bold">{header.signInUp}</span>
                  </Link>
                  <div className="flex flex-col mt-5">
                    <Link href="mailto:info@fascinantedigital.com" className="flex gap-2 items-center py-1.5">
                      <Image src={"/images/topheader/mail-icon.svg"} alt="mail-icon" width={24} height={24} className="dark:hidden" />
                      <Image src={"/images/topheader/white-mail-icon.svg"} alt="mail-icon" width={24} height={24} className="hidden dark:block" />
                      <span className="text-secondary dark:text-white text-base font-semibold">info@fascinantedigital.com</span>
                    </Link>
                    <Link href="https://maps.app.goo.gl/C5PX3Cvfy1nvT8zq9" className="flex gap-2 items-center py-1.5">
                      <Image src={"/images/topheader/map-icon.svg"} alt="map-icon" width={24} height={24} className="dark:hidden" />
                      <Image src={"/images/topheader/white-map-icon.svg"} alt="map-icon" width={24} height={24} className="hidden dark:block" />
                      <span className="text-secondary dark:text-white text-base font-semibold">Blane Street, Manchester</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-10 mt-5">
                    <Link href="https://x.com/wrappixel">
                      <Image src={"/images/topheader/twitter-icon.svg"} alt="twitter-icon" width={25} height={25} className="dark:hidden" />
                      <Image src={"/images/topheader/white-twitter-icon.svg"} alt="twitter-icon" width={25} height={25} className="hidden dark:block" />
                    </Link>
                    <Link href="https://www.facebook.com/wrappixel/">
                      <Image src={"/images/topheader/facebook-icon.svg"} alt="facebook-icon" width={16} height={16} className="dark:hidden" />
                      <Image src={"/images/topheader/white-facebook-icon.svg"} alt="facebook-icon" width={13} height={13} className="hidden dark:block" />
                    </Link>
                    <Link href="https://www.instagram.com/wrappixel/">
                      <Image src={"/images/topheader/instagram-icon.svg"} alt="instagram-icon" width={25} height={25} className="dark:hidden" />
                      <Image src={"/images/topheader/white-insta-icon.svg"} alt="instagram-icon" width={25} height={25} className="hidden dark:block" />
                    </Link>
                  </div>
                </div>
              </div>
            </>, document.body)
          }
        </div>
      </div>
    </div>
  );
}

export default DesktopHeader;
