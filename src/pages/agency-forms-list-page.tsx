import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  listAgencyForms,
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

export function AgencyFormsListPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FormStatus | "">("");

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      setIsLoading(true);
      const data = await listAgencyForms();
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
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Solicitações de Clientes
          </h1>
          <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
            Gerencie as solicitações de marketing dos seus clientes
          </p>
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
              Nenhuma solicitação encontrada
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {filterStatus
                ? "Nenhuma solicitação com este status"
                : "Você ainda não recebeu solicitações"}
            </p>
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
              const formattedTime = createdDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <button
                  key={form.id}
                  onClick={() => navigate(`/app/solicitacoes/${form.id}`)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Info Principal */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                          {form.client?.name || "Cliente"}
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
                            Email:
                          </span>{" "}
                          {form.client?.email}
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">
                            Data:
                          </span>{" "}
                          {formattedDate} às {formattedTime}
                        </div>
                      </div>
                    </div>

                    {/* Dados do Orçamento */}
                    {form.budgetValue && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Orçamento
                        </p>
                        <p className="text-xl font-bold tabular-nums text-slate-800">
                          {formatBudgetStoredForDisplay(form.budgetValue)}
                        </p>
                      </div>
                    )}

                    {/* Seta */}
                    <div className="flex-shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
