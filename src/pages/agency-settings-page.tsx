import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import {
  getMyAgency,
  updateMyAgency,
  type AgencyData,
} from "../http/services/agencies-service";
import { ImagePlus, Save, Loader2 } from "lucide-react";

export function AgencySettingsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [agency, setAgency] = useState<AgencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    iconAgency: "",
  });
  const [iconPreview, setIconPreview] = useState<string>("");

  useEffect(() => {
    loadAgency();
  }, []);

  async function loadAgency() {
    try {
      setIsLoading(true);
      const data = await getMyAgency();
      setAgency(data);
      setFormData({
        name: data.name,
        description: data.description ?? "",
        phone: data.phone ?? "",
        iconAgency: data.iconAgency || "",
      });
      if (data.iconAgency) {
        setIconPreview(data.iconAgency);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar agência";
      addToast(message, "error");
      navigate("/app/dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      addToast("Por favor, selecione uma imagem válida", "error");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast("Imagem muito grande. Máximo 5MB", "error");
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setIconPreview(base64String);
      setFormData((prev) => ({ ...prev, iconAgency: base64String }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      addToast("Nome da agência é obrigatório", "error");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateMyAgency({
        name: formData.name,
        description: formData.description.trim() || null,
        phone: formData.phone.trim() || null,
        iconAgency: formData.iconAgency,
      });
      setAgency(updated);
      addToast("Agência atualizada com sucesso!", "success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar alterações";
      addToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-black" />
            <p className="text-lg text-slate-600">Carregando informações...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!agency) {
    return (
      <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-lg text-slate-600">Agência não encontrada</p>
            <button
              onClick={() => navigate("/app/dashboard")}
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Configurações da Agência
          </h1>
          <p className="mt-2 text-slate-600">
            Atualize as informações da sua agência
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8"
        >
          {/* Logo/Icon Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Logo da Agência
              </label>
              <p className="mt-1 text-sm text-slate-600">
                Faça upload de uma imagem quadrada para melhor resultado
              </p>
            </div>

            <div className="flex gap-6">
              {/* Icon Preview */}
              <div className="flex-shrink-0">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt={agency.name}
                    className="h-24 w-24 rounded-xl object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-100">
                    <ImagePlus className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex flex-col justify-center">
                <label className="relative cursor-pointer rounded-lg bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200 transition hover:bg-slate-100">
                  <span className="text-sm font-semibold text-slate-900">
                    Escolher imagem
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                    disabled={isSaving}
                  />
                </label>
                <p className="mt-2 text-xs text-slate-600">
                  JPG, PNG ou GIF até 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Name Section */}
          <div className="space-y-3">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-900"
            >
              Nome da Agência
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Digite o nome da sua agência"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={isSaving}
            />
            <p className="text-xs text-slate-600">
              Máximo 100 caracteres (atual: {formData.name.length})
            </p>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-slate-900"
            >
              Telefone / WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-900"
            >
              Descrição no marketplace
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Resumo dos serviços da agência..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              disabled={isSaving}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Info Section */}
          <div className="space-y-3 rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Informações</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-600">ID da Agência:</span>
                <span className="ml-2 font-mono text-slate-900">
                  {agency.id}
                </span>
              </p>
              <p>
                <span className="text-slate-600">Status:</span>
                <span className="ml-2">
                  {agency.statusAgency ? (
                    <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      Ativa
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                      Inativa
                    </span>
                  )}
                </span>
              </p>
              <p>
                <span className="text-slate-600">Avaliação:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  {agency.numberOfStars.toFixed(1)} ⭐
                </span>
              </p>
              <p>
                <span className="text-slate-600">Criada em:</span>
                <span className="ml-2 font-mono text-slate-900">
                  {new Date(agency.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Salvar Alterações
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/dashboard")}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
