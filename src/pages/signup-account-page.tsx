import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { getApiErrorMessage } from "../features/auth/http-error";
import { saveAuthSession } from "../features/auth/auth-storage";
import { registerAndLoadSession } from "../http/services/auth-service";

type SignupIntentProp = "client" | "agency";

const copy: Record<
  SignupIntentProp,
  { title: string; subtitle: string; success: string }
> = {
  client: {
    title: "Conta de cliente",
    subtitle: "Você poderá escolher uma agência e abrir solicitações.",
    success: "Conta criada! Redirecionando…",
  },
  agency: {
    title: "Conta para sua agência",
    subtitle:
      "Na próxima etapa você informa o nome da empresa. Seu usuário será o administrador.",
    success: "Conta criada! Agora cadastre os dados da agência.",
  },
};

export function SignupAccountPage({ intent }: { intent: SignupIntentProp }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const c = copy[intent];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const pwd = password;

    if (!trimmedName || !trimmedEmail || !pwd) {
      addToast("Preencha todos os campos", "error");
      return;
    }

    if (pwd.length < 6) {
      addToast("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    try {
      setIsLoading(true);
      const { token, user } = await registerAndLoadSession({
        name: trimmedName,
        email: trimmedEmail,
        password: pwd,
      });

      saveAuthSession({
        token,
        user,
        clientSignupIntent:
          intent === "agency" && user.role === "CLIENT"
            ? "agency_onboarding"
            : null,
      });

      addToast(c.success, "success");

      if (intent === "agency") {
        navigate("/create-agency", { replace: true });
      } else {
        navigate("/agencies-list", { replace: true });
      }
    } catch (error: unknown) {
      addToast(
        getApiErrorMessage(error, "Não foi possível concluir o cadastro."),
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Cadastro
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          {c.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{c.subtitle}</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
          aria-label="Formulário de cadastro"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
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
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-900 disabled:opacity-50"
          >
            {isLoading ? "Cadastrando…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link to="/signup" className="font-semibold text-slate-900 underline">
            Outro tipo de conta
          </Link>
          {" · "}
          <Link to="/login" className="font-semibold text-slate-900 underline">
            Já tenho login
          </Link>
        </p>
      </section>
    </main>
  );
}
