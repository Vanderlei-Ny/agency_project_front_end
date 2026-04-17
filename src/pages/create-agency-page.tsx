import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { createAgency } from "../http/services/users-service";

export function CreateAgencyPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [agencyName, setAgencyName] = useState("");
  const [description, setDescription] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      addToast("Por favor, selecione um arquivo de imagem", "error");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast("Arquivo muito grande. Máximo 5MB", "error");
      return;
    }

    setLogo(file);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!agencyName || !description || !phonenumber) {
      addToast("Preencha todos os campos obrigatórios", "error");
      return;
    }

    try {
      setIsLoading(true);

      await createAgency({ name: agencyName });

      addToast("Agência criada com sucesso!", "success");

      // Navegar para home após criar agência
      navigate("/app/home");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar agência";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <section className="w-full max-w-full overflow-hidden rounded-2xl p-2 sm:max-w-6xl sm:p-4 lg:p-6">
        <div className="overflow-hidden rounded-4xl border border-slate-200 inset-0 bg-linear-to-b from-white via-white to-slate-90">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-w-0 flex flex-col rounded-4xl bg-slate-100 px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:order-2 lg:px-12">
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                Crie sua agência
              </p>

              <div className="mt-8 sm:mt-10 lg:mt-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem]">
                  Detalhes da Agência
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                  Configure as informações básicas da sua agência.
                </p>
              </div>

              <form
                className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
                aria-label="Formulário de criação de agência"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="agencyName"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Nome da Agência
                  </label>
                  <input
                    id="agencyName"
                    name="agencyName"
                    type="text"
                    value={agencyName}
                    onChange={(event) => setAgencyName(event.target.value)}
                    placeholder="Minha Agência"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phonenumber"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Telefone
                  </label>
                  <input
                    id="phonenumber"
                    name="phonenumber"
                    type="tel"
                    value={phonenumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="logo"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Logo da Agência
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition file:mr-4 file:border-0 file:bg-black file:px-3 file:py-2 file:text-white file:font-bold focus:border-slate-400 focus:bg-white"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Máximo 5MB. Formatos: JPG, PNG, WebP
                      </p>
                    </div>
                    {logoPreview && (
                      <div className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-2">
                        <img
                          src={logoPreview}
                          alt="Preview da logo"
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descreva sua agência e serviços..."
                    required
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 h-12 w-full rounded-xl bg-black text-base font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {isLoading ? "Criando..." : "Criar Agência"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white text-base font-bold text-slate-800 shadow-sm transition hover:border-slate-400"
                >
                  Voltar
                </button>
              </form>
            </div>

            <aside className="relative hidden min-h-full min-w-0 overflow-hidden lg:order-1 lg:block lg:min-h-168">
              <img
                src="../public/icon.png"
                alt="Ícone do sistema"
                className="h-full w-full object-cover"
              />
              <p>icon here</p>
              <div className="absolute" />
            </aside>
          </div>
        </div>

        <footer className="px-2 pb-1 pt-7 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:pt-9 sm:text-xs">
          © 2026 • Omnify - A project fullstack agency management system by
          group 2
        </footer>
      </section>
    </main>
  );
}
