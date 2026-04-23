import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  type SidebarIconKey,
  type SidebarSection,
  getRoutesBySection,
  getRoutesForPersona,
} from "../router/app-routes";
import { clearAuthToken, getAppPersona, getSessionUser } from "../features/auth/auth-storage";
import { useToast } from "../features/toast/toast-context";
import { ChevronLeft, Menu, PyramidIcon, LogOut } from "lucide-react";

const SIDEBAR_SECTIONS: Record<SidebarSection, string> = {
  principal: "Principal",
  operacional: "Operacional",
  administrativo: "Administrativo",
};

function IconDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />;
}

function SidebarIcon({ kind }: { kind: SidebarIconKey }) {
  const cls = "h-4 w-4";

  const map: Record<SidebarIconKey, ReactNode> = {
    compass: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9 15L11 11L15 9L13 13L9 15Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
    grid: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path
          d="M12 4L13.8 8.2L18 10L13.8 11.8L12 16L10.2 11.8L6 10L10.2 8.2L12 4Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
    chat: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path
          d="M6 18L4.5 20L4.7 17.2C3.6 16 3 14.5 3 13C3 8.6 7 5 12 5C17 5 21 8.6 21 13C21 17.4 17 21 12 21C10.8 21 9.6 20.8 8.6 20.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <path d="M5 19V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 19V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M19 19V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M4 18C4.7 15.8 6.7 14.5 9 14.5C11.3 14.5 13.3 15.8 14 18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="17.3" cy="9.7" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16 12H18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  };

  return map[kind];
}

type SidebarProps = {
  isMobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
};

export function SidebarNew({
  isMobileOpen,
  onOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const user = getSessionUser();
  const persona = getAppPersona();
  const routes = persona ? getRoutesForPersona(persona) : [];

  const sections: SidebarSection[] = [
    "principal",
    "operacional",
    "administrativo",
  ];
  const availableSections = sections.filter(
    (section) => getRoutesBySection(routes, section).length > 0,
  );

  function handleLogout() {
    clearAuthToken();
    addToast("Você foi desconectado", "info");
    navigate("/login");
  }

  const MobileMenu = (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 w-20 p-2 transition-transform duration-200 ease-out sm:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-[110%]",
      ].join(" ")}
      aria-hidden={!isMobileOpen}
    >
      <div className="h-full rounded-[1.8rem] bg-white p-1.5 shadow-xl ring-1 ring-slate-200/70">
        <div className="flex h-full w-full flex-col items-center rounded-3xl bg-slate-950 py-3 text-slate-500">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 shadow">
            <PyramidIcon />
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="mt-3 grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
            aria-label="Encolher menu lateral"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <nav
            className="mt-3 flex flex-1 flex-col items-center gap-2 overflow-y-auto"
            aria-label="Navegação principal"
          >
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={`/app/${route.path}`}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  [
                    "group relative grid h-9 w-9 place-items-center rounded-full transition",
                    isActive
                      ? "bg-slate-100 text-slate-700 shadow"
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
                  ].join(" ")
                }
                aria-label={route.label}
                title={route.label}
              >
                <SidebarIcon kind={route.icon} />
              </NavLink>
            ))}
          </nav>

          <div className="mb-1 mt-auto flex flex-col items-center gap-2">
            <IconDot />
            <button
              type="button"
              onClick={handleLogout}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-red-800/20 hover:text-red-400"
              aria-label="Fazer logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  const DesktopMenu = (
    <aside className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 sm:left-4 sm:block">
      <div className="rounded-[1.8rem] bg-white p-1.5 shadow-xl ring-1 ring-slate-200/70">
        <div className="flex max-h-[86dvh] w-64 flex-col overflow-hidden rounded-3xl bg-slate-950 text-slate-500">
          <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-4">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 shadow">
              <PyramidIcon />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {user?.role === "AGENCY_MEMBER" ? "Funcionário" : user?.role === "CLIENT" ? "Cliente" : "Gerente"}
              </p>
              <p className="truncate text-sm font-semibold text-slate-100">
                {user?.name ?? "Conta"}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {availableSections.map((section) => {
              const sectionRoutes = getRoutesBySection(routes, section);

              return (
                <div key={section} className="mb-6 last:mb-0">
                  <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    {SIDEBAR_SECTIONS[section]}
                  </p>

                  <div className="space-y-1">
                    {sectionRoutes.map((route) => (
                      <NavLink
                        key={route.path}
                        to={`/app/${route.path}`}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                            isActive
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                          ].join(" ")
                        }
                        title={route.label}
                      >
                        <SidebarIcon kind={route.icon} />
                        <span className="text-sm font-medium">
                          {route.label}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 px-2 py-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition hover:bg-red-800/20 hover:text-red-400"
              aria-label="Fazer logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        onClick={onOpenMobile}
        className="fixed left-3 top-3 z-40 grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-slate-100 shadow-lg ring-1 ring-slate-800/70 transition hover:bg-slate-900 sm:hidden"
        aria-label="Abrir menu lateral"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        className={[
          "fixed inset-0 z-50 bg-slate-950/45 transition-opacity duration-200 sm:hidden",
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onCloseMobile}
        aria-hidden={!isMobileOpen}
      />

      {MobileMenu}
      {DesktopMenu}
    </>
  );
}