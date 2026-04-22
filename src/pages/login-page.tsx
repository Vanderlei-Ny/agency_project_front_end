import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { getApiErrorMessage } from "../features/auth/http-error";
import { saveAuthSession } from "../features/auth/auth-storage";
import { getNavigatePathAfterAuth } from "../features/auth/navigation-after-auth";
import { loginAndLoadSession } from "../http/services/auth-service";

export function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const pwd = password;

    if (!trimmedEmail || !pwd) {
      addToast("Preencha e-mail e senha", "error");
      return;
    }

    try {
      setIsLoading(true);
      const { token, user } = await loginAndLoadSession({
        email: trimmedEmail,
        password: pwd,
      });

      saveAuthSession({
        token,
        user,
        clientSignupIntent: null,
      });

      addToast("Login realizado com sucesso.", "success");
      navigate(getNavigatePathAfterAuth(), { replace: true });
    } catch (error: unknown) {
      addToast(
        getApiErrorMessage(error, "Não foi possível entrar. Tente novamente."),
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <section className="w-full max-w-full overflow-hidden rounded-2xl p-2 sm:max-w-6xl sm:p-4 lg:p-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Painel visual (esquerda no desktop) */}
            <aside className="relative order-1 hidden min-h-[min(100%,28rem)] overflow-hidden bg-black lg:flex lg:min-h-[36rem] lg:flex-col">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-8 py-10 lg:py-12">
                <img
                  src="/icon.png"
                  alt="Omnify Marketing"
                  className="h-auto w-full max-w-[min(100%,320px)] object-contain"
                  width={320}
                  height={120}
                  decoding="async"
                />
              </div>
              <div className="relative z-[1] mt-auto p-10 pt-0 text-white">
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl">
                  Gestão de agências e solicitações em um só lugar.
                </h2>
                <p className="mt-4 max-w-md text-base font-medium text-white/80">
                  Acompanhe orçamentos, aprovações e entregas com fluxo claro
                  para clientes e equipes.
                </p>
              </div>
            </aside>

            {/* Formulário (direita no desktop) */}
            <div className="order-2 flex min-w-0 flex-col bg-slate-100 px-5 py-8 sm:px-8 sm:py-10 md:px-10 lg:px-12">
              <div className="mb-6 flex justify-center rounded-2xl bg-black px-6 py-5 lg:hidden">
                <img
                  src="/icon.png"
                  alt="Omnify Marketing"
                  className="h-auto w-full max-w-[220px] object-contain"
                  width={220}
                  height={84}
                  decoding="async"
                />
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                Bem-vindo de volta
              </p>

              <div className="mt-8 sm:mt-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1]">
                  Entrar na sua conta
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                  Use o mesmo e-mail e senha do cadastro.
                </p>
              </div>

              <form
                className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
                onSubmit={handleSubmit}
                aria-label="Formulário de login"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 h-12 w-full rounded-xl bg-black text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isLoading ? "Entrando…" : "Entrar"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm font-medium text-slate-600 sm:mt-10">
                Não tem conta?{" "}
                <Link
                  to="/signup"
                  className="font-extrabold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
                >
                  Cadastre-se
                </Link>
              </p>
              <p className="mt-4 text-center text-sm text-slate-500">
                <Link
                  to="/"
                  className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
                >
                  Página inicial
                </Link>
              </p>
            </div>
          </div>
        </div>

        <footer className="px-2 pb-1 pt-7 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:pt-9 sm:text-xs">
          © 2026 • Omnify — A project fullstack agency management system by group
          2
        </footer>
      </section>
    </main>
  );
}
