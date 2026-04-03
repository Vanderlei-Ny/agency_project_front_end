import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-100">
      <Sidebar />
      <main className="min-h-dvh pl-20 pr-3 py-4 sm:pl-24 sm:pr-6 sm:py-6 lg:pl-28 lg:pr-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
