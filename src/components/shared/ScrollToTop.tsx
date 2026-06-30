import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - scrolls the window to the top on every route change.
 * Place this inside <BrowserRouter> so it picks up location changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
