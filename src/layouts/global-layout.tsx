import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_UNAUTHORIZED_EVENT } from "../features/auth/auth-events";
import { Sidebar } from "../components/sidebar";
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
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onOpenMobile={() => setIsMobileSidebarOpen(true)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <main className="min-h-dvh px-3 py-4 sm:pl-24 sm:pr-6 sm:py-6 lg:pl-28 lg:pr-8 lg:py-8">
        <AppRouter />
      </main>
    </div>
  );
}
