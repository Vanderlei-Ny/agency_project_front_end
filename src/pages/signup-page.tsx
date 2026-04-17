import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { saveAuthToken, saveUserType } from "../features/auth/auth-storage";
import { registerUser } from "../http/services/users-service";

export function SignupPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [userType, setUserType] = useState<"agency" | "client" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userType) {
      addToast("Selecione se você é uma agência ou cliente", "error");
      return;
    }

    if (!name || !email || !password) {
      addToast("Preencha todos os campos", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await registerUser({ name, email, password });

      // Salvar o token e tipo de usuário automaticamente após registrar
      saveAuthToken(response.token);
      saveUserType(userType);

      addToast("Cadastro realizado com sucesso!", "success");

      // Navegar para próxima tela baseado no tipo de usuário
      if (userType === "agency") {
        navigate("/create-agency");
      } else {
        navigate("/agencies-list");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao realizar cadastro";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <section className="w-full max-w-full overflow-hidden rounded-2xl p-2 sm:max-w-6xl sm:p-4 lg:p-6">
        <div className="overflow-hidden rounded-4xl border border-slate-200 inset-0 bg-linear-to-b from-white via-white to-slate-90">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-w-0 flex flex-col rounded-4xl bg-slate-100 px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:order-2 lg:px-12">
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                Cadastre-se agora
              </p>

              <div className="mt-8 sm:mt-10 lg:mt-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem]">
                  Bem-vindo!
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                  Crie sua conta e comece a gerenciar suas operações.
                </p>
              </div>

              <form
                className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
                aria-label="Formulário de cadastro"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

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
                    placeholder="seu@email.com"
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Tipo de Usuário
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType("agency")}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                        userType === "agency"
                          ? "border-2 border-black bg-black text-white"
                          : "border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      Sou uma Agência
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("client")}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                        userType === "client"
                          ? "border-2 border-black bg-black text-white"
                          : "border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      Sou um Cliente
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 h-12 w-full rounded-xl bg-black text-base font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </button>

                <p className="text-center text-sm text-slate-600">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-bold text-black hover:underline"
                  >
                    Faça login
                  </button>
                </p>
              </form>
            </div>

            <aside className="relative hidden min-h-full min-w-0 overflow-hidden lg:order-1 lg:block lg:min-h-168">
              <img
                src="../public/icon.png"
                alt="Ícone do sistema"
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
