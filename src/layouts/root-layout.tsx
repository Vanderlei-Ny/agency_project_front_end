import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSidebar } from "../features/sidebar/sidebar-context";
import { Sidebar } from "../components/sidebar";
import { isAuthenticated } from "../features/auth/auth-storage";
import { AUTH_UNAUTHORIZED_EVENT } from "../features/auth/auth-events";

export function RootLayout() {
  const { isMobileOpen, onOpenMobile, onCloseMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  // Fechar sidebar ao navegar
  useEffect(() => {
    onCloseMobile();
  }, [location.pathname, onCloseMobile]);

  // Ouvir evento de unauthorized
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-slate-100">
      {authenticated && (
        <Sidebar
          isMobileOpen={isMobileOpen}
          onOpenMobile={onOpenMobile}
          onCloseMobile={onCloseMobile}
        />
      )}
      <main
        className={
          authenticated
            ? "min-h-dvh px-3 py-4 sm:pl-24 sm:pr-6 sm:py-6 lg:pl-28 lg:pr-8 lg:py-8"
            : "min-h-dvh"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
