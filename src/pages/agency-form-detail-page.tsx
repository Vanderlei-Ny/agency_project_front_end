import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  deliverFormFinal,
  listAgencyForms,
  rejectFormByAgency,
  setFormBudget,
  updateFormStatus,
  type FormData,
  type FormStatus,
} from "../http/services/forms-service";
import {
  canAgencyManageDeliveryStatus,
  canAgencyManageFormBudget,
} from "../features/auth/agency-permissions";
import {
  budgetStoredToCents,
  centsToApiString,
  formatBudgetStoredForDisplay,
  formatMoneyFromCents,
} from "../lib/brl-budget";
import {
  Send,
  X,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  Upload,
} from "lucide-react";

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

export function AgencyFormDetailPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /** Apenas dígitos: valor em centavos (ex.: "10000" = R$ 100,00). */
  const [budgetCentsDigits, setBudgetCentsDigits] = useState("");
  const [budgetNote, setBudgetNote] = useState("");
  const [isSettingBudget, setIsSettingBudget] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const [deliveryFile, setDeliveryFile] = useState<File | null>(null);
  const [deliveryClientMessage, setDeliveryClientMessage] = useState("");
  const [isDelivering, setIsDelivering] = useState(false);

  const canSetBudget = canAgencyManageFormBudget();
  const canUpdateDelivery = canAgencyManageDeliveryStatus();

  useEffect(() => {
    loadForm();
  }, [formId]);

  async function loadForm() {
    try {
      setIsLoading(true);
      const forms = await listAgencyForms();
      const foundForm = forms.find((f) => f.id === formId);

      if (!foundForm) {
        addToast("Solicitação não encontrada", "error");
        navigate("/app/solicitacoes");
        return;
      }

      setForm(foundForm);
      setBudgetCentsDigits(
        foundForm.budgetValue
          ? String(budgetStoredToCents(foundForm.budgetValue))
          : "",
      );
      setBudgetNote(foundForm.budgetMessage ?? "");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar solicitação";
      addToast(message, "error");
      navigate("/app/solicitacoes");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetBudget(e: React.FormEvent) {
    e.preventDefault();

    if (!form) return;

    const cents = parseInt(budgetCentsDigits || "0", 10);
    if (!budgetCentsDigits || cents <= 0) {
      addToast("Informe um valor maior que zero.", "error");
      return;
    }

    try {
      setIsSettingBudget(true);
      const updatedForm = await setFormBudget({
        formId: form.id,
        budgetValue: centsToApiString(cents),
        budgetMessage: budgetNote.trim() || null,
      });
      setForm(updatedForm);
      addToast("Orçamento enviado ao cliente!", "success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao definir orçamento";
      addToast(message, "error");
    } finally {
      setIsSettingBudget(false);
    }
  }

  async function handleUpdateStatus(newStatus: "IN_PROGRESS" | "DELIVERED") {
    if (!form) return;

    try {
      setIsUpdatingStatus(true);
      const updatedForm = await updateFormStatus({
        formId: form.id,
        status: newStatus,
      });
      setForm(updatedForm);
      addToast(
        `Status atualizado para ${newStatus === "IN_PROGRESS" ? "Em Progresso" : "Entregue"}!`,
        "success",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar status";
      addToast(message, "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDeliverFinal(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    try {
      setIsDelivering(true);
      const updatedForm = await deliverFormFinal({
        formId: form.id,
        file: deliveryFile,
        deliveryMessage: deliveryClientMessage.trim() || null,
      });
      setForm(updatedForm);
      setDeliveryFile(null);
      setDeliveryClientMessage("");
      addToast("Entrega enviada ao cliente.", "success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao registrar entrega";
      addToast(message, "error");
    } finally {
      setIsDelivering(false);
    }
  }

  async function handleMarkDeliveredWithoutFile() {
    if (!form) return;
    try {
      setIsUpdatingStatus(true);
      const updatedForm = await updateFormStatus({
        formId: form.id,
        status: "DELIVERED",
      });
      setForm(updatedForm);
      addToast("Marcado como entregue (sem arquivo).", "success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar status";
      addToast(message, "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleSubmitResponse(e: React.FormEvent) {
    e.preventDefault();

    if (!responseText.trim() || !form) {
      addToast("Digite um comentário", "error");
      return;
    }

    try {
      setIsSubmittingResponse(true);
      const updatedForm = await rejectFormByAgency({
        formId: form.id,
        feedback: responseText,
      });
      setForm(updatedForm);
      setShowResponseModal(false);
      setResponseText("");
      addToast("Solicitação recusada e o cliente foi notificado.", "success");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao responder solicitação";
      addToast(message, "error");
    } finally {
      setIsSubmittingResponse(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-black" />
            <p className="text-lg text-slate-600">Carregando solicitação...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-lg text-slate-600">Solicitação não encontrada</p>
            <button
              onClick={() => navigate("/app/solicitacoes")}
              className="mt-4 rounded-xl bg-slate-800 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Solicitação de {form.client?.name}
            </h1>
            <p className="mt-1 text-slate-600">{form.client?.email}</p>
          </div>
          <span
            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
              STATUS_COLORS[form.status].bg
            } ${STATUS_COLORS[form.status].text}`}
          >
            {STATUS_COLORS[form.status].label}
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Descrição da Solicitação
            </h2>
            <p className="text-slate-700">{form.description}</p>
          </div>

          {/* Colors Section */}
          {form.colors && form.colors.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Cores Solicitadas
              </h2>
              <div className="flex flex-wrap gap-3">
                {form.colors.map((color) => (
                  <div key={color.id} className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-lg shadow-sm ring-1 ring-slate-200"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {color.name}
                      </p>
                      <p className="text-xs text-slate-600">{color.hexCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.respondedByUser && (
            <div className="space-y-3 rounded-lg bg-blue-50 p-4 ring-1 ring-blue-200">
              <h2 className="text-sm font-semibold text-blue-950">
                Respondido por
              </h2>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  {form.respondedByUser.name}
                </p>
                <p className="text-xs text-blue-700">{form.respondedByUser.email}</p>
                {form.respondedAt && (
                  <p className="text-xs text-blue-600">
                    {new Date(form.respondedAt).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200" />

          {/* Budget Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Orçamento</h2>

            {form.status === "PENDING_BUDGET" && canSetBudget ? (
              <form onSubmit={handleSetBudget} className="space-y-4">
                <div>
                  <label
                    htmlFor="budget-amount"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Valor do orçamento
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    Digite só números, como na maquininha: os dois últimos
                    dígitos são centavos. Ex.: 150000 → R$&nbsp;1.500,00.
                  </p>
                  <input
                    id="budget-amount"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={
                      budgetCentsDigits === ""
                        ? ""
                        : formatMoneyFromCents(
                            parseInt(budgetCentsDigits, 10),
                          )
                    }
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "");
                      setBudgetCentsDigits(d);
                    }}
                    placeholder="R$ 0,00"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-lg font-semibold tabular-nums text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    disabled={isSettingBudget}
                  />
                </div>
                <div>
                  <label
                    htmlFor="budget-note"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Mensagem ao cliente{" "}
                    <span className="font-normal text-slate-500">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    id="budget-note"
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                    placeholder="Ex.: Prazo de 15 dias após aprovação; inclui 2 rodadas de revisão…"
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    disabled={isSettingBudget}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSettingBudget}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSettingBudget ? "Enviando..." : "Enviar orçamento ao cliente"}
                </button>
              </form>
            ) : form.status === "PENDING_BUDGET" && !canSetBudget ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                Orçamento ainda não definido. O administrador da agência envia o
                valor ao cliente.
              </p>
            ) : (
              <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                <div>
                  <p className="text-sm text-slate-600">Orçamento definido:</p>
                  <p className="text-2xl font-bold tabular-nums text-slate-900">
                    {formatBudgetStoredForDisplay(form.budgetValue)}
                  </p>
                </div>
                {form.budgetMessage ? (
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sua mensagem ao cliente
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                      {form.budgetMessage}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200" />

          {/* Feedback/Response Section */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <MessageSquare className="h-5 w-5" />
              Resposta da Agência
            </h2>

            {form.agencyFeedback ? (
              <div className="rounded-lg border-l-4 border-slate-900 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Feedback:
                    </p>
                    <p className="mt-2 text-slate-700">{form.agencyFeedback}</p>
                  </div>
                  {form.status === "APPROVED" && (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                  {form.status === "REJECTED" && (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ) : form.status === "PENDING_BUDGET" ||
              form.status === "BUDGET_SENT" ? (
              <button
                type="button"
                onClick={() => setShowResponseModal(true)}
                className="w-full rounded-lg border-2 border-dashed border-red-200 bg-red-50/50 py-4 text-center transition hover:border-red-400 hover:bg-red-50"
              >
                <MessageSquare className="mx-auto mb-2 h-6 w-6 text-red-400" />
                <p className="text-sm font-medium text-red-900">
                  Recusar esta solicitação
                </p>
                <p className="text-xs text-red-700">
                  O cliente verá o motivo. Para aceitar, envie o orçamento
                  acima.
                </p>
              </button>
            ) : null}
          </div>

          {/* Status Actions */}
          {form.status === "APPROVED" &&
            form.budgetValue &&
            canUpdateDelivery && (
              <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-900">
                  Solicitação aprovada pelo cliente
                </p>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("IN_PROGRESS")}
                  disabled={isUpdatingStatus}
                  className="w-full rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isUpdatingStatus ? "Atualizando..." : "Iniciar projeto"}
                </button>
              </div>
            )}

          {form.status === "IN_PROGRESS" && canUpdateDelivery && (
            <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-950">
                <Package className="h-5 w-5 shrink-0" aria-hidden />
                Entrega final ao cliente
              </h3>
              <p className="text-sm text-emerald-900">
                Envie PDF ou imagem (máx. 20 MB) e uma mensagem. O cliente
                poderá baixar o arquivo na área da solicitação.
              </p>
              <form onSubmit={handleDeliverFinal} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-emerald-950">
                    Arquivo (opcional)
                  </label>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-white px-4 py-6 transition hover:border-emerald-400">
                    <Upload className="h-8 w-8 text-emerald-600" />
                    <span className="text-center text-sm font-medium text-emerald-900">
                      {deliveryFile
                        ? deliveryFile.name
                        : "Clique para escolher PDF ou imagem"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      disabled={isDelivering}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setDeliveryFile(f);
                      }}
                    />
                  </label>
                  {deliveryFile ? (
                    <button
                      type="button"
                      onClick={() => setDeliveryFile(null)}
                      className="mt-2 text-sm font-medium text-emerald-800 underline"
                    >
                      Remover arquivo
                    </button>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="delivery-msg"
                    className="mb-1.5 block text-sm font-medium text-emerald-950"
                  >
                    Mensagem ao cliente (opcional)
                  </label>
                  <textarea
                    id="delivery-msg"
                    value={deliveryClientMessage}
                    onChange={(e) => setDeliveryClientMessage(e.target.value)}
                    rows={3}
                    placeholder="Ex.: Pacote final em anexo. Qualquer dúvida, estamos à disposição."
                    disabled={isDelivering}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isDelivering}
                  className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDelivering ? "Enviando..." : "Concluir entrega (com anexo se houver)"}
                </button>
              </form>
              <div className="border-t border-emerald-200 pt-3">
                <button
                  type="button"
                  onClick={() => void handleMarkDeliveredWithoutFile()}
                  disabled={isUpdatingStatus || isDelivering}
                  className="text-sm font-medium text-emerald-800 underline decoration-emerald-400 underline-offset-2 hover:text-emerald-950 disabled:opacity-50"
                >
                  Concluir sem enviar arquivo
                </button>
              </div>
            </div>
          )}

          {form.status === "DELIVERED" &&
            (form.deliveryFileName ||
              form.deliveryMessage ||
              form.deliveryStoredName) && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Registro de entrega
                </h3>
                {form.deliveryFileName ? (
                  <p className="mt-1 text-sm text-slate-600">
                    Arquivo:{" "}
                    <span className="font-medium text-slate-800">
                      {form.deliveryFileName}
                    </span>
                  </p>
                ) : null}
                {form.deliveryMessage ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {form.deliveryMessage}
                  </p>
                ) : null}
              </div>
            )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/app/solicitacoes")}
          className="rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          ← Voltar para Solicitações
        </button>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Recusar solicitação
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                disabled={isSubmittingResponse}
                className="rounded-lg p-1 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <p className="text-sm text-slate-600">
                Explique ao cliente por que a solicitação não seguirá. Esta ação
                encerra o pedido.
              </p>

              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Explique o motivo da recusa..."
                className="h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                disabled={isSubmittingResponse}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingResponse || !responseText.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingResponse ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Confirmar recusa
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
