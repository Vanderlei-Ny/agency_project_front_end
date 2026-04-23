import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { getSessionUser } from "../features/auth/auth-storage";
import {
  listAgencyForms,
  type FormData,
  type FormStatus,
} from "../http/services/forms-service";
import {
  Inbox,
  Clock,
  Activity,
  CheckCircle2,
  ArrowRight,
  Settings,
  BarChart3,
} from "lucide-react";

const STATUS_LABEL: Record<FormStatus, string> = {
  PENDING_BUDGET: "Aguardando orçamento",
  BUDGET_SENT: "Orçamento enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  IN_PROGRESS: "Em progresso",
  DELIVERED: "Entregue",
};

const STATUS_COLORS: Record<FormStatus, string> = {
  PENDING_BUDGET: "bg-slate-200 text-slate-700",
  BUDGET_SENT: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-slate-800 text-slate-100",
};

function countByStatus(forms: FormData[]) {
  const map = new Map<FormStatus, number>();
  for (const f of forms) {
    map.set(f.status, (map.get(f.status) ?? 0) + 1);
  }
  return map;
}

export function AgencyDashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getSessionUser();
  const firstName = user?.name ? user.name.split(" ")[0] : "Equipe";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await listAgencyForms();
        if (!cancelled) setForms(data);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Erro ao carregar solicitações";
        addToast(message, "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const counts = useMemo(() => countByStatus(forms), [forms]);
  const awaitingAction =
    (counts.get("PENDING_BUDGET") ?? 0) + (counts.get("BUDGET_SENT") ?? 0);
  const activePipeline =
    (counts.get("APPROVED") ?? 0) +
    (counts.get("IN_PROGRESS") ?? 0) +
    (counts.get("DELIVERED") ?? 0);

  const kpiCards = [
    {
      title: "Total no funil",
      value: forms.length,
      hint: "Todas as solicitações recebidas",
      tone: "bg-white border-slate-200",
      iconBg: "bg-slate-100 text-slate-600",
      icon: <Inbox className="h-5 w-5" />,
    },
    {
      title: "Precisam de ação",
      value: awaitingAction,
      hint: "Sem orçamento ou aguardando resposta",
      tone: "bg-white border-amber-200 ring-1 ring-amber-50",
      iconBg: "bg-amber-100 text-amber-600",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Em andamento",
      value: (counts.get("APPROVED") ?? 0) + (counts.get("IN_PROGRESS") ?? 0),
      hint: "Aprovadas ou em produção",
      tone: "bg-white border-violet-200 ring-1 ring-violet-50",
      iconBg: "bg-violet-100 text-violet-600",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "Entregues",
      value: counts.get("DELIVERED") ?? 0,
      hint: "Concluídas com o cliente",
      tone: "bg-slate-900 border-slate-800 text-white",
      iconBg: "bg-slate-800 text-emerald-400",
      icon: <CheckCircle2 className="h-5 w-5" />,
      textHint: "text-slate-400",
      textValue: "text-white",
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-[#F8FAFC] px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <header className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Olá, <span className="text-blue-600">{firstName}</span> 👋
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500">
              Aqui está o resumo das operações da sua agência hoje.
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            {/* <button
              type="button"
              onClick={() => navigate("/app/configuracoes")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </button> */}
            <button
              type="button"
              onClick={() => navigate("/app/solicitacoes")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 sm:flex-none"
            >
              Ver solicitações
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-400">
              Carregando seus dados...
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {kpiCards.map((card) => (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${card.tone}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold tracking-wide ${card.textHint || "text-slate-500"}`}
                    >
                      {card.title}
                    </p>
                    <p
                      className={`mt-1 font-mono text-4xl font-extrabold tracking-tight ${card.textValue || "text-slate-900"}`}
                    >
                      {card.value}
                    </p>
                    <p
                      className={`mt-3 text-xs font-medium ${card.textHint || "text-slate-500"}`}
                    >
                      {card.hint}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Bottom Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Chart/List Area */}
              <section className="col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Progresso do Funil
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      {activePipeline} solicitações ativas no momento
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(Object.keys(STATUS_LABEL) as FormStatus[]).map((status) => {
                    const n = counts.get(status) ?? 0;
                    if (n === 0) return null;
                    
                    // Calculando a porcentagem para a barra visual
                    const percentage = Math.round((n / forms.length) * 100);

                    return (
                      <div key={status} className="flex items-center gap-4">
                        <div className="w-40 flex-shrink-0">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </div>
                        <div className="relative flex h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-slate-800 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-right font-mono text-sm font-bold text-slate-700">
                          {n}
                        </div>
                      </div>
                    );
                  })}

                  {forms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="mb-4 rounded-full bg-slate-50 p-4 text-slate-400">
                        <Inbox className="h-8 w-8" />
                      </div>
                      <p className="font-semibold text-slate-700">
                        O funil está vazio
                      </p>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Quando os clientes enviarem novos briefings, os dados de progresso aparecerão aqui.
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>

              {/* Side Info / Quick Actions */}
              <section className="col-span-1 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-md">
                <div>
                  <h3 className="text-xl font-bold leading-snug">
                    Mantenha a operação ágil
                  </h3>
                  <p className="mt-3 text-sm font-medium text-blue-100 opacity-90 leading-relaxed">
                    Você tem <strong>{awaitingAction}</strong> solicitações que precisam da sua atenção imediata para avançar no funil.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/app/solicitacoes")}
                  className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  Resolver pendências
                </button>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}