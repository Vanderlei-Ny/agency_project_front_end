import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { listAgencies } from "../http/services/agencies-service";

interface Agency {
  id: string;
  name: string;
  statusAgency: boolean;
  numberOfStars: number;
  iconAgency?: string;
}

export function AgenciesListPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  useEffect(() => {
    loadAgencies();
  }, []);

  async function loadAgencies() {
    try {
      setIsLoading(true);
      const data = await listAgencies();
      setAgencies(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar agências";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelectAgency = (agencyId: string) => {
    setSelectedAgency(agencyId);
    addToast("Agência selecionada com sucesso!", "success");
    // Navegar para formulário após selecionar agência
    setTimeout(() => {
      navigate("/app/nova-solicitacao", { state: { agencyId } });
    }, 300);
  };

  return (
    <main className="min-h-dvh w-full bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                Escolha uma Agência
              </h1>
              <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                Selecione a agência que deseja trabalhar
              </p>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl border-2 border-slate-400 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-slate-600 sm:px-6 sm:py-3"
            >
              Voltar
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-black" />
              <p className="text-lg text-slate-600">Carregando agências...</p>
            </div>
          </div>
        ) : agencies.length === 0 ? (
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
              Nenhuma agência disponível
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Tente novamente mais tarde ou redirecione seu cadastro
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencies.map((agency) => (
              <button
                key={agency.id}
                onClick={() => handleSelectAgency(agency.id)}
                className={`group relative min-h-80 transform overflow-hidden rounded-2xl border-2 transition hover:scale-105 ${
                  selectedAgency === agency.id
                    ? "border-black bg-black"
                    : "border-slate-200 bg-white hover:border-slate-400"
                }`}
              >
                <div className="flex min-h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
                  {/* Header */}
                  <div className="text-left">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`flex-1 text-xl font-bold transition ${
                          selectedAgency === agency.id
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {agency.name}
                      </h3>
                      <div
                        className={`ml-2 flex items-center gap-1 ${
                          selectedAgency === agency.id
                            ? "text-yellow-300"
                            : "text-yellow-500"
                        }`}
                      >
                        ⭐
                        <span className="text-xs font-bold">
                          {agency.numberOfStars.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Imagem no meio */}
                  <div className="my-4 flex justify-center">
                    {agency.iconAgency ? (
                      <img
                        src={agency.iconAgency}
                        alt={agency.name}
                        className="h-24 w-24 rounded-lg object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-200">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-slate-400"
                        >
                          <path d="M21 21H3V3h9V1H3a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-9h-2v9z" />
                          <circle cx="10.5" cy="7.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    className={`mt-4 flex items-center gap-2 transition ${
                      selectedAgency === agency.id
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-xs font-semibold">Contato</span>
                  </div>
                </div>

                {selectedAgency === agency.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-12 px-2 pb-1 pt-7 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:pt-9 sm:text-xs">
        © 2026 • Omnify - A project fullstack agency management system by group
        2
      </footer>
    </main>
  );
}
