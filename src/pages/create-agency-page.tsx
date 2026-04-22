import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { getApiErrorMessage } from "../features/auth/http-error";
import { saveAuthSession } from "../features/auth/auth-storage";
import { fetchSessionUser } from "../http/services/auth-service";
import { createAgency } from "../http/services/users-service";
import {
  ArrowLeft,
  Building2,
  ImagePlus,
  Loader2,
  Phone,
  Sparkles,
} from "lucide-react";

export function CreateAgencyPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [agencyName, setAgencyName] = useState("");
  const [description, setDescription] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [iconDataUrl, setIconDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Selecione um arquivo de imagem (JPG, PNG ou WebP).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Arquivo muito grande. Tamanho máximo: 5 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setIconDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function clearLogo() {
    setIconDataUrl(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!agencyName.trim() || !description.trim() || !phonenumber.trim()) {
      addToast("Preencha nome, telefone e descrição da agência.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const created = await createAgency({
        name: agencyName.trim(),
        description: description.trim(),
        phone: phonenumber.trim(),
        iconAgency: iconDataUrl ?? undefined,
      });

      if (created.token) {
        const user = await fetchSessionUser(created.token);
        saveAuthSession({
          token: created.token,
          user,
          clientSignupIntent: null,
        });
      }

      addToast("Agência criada com sucesso!", "success");
      navigate("/app/solicitacoes");
    } catch (error: unknown) {
      addToast(
        getApiErrorMessage(error, "Erro ao criar agência."),
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar ao cadastro
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Building2 className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Primeiro passo
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Cadastre sua agência
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-base text-slate-600">
            Defina o nome e os dados de contato. A logo é opcional — você pode
            enviar agora ou adicionar depois em{" "}
            <span className="font-medium text-slate-800">Configurações</span>.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8"
          aria-label="Cadastro da agência"
        >
          <section className="space-y-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Identidade
                </h2>
                <p className="text-sm text-slate-600">
                  Como sua agência aparece para os clientes no marketplace.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="agencyName"
                className="mb-1.5 block text-sm font-semibold text-slate-900"
              >
                Nome da agência <span className="text-red-500">*</span>
              </label>
              <input
                id="agencyName"
                name="agencyName"
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Ex.: Estúdio Norte"
                autoComplete="organization"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </section>

          <div className="border-t border-slate-100" />

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Logo <span className="font-normal text-slate-500">(opcional)</span>
            </h2>
            <p className="text-sm text-slate-600">
              Arraste não é suportado nesta versão — use o botão para escolher
              uma imagem quadrada ou horizontal, até 5 MB.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border-2 border-dashed transition ${
                  iconDataUrl
                    ? "border-slate-200 bg-slate-50"
                    : "border-slate-200 bg-slate-50/80"
                }`}
              >
                {iconDataUrl ? (
                  <img
                    src={iconDataUrl}
                    alt=""
                    className="h-full w-full rounded-[10px] object-contain p-1"
                  />
                ) : (
                  <ImagePlus className="h-10 w-10 text-slate-300" aria-hidden />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto sm:justify-start sm:px-5">
                    {iconDataUrl ? "Trocar imagem" : "Enviar logo da empresa"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
                {iconDataUrl ? (
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="text-left text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
                  >
                    Remover imagem
                  </button>
                ) : null}
                <p className="text-xs text-slate-500">
                  JPG, PNG, WebP ou GIF · máx. 5 MB
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Contato</h2>

            <div>
              <label
                htmlFor="phonenumber"
                className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-900"
              >
                <Phone className="h-4 w-4 text-slate-500" aria-hidden />
                Telefone / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="tel"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(11) 99999-9999"
                autoComplete="tel"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </section>

          <div className="border-t border-slate-100" />

          <section className="space-y-3">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-900"
            >
              Descrição para o marketplace <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-slate-600">
              Resumo do que vocês fazem — aparece nas buscas e no perfil.
            </p>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Agência de performance e branding para PMEs..."
              required
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
              className="order-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Criando agência...
                </>
              ) : (
                "Criar agência e continuar"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
