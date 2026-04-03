import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { appRouteItems, type SidebarIconKey } from "../router/app-routes";

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
        <rect
          x="4"
          y="4"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="13"
          y="4"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="4"
          y="13"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="13"
          y="13"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
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
        <path
          d="M5 19V11"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M12 19V7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M19 19V13"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
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
        <circle
          cx="17.3"
          cy="9.7"
          r="2.3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M16 12H18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return map[kind];
}

function SideActionButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
    >
      {children}
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-3 top-1/2 z-30 -translate-y-1/2 sm:left-4">
      <div className="rounded-[1.8rem] bg-white p-1.5 shadow-xl ring-1 ring-slate-200/70">
        <div className="flex h-[86dvh] max-h-215 w-[3.35rem] flex-col items-center rounded-3xl bg-slate-950 py-3 text-slate-500">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 shadow"
            aria-label="Área principal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M7 12.5L11 16.5L17 8.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <nav
            className="mt-4 flex flex-1 flex-col items-center gap-2"
            aria-label="Navegação principal"
          >
            {appRouteItems.map((route) => (
              <NavLink
                key={route.path}
                to={`/app/${route.path}`}
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
            <SideActionButton>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </SideActionButton>
            <SideActionButton>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M14 7L9 12L14 17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SideActionButton>
          </div>
        </div>
      </div>
    </aside>
  );
}
