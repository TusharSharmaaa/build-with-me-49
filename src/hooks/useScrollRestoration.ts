import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions: Record<string, number> = {};

export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // Restore scroll position for this route
    const savedPosition = scrollPositions[location.pathname];
    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    } else {
      window.scrollTo(0, 0);
    }

    // Save scroll position before navigating away
    const saveScrollPosition = () => {
      scrollPositions[location.pathname] = window.scrollY;
    };

    window.addEventListener("beforeunload", saveScrollPosition);
    return () => {
      saveScrollPosition();
      window.removeEventListener("beforeunload", saveScrollPosition);
    };
  }, [location.pathname]);
}
