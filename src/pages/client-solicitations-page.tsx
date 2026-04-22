import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  listClientForms,
  type FormData,
  type FormStatus,
} from "../http/services/forms-service";
import { formatBudgetStoredForDisplay } from "../lib/brl-budget";

const STATUS_COLORS: Record<
  FormStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING_BUDGET: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Aguardando Orçamento",
  },
  BUDGET_SENT: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Orçamento Enviado",
  },
  APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "Aprovado" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejeitado" },
  IN_PROGRESS: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Em Progresso",
  },
  DELIVERED: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    label: "Entregue",
  },
};

export function ClientSolicitationsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FormStatus | "">("");

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      void (async () => {
        try {
          const data = await listClientForms();
          setForms(data);
        } catch {
          /* ignora falhas do polling */
        }
      })();
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  async function loadForms() {
    try {
      setIsLoading(true);
      const data = await listClientForms();
      setForms(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao carregar solicitações";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredForms = filterStatus
    ? forms.filter((form) => form.status === filterStatus)
    : forms;

  const getStatusColor = (status: FormStatus) => STATUS_COLORS[status];

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-center sm:justify-between lg:mb-12">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Minhas Solicitações
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
              Acompanhe o andamento de suas solicitações
            </p>
          </div>
          <button
            onClick={() => navigate("/agencies-list")}
            className="rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            + Nova Solicitação
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar por status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FormStatus | "")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition focus:border-slate-400 focus:outline-none"
          >
            <option value="">Todos os status</option>
            {Object.entries(STATUS_COLORS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <div className="ml-auto text-sm text-slate-600">
            {filteredForms.length} solicitação(ões)
          </div>
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-black" />
              <p className="text-lg text-slate-600">
                Carregando solicitações...
              </p>
            </div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-12">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-3 text-slate-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-lg font-semibold text-slate-600">
              Você ainda não enviou solicitações
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Clique no botão acima para criar uma nova solicitação
            </p>
            <button
              onClick={() => navigate("/agencies-list")}
              className="mt-6 rounded-xl bg-slate-800 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Criar Solicitação
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredForms.map((form) => {
              const statusColor = getStatusColor(form.status);
              const createdDate = new Date(form.createdAt);
              const formattedDate = createdDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <div
                  key={form.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Info Principal */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-slate-800">
                          {form.agency?.name || "Agência"}
                        </h3>
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}
                        >
                          {statusColor.label}
                        </span>
                      </div>

                      <p className="mb-2 line-clamp-2 text-sm text-slate-600">
                        {form.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div>
                          <span className="font-medium text-slate-700">
                            Data:
                          </span>{" "}
                          {formattedDate}
                        </div>
                        {form.budgetValue && (
                          <div>
                            <span className="font-medium text-slate-700">
                              Orçamento:
                            </span>{" "}
                            {formatBudgetStoredForDisplay(form.budgetValue)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <button
                      onClick={() =>
                        navigate(
                          form.status === "BUDGET_SENT"
                            ? `/app/solicitacao/${form.id}/revisar`
                            : `/app/solicitacao/${form.id}`,
                        )
                      }
                      className="flex-shrink-0 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      {form.status === "BUDGET_SENT"
                        ? "Revisar Orçamento"
                        : "Ver Detalhes"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
