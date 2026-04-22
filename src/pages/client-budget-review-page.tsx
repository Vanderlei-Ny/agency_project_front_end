import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  decideFormBudget,
  getClientForm,
  type FormData,
} from "../http/services/forms-service";
import { formatBudgetStoredForDisplay } from "../lib/brl-budget";

const PAYMENT_OPTIONS = [
  "PIX",
  "Cartão de crédito",
  "Boleto",
  "Transferência bancária",
] as const;

export function ClientBudgetReviewPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_OPTIONS[0]);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!formId) return;
    try {
      const data = await getClientForm(formId);
      if (data.status !== "BUDGET_SENT") {
        addToast(
          data.status === "PENDING_BUDGET"
            ? "A agência ainda não enviou o orçamento."
            : "Este orçamento não está mais aberto para revisão.",
          "error",
        );
        navigate(`/app/solicitacao/${formId}`, { replace: true });
        return;
      }
      setForm(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar solicitação";
      addToast(message, "error");
      navigate("/app/solicitacoes");
    } finally {
      setIsLoading(false);
    }
  }, [formId, navigate, addToast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!formId || !paymentMethod.trim()) {
      addToast("Informe a forma de pagamento.", "error");
      return;
    }
    try {
      setIsSubmitting(true);
      await decideFormBudget({
        formId,
        approved: true,
        paymentMethod: paymentMethod.trim(),
      });
      addToast("Orçamento aprovado! A agência será notificada.", "success");
      navigate(`/app/solicitacao/${formId}`, { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao aprovar orçamento";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!formId || !rejectReason.trim()) {
      addToast("Descreva o motivo da recusa.", "error");
      return;
    }
    try {
      setIsSubmitting(true);
      await decideFormBudget({
        formId,
        approved: false,
        rejectionReason: rejectReason.trim(),
      });
      addToast("Orçamento recusado.", "success");
      navigate(`/app/solicitacao/${formId}`, { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao recusar orçamento";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
        </div>
      </main>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <button
          type="button"
          onClick={() => navigate(`/app/solicitacao/${form.id}`)}
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          ← Voltar ao andamento
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Revisar orçamento</h1>
          <p className="mt-1 text-sm text-slate-600">
            {form.agency?.name} — confira o valor e decida.
          </p>

          <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Valor proposto
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
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

          <form onSubmit={handleApprove} className="mt-8 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Aprovar orçamento
            </h2>
            <label className="block text-sm font-medium text-slate-700">
              Forma de pagamento
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {PAYMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Aprovar orçamento"}
            </button>
          </form>

          <form onSubmit={handleReject} className="mt-10 space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-sm font-semibold text-slate-900">
              Recusar orçamento
            </h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explique por que não seguirá com este valor..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border-2 border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Recusar orçamento"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
