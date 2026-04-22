import { Link } from "react-router-dom";

export function SignupHubPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Criar conta
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Escolha o tipo de conta. O cadastro é rápido e você já entra no painel
          certo.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/signup/client"
            className="rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-900 transition hover:border-slate-900 hover:bg-white"
          >
            Sou cliente — quero solicitar serviços a uma agência
          </Link>
          <Link
            to="/signup/agency"
            className="rounded-2xl border-2 border-slate-900 bg-slate-950 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-slate-900"
          >
            Sou agência — vou cadastrar minha empresa
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Já tem conta?{" "}
          <Link to="/login" className="font-bold text-slate-900 underline">
            Entrar
          </Link>
          {" · "}
          <Link to="/" className="font-semibold text-slate-700 underline">
            Página inicial
          </Link>
        </p>
      </section>
    </main>
  );
}
