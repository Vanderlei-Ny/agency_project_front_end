import { useState, useEffect, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { createForm } from "../http/services/forms-service";
import { listAgencies } from "../http/services/agencies-service";
import {
  ArrowLeft,
  Building2,
  FileText,
  Palette,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  statusAgency: boolean;
  numberOfStars: number;
  iconAgency?: string;
}

interface Color {
  name: string;
  hexCode: string;
}

const PRESET_COLORS: { label: string; hex: string }[] = [
  { label: "Azul", hex: "#2563EB" },
  { label: "Verde", hex: "#059669" },
  { label: "Roxo", hex: "#7C3AED" },
  { label: "Laranja", hex: "#EA580C" },
  { label: "Rosa", hex: "#DB2777" },
  { label: "Grafite", hex: "#1E293B" },
  { label: "Off-white", hex: "#F8FAFC" },
  { label: "Preto", hex: "#0F172A" },
];

const MAX_COLORS = 12;

export function ClientFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const initialAgencyId = (location.state?.agencyId as string) || "";
  const [agencyId, setAgencyId] = useState<string>(initialAgencyId);
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState({ name: "", hexCode: "#3B82F6" });
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(true);

  useEffect(() => {
    loadAgencies();
  }, []);

  async function loadAgencies() {
    try {
      setIsLoadingAgencies(true);
      const data = await listAgencies();
      setAgencies(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar agências";
      addToast(message, "error");
    } finally {
      setIsLoadingAgencies(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agencyId || !description.trim()) {
      addToast("Preencha todos os campos obrigatórios", "error");
      return;
    }

    try {
      setIsLoading(true);

      await createForm({
        agencyId,
        description,
        colors: colors.length > 0 ? colors : undefined,
      });

      addToast("Solicitação enviada com sucesso!", "success");
      navigate("/app/solicitacoes");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao enviar solicitação";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddColor() {
    if (!newColor.name.trim()) {
      addToast("Dê um nome à cor (ex.: Azul principal)", "error");
      return;
    }

    if (colors.length >= MAX_COLORS) {
      addToast(`Limite de ${MAX_COLORS} cores na paleta.`, "error");
      return;
    }

    const normalized = newColor.hexCode.toUpperCase();
    if (colors.some((c) => c.hexCode.toUpperCase() === normalized)) {
      addToast("Essa cor já está na paleta.", "error");
      return;
    }

    setColors([...colors, { name: newColor.name.trim(), hexCode: newColor.hexCode }]);
    setNewColor({ name: "", hexCode: newColor.hexCode });
  }

  function handleColorNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddColor();
    }
  }

  function handleRemoveColor(index: number) {
    setColors(colors.filter((_, i) => i !== index));
  }

  function applyPreset(hex: string, label: string) {
    setNewColor((prev) => ({
      hexCode: hex,
      name: prev.name.trim() ? prev.name : label,
    }));
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Nova solicitação
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Envie o briefing para a agência. A paleta de cores é opcional e
            ajuda o time a alinhar o visual.
          </p>
          <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
            <li>
              <span className="text-slate-800">1.</span> Agência
            </li>
            <li aria-hidden className="text-slate-300">
              →
            </li>
            <li>
              <span className="text-slate-800">2.</span> Briefing
            </li>
            <li aria-hidden className="text-slate-300">
              →
            </li>
            <li>
              <span className="text-slate-800">3.</span> Paleta{" "}
              <span className="font-normal">(opcional)</span>
            </li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agência */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Para qual agência?
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Quem vai receber e responder sua solicitação.
                </p>
              </div>
            </div>

            {isLoadingAgencies ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
              </div>
            ) : (
              <select
                value={agencyId}
                onChange={(e) => setAgencyId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-800 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Selecione uma agência…</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                    {!agency.statusAgency ? " (inativa)" : ""}
                  </option>
                ))}
              </select>
            )}
          </section>

          {/* Briefing */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 ring-1 ring-slate-200">
                <FileText className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Descrição do projeto{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Objetivo, formatos, prazo e qualquer referência útil.
                </p>
              </div>
            </div>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Banners para Instagram 1080×1080, tom profissional, entrega em 2 semanas…"
              required
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </section>

          {/* Paleta */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 ring-1 ring-slate-200">
                <Palette className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Paleta de cores{" "}
                  <span className="text-sm font-semibold text-slate-500">
                    (opcional)
                  </span>
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Monte referências de cor com nome + tom. Assim a agência
                  replica sua identidade com menos ida e volta.
                </p>
              </div>
            </div>

            {colors.length > 0 ? (
              <ul className="mb-6 flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <li
                    key={`${color.hexCode}-${index}`}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-2 text-sm shadow-sm"
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: color.hexCode }}
                      title={color.hexCode}
                    />
                    <span className="max-w-[140px] truncate font-medium text-slate-800">
                      {color.name}
                    </span>
                    <span className="hidden font-mono text-xs text-slate-500 sm:inline">
                      {color.hexCode.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="ml-1 rounded-full p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remover ${color.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-500">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                Nenhuma cor ainda — use o seletor abaixo ou um atalho rápido.
              </div>
            )}

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Incluir nova cor
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
                  <label className="text-center text-xs font-medium text-slate-600 sm:text-left">
                    Amostra
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="color"
                      value={newColor.hexCode}
                      onChange={(e) =>
                        setNewColor({ ...newColor, hexCode: e.target.value })
                      }
                      className="sr-only"
                      aria-label="Escolher cor na paleta do sistema"
                    />
                    <span
                      className="block h-14 w-14 rounded-2xl border-2 border-slate-200 shadow-md ring-2 ring-white transition hover:ring-slate-300"
                      style={{ backgroundColor: newColor.hexCode }}
                    />
                  </label>
                  <span className="font-mono text-xs text-slate-500">
                    {newColor.hexCode.toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <label
                      htmlFor="color-name"
                      className="mb-1 block text-xs font-semibold text-slate-700"
                    >
                      Nome de referência
                    </label>
                    <input
                      id="color-name"
                      type="text"
                      value={newColor.name}
                      onChange={(e) =>
                        setNewColor({ ...newColor, name: e.target.value })
                      }
                      onKeyDown={handleColorNameKeyDown}
                      placeholder="Ex.: Azul principal da marca"
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-600">
                      Atalhos — um clique preenche o tom (edite o nome se
                      quiser)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((p) => (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => applyPreset(p.hex, p.label)}
                          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <span
                            className="h-6 w-6 rounded-full border border-black/10"
                            style={{ backgroundColor: p.hex }}
                          />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddColor}
                disabled={colors.length >= MAX_COLORS}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Incluir na paleta
              </button>
              <p className="mt-2 text-xs text-slate-500">
                Até {MAX_COLORS} cores ·{" "}
                <kbd className="rounded border border-slate-200 bg-white px-1 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                no nome também adiciona
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="order-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="order-1 rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 sm:order-2"
            >
              {isLoading ? "Enviando…" : "Enviar solicitação"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
