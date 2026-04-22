import { Link } from "react-router-dom";
import { Building2, FileText, ListPlus } from "lucide-react";
import { getSessionUser } from "../features/auth/auth-storage";

export function ClientHomePage() {
  const user = getSessionUser();
  const firstName = user?.name?.trim().split(/\s+/)[0];

  const cards = [
    {
      title: "Escolher agência",
      description: "Veja agências disponíveis e inicie um briefing.",
      to: "/app/agencias",
      icon: Building2,
    },
    {
      title: "Minhas solicitações",
      description: "Acompanhe orçamentos, aprovações e entregas.",
      to: "/app/solicitacoes",
      icon: FileText,
    },
    {
      title: "Nova solicitação",
      description: "Escolha a agência e abra um novo pedido.",
      to: "/agencies-list",
      icon: ListPlus,
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            {firstName ? `Olá, ${firstName}` : "Bem-vindo"}
          </h1>
          <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
            Atalhos para o que você mais usa no painel do cliente.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-4 text-lg font-bold text-slate-900">
                  {title}
                </span>
                <span className="mt-2 text-sm text-slate-600">{description}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link
            to="/"
            className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
          >
            Ver página institucional
          </Link>
        </p>
      </div>
    </main>
  );
}
