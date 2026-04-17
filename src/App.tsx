
import { AppRouter } from "./router/router";
import { ToastProvider } from "./features/toast/toast-context";
import { ToastContainer } from "./features/toast/toast-container";
import { SidebarProvider } from "./features/sidebar/sidebar-context";

function App() {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppRouter />
        <ToastContainer />
      </SidebarProvider>
    </ToastProvider>
  );
}
