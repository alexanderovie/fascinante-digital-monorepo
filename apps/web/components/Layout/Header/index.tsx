import { Suspense } from "react";
import DesktopHeader from "./DesktopHeader";
import TopHeader from "./TopHeader";

const Header = () => {

  return (
    <header className="fixed top-0 z-50 w-full">
      <div>
        <TopHeader />
      </div>

      <Suspense fallback={null}>
        <DesktopHeader />
      </Suspense>
    </header>
  );
}

export default Header;
