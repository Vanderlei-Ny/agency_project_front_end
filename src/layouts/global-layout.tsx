import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_UNAUTHORIZED_EVENT } from "../features/auth/auth-events";
import { SidebarNew } from "../components/sidebar-new";
import { isAuthenticated } from "../features/auth/auth-storage";
import { AppRouter } from "../router/router";

export function GlobalLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate]);

  // Se não autenticado, não mostra sidebar
  if (!authenticated) {
    return <AppRouter />;
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <SidebarNew
        isMobileOpen={isMobileSidebarOpen}
        onOpenMobile={() => setIsMobileSidebarOpen(true)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <main className="min-h-dvh px-3 py-4 sm:pl-72 sm:pr-6 sm:py-6 lg:pl-80 lg:pr-8 lg:py-8">
        <AppRouter />
      </main>
    </div>
  );
}
