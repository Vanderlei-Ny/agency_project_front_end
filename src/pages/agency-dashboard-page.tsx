import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  listAgencyForms,
  type FormData,
  type FormStatus,
} from "../http/services/forms-service";

const STATUS_LABEL: Record<FormStatus, string> = {
  PENDING_BUDGET: "Aguardando orçamento",
  BUDGET_SENT: "Orçamento enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  IN_PROGRESS: "Em progresso",
  DELIVERED: "Entregue",
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
    },
    {
      title: "Precisam de ação",
      value: awaitingAction,
      hint: "Sem orçamento ou aguardando resposta do cliente",
      tone: "bg-amber-50 border-amber-200",
    },
    {
      title: "Em andamento",
      value: (counts.get("APPROVED") ?? 0) + (counts.get("IN_PROGRESS") ?? 0),
      hint: "Aprovadas ou em produção",
      tone: "bg-violet-50 border-violet-200",
    },
    {
      title: "Entregues",
      value: counts.get("DELIVERED") ?? 0,
      hint: "Concluídas com o cliente",
      tone: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Painel da agência
          </h1>
          <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
            Resumo das solicitações recebidas dos clientes
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
          </div>
        ) : (
          <>
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border p-5 shadow-sm ${card.tone}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-2 font-mono text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/app/solicitacoes")}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver todas as solicitações
              </button>
              <button
                type="button"
                onClick={() => navigate("/app/configuracoes")}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Configurações da agência
              </button>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">
                Distribuição por status
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {activePipeline} solicitações em pipeline após aprovação inicial
                (inclui entregues).
              </p>
              <ul className="mt-4 divide-y divide-slate-100">
                {(Object.keys(STATUS_LABEL) as FormStatus[]).map((status) => {
                  const n = counts.get(status) ?? 0;
                  if (n === 0) return null;
                  return (
                    <li
                      key={status}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="font-medium text-slate-700">
                        {STATUS_LABEL[status]}
                      </span>
                      <span className="font-mono font-semibold text-slate-900">
                        {n}
                      </span>
                    </li>
                  );
                })}
                {forms.length === 0 ? (
                  <li className="py-6 text-center text-slate-500">
                    Nenhuma solicitação ainda. Quando clientes enviarem
                    briefings, os números aparecem aqui.
                  </li>
                ) : null}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
