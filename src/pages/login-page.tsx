import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { saveAuthToken, saveUserType } from "../features/auth/auth-storage";
import { login } from "../http/services/auth-service";

export function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      addToast("Preencha todos os campos", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await login({ email, password });

      saveAuthToken(response.token);

      // Determinar tipo de usuário baseado no role
      const userType = response.user.role === "CLIENT" ? "client" : "agency";
      saveUserType(userType);

      addToast("Login realizado com sucesso!", "success");

      // Redirecionar baseado no tipo de usuário
      if (userType === "client") {
        navigate("/agencies-list");
      } else {
        navigate("/app/home");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível autenticar. Verifique e-mail e senha.";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <section className="w-full max-w-full overflow-hidden rounded-2xl  p-2 sm:max-w-6xl sm:p-4 lg:p-6">
        <div className="overflow-hidden rounded-4xl border border-slate-200  inset-0 bg-linear-to-b from-white via-white to-slate-90">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-w-0 flex flex-col rounded-4xl bg-slate-100 px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:order-2 lg:px-12">
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                Acesse já
              </p>

              <div className="mt-8 sm:mt-10 lg:mt-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem]">
                  Bem-vindo de volta
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                  Abra solicitações de marketing para sua empresa.
                </p>
              </div>

              <form
                className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
                aria-label="Formulário de login"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="exemplo@aether.agency"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-extrabold uppercase tracking-widest text-slate-400"
                    >
                      Senha
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 pr-11 text-sm tracking-[0.2em] text-slate-700 outline-none"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 inline-flex items-center text-slate-400">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 12C3.8 8.7 7.5 6 12 6C16.5 6 20.2 8.7 22 12C20.2 15.3 16.5 18 12 18C7.5 18 3.8 15.3 2 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 h-12 w-full rounded-xl bg-black text-base font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </button>

                <p className="text-center text-sm text-slate-600">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-bold text-black hover:underline"
                  >
                    Cadastre-se
                  </button>
                </p>
              </form>
            </div>

            <aside className="relative hidden min-h-full min-w-0 overflow-hidden lg:order-1 lg:block lg:min-h-168">
              <img
                src="../public/icon.png"
                alt="Vista interna de um carro com cidade ao fundo"
                className="h-full w-full object-cover"
              />
              <p>icon here</p>
              <div className="absolute" />
            </aside>
          </div>
        </div>

        <footer className="px-2 pb-1 pt-7 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:pt-9 sm:text-xs">
          © 2026 • Omnify - A project fullstack agency management system by
          group 2
        </footer>
      </section>
    </main>
  );
}
