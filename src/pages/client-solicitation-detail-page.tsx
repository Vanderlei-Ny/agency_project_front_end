import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  downloadFormDeliveryFile,
  getClientForm,
  type FormData,
  type FormStatus,
} from "../http/services/forms-service";
import { formatBudgetStoredForDisplay } from "../lib/brl-budget";

const POLL_MS = 5000;

const STEP_LABELS = [
  "Solicitação enviada",
  "Agência respondeu",
  "Orçamento aprovado",
  "Em execução",
  "Entregue",
] as const;

const STATUS_SHORT: Partial<Record<FormStatus, string>> = {
  BUDGET_SENT: "Orçamento disponível",
  APPROVED: "Aprovado",
  IN_PROGRESS: "Em execução",
  DELIVERED: "Entregue",
};

function progressPercent(status: FormStatus): number {
  const map: Record<FormStatus, number> = {
    PENDING_BUDGET: 22,
    BUDGET_SENT: 45,
    APPROVED: 62,
    IN_PROGRESS: 80,
    REJECTED: 0,
    DELIVERED: 100,
  };
  return map[status];
}

/** Índice do passo “atual” (0–4). REJECTED retorna -1. */
function activeStepIndex(status: FormStatus): number {
  switch (status) {
    case "PENDING_BUDGET":
      return 0;
    case "BUDGET_SENT":
      return 1;
    case "APPROVED":
      return 2;
    case "IN_PROGRESS":
      return 3;
    case "DELIVERED":
      return 4;
    case "REJECTED":
      return -1;
    default:
      return 0;
  }
}

export function ClientSolicitationDetailPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(
    async (options?: { quiet?: boolean }) => {
      if (!formId) return;
      const quiet = options?.quiet ?? false;
      try {
        const data = await getClientForm(formId);
        setForm(data);
      } catch (error: unknown) {
        if (!quiet) {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao carregar solicitação";
          addToast(message, "error");
          navigate("/app/solicitacoes");
        }
      } finally {
        if (!quiet) setIsLoading(false);
      }
    },
    [formId, navigate, addToast],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!formId) return;
      void load({ quiet: true });
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [formId, load]);

  if (isLoading && !form) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="text-lg text-slate-600">Carregando...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!form) {
    return null;
  }

  const pct = progressPercent(form.status);
  const stepIdx = activeStepIndex(form.status);
  const isWaitingAgency = form.status === "PENDING_BUDGET";
  const isRejected = form.status === "REJECTED";

  async function handleDownloadDelivery() {
    if (!formId) return;
    try {
      const { blob, filename } = await downloadFormDeliveryFile(formId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o arquivo.";
      addToast(message, "error");
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/app/solicitacoes")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          ← Voltar às solicitações
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {form.agency?.name ?? "Agência"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Acompanhamento em tempo real (atualiza a cada poucos segundos)
              </p>
            </div>
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                isRejected
                  ? "bg-red-100 text-red-800"
                  : form.status === "PENDING_BUDGET"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-slate-100 text-slate-800"
              }`}
            >
              {isRejected
                ? "Encerrada"
                : isWaitingAgency
                  ? "Aguardando a agência"
                  : (STATUS_SHORT[form.status] ?? form.status)}
            </span>
          </div>

          {!isRejected ? (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Andamento</span>
                <span className="tabular-nums text-slate-500">{pct}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isWaitingAgency
                      ? "animate-pulse bg-amber-500"
                      : "bg-slate-800"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <ol className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-2">
                {STEP_LABELS.map((label, i) => {
                  const done = stepIdx > i;
                  const active = stepIdx === i;
                  return (
                    <li
                      key={label}
                      className="flex flex-1 items-center gap-2 sm:flex-col sm:items-center sm:text-center"
                    >
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          done
                            ? "bg-slate-900 text-white"
                            : active
                              ? isWaitingAgency
                                ? "bg-amber-500 text-white ring-4 ring-amber-200"
                                : "bg-slate-700 text-white ring-4 ring-slate-200"
                              : "border-2 border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span
                        className={`text-xs font-medium sm:mt-1 ${
                          active ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {isWaitingAgency ? (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  Sua solicitação já está com a agência. Assim que o orçamento
                  for enviado, você será avisado aqui e poderá aprovar ou
                  recusar.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              <p className="font-semibold">Esta solicitação foi encerrada.</p>
              {form.agencyFeedback || form.rejectionReason ? (
                <p className="mt-2 text-red-800">
                  {form.agencyFeedback ?? form.rejectionReason}
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Briefing
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-slate-800">
              {form.description}
            </p>
            {form.colors && form.colors.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.colors.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    <span
                      className="h-4 w-4 rounded border border-slate-200"
                      style={{ backgroundColor: c.hexCode }}
                    />
                    {c.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {form.budgetValue && form.status !== "PENDING_BUDGET" ? (
            <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">
                  Valor proposto
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                  {formatBudgetStoredForDisplay(form.budgetValue)}
                </p>
              </div>
              {form.budgetMessage ? (
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs font-medium uppercase text-slate-500">
                    Mensagem da agência
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {form.budgetMessage}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {form.status === "BUDGET_SENT" ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  navigate(`/app/solicitacao/${form.id}/revisar`)
                }
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Revisar e responder orçamento
              </button>
            </div>
          ) : null}

          {form.status === "DELIVERED" ? (
            <div className="mt-6 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-950">
                Projeto entregue
              </p>
              {form.deliveryMessage ? (
                <div>
                  <p className="text-xs font-medium uppercase text-emerald-800/80">
                    Mensagem da agência
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-emerald-950">
                    {form.deliveryMessage}
                  </p>
                </div>
              ) : null}
              {form.deliveryStoredName ? (
                <button
                  type="button"
                  onClick={() => void handleDownloadDelivery()}
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  {form.deliveryFileName
                    ? `Baixar: ${form.deliveryFileName}`
                    : "Baixar arquivo de entrega"}
                </button>
              ) : (
                <p className="text-sm text-emerald-900">
                  Esta entrega foi concluída sem arquivo anexado.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
