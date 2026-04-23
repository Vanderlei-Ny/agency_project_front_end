import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../features/toast/toast-context";
import { addAgencyMember, listAgencyMembers } from "../http/services/users-service";
import { Mail, Lock, User, Plus, Loader2, Users, Shield, ArrowLeft } from "lucide-react";

type AgencyMember = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function AgencyAddMembersPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [existingMembers, setExistingMembers] = useState<AgencyMember[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([
    { name: "", email: "", password: "" },
  ]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setIsLoadingList(true);
      const data = await listAgencyMembers();
      setExistingMembers(data);
    } catch (error: any) {
      addToast(error.message || "Erro ao carregar a lista.", "error");
    } finally {
      setIsLoadingList(false);
    }
  }

  function handleInputChange(
    index: number,
    field: "name" | "email" | "password",
    value: string,
  ) {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  }

  function addEmptyMember() {
    setMembers([...members, { name: "", email: "", password: "" }]);
  }

  function removeMember(index: number) {
    if (members.length === 1) {
      addToast("Você precisa adicionar pelo menos um funcionário", "error");
      return;
    }
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emptyFields = members.some(
      (m) => !m.name.trim() || !m.email.trim() || !m.password.trim(),
    );
    if (emptyFields) {
      addToast("Todos os campos devem ser preenchidos", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = members.some((m) => !emailRegex.test(m.email));
    if (invalidEmails) {
      addToast("E-mail inválido em um ou mais campos", "error");
      return;
    }

    const shortPasswords = members.some((m) => m.password.length < 6);
    if (shortPasswords) {
      addToast("Senhas devem ter no mínimo 6 caracteres", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const results = [];

      for (const member of members) {
        try {
          const response = await addAgencyMember({
            name: member.name,
            email: member.email,
            password: member.password,
          });
          results.push({ success: true, member: response });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Erro ao adicionar membro";
          results.push({ success: false, error: errorMessage, email: member.email });
        }
      }

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        addToast(`${successful.length} funcionário(s) adicionado(s) com sucesso!`, "success");
        setMembers([{ name: "", email: "", password: "" }]);
        fetchMembers();
      }

      if (failed.length > 0) {
        failed.forEach((f) => {
          addToast(`Erro ao adicionar ${f.email}: ${f.error}`, "error");
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro crítico ao adicionar";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-[#F8FAFC] px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <button 
                onClick={() => navigate(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Gestão de Equipe
              </h1>
            </div>
            <p className="ml-10 text-base font-medium text-slate-500">
              Visualize seus funcionários atuais e adicione novos membros à agência.
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          
          <section className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Equipe Atual</h2>
                  <p className="text-xs font-medium text-slate-500">
                    {existingMembers.length} membro(s) cadastrado(s)
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {isLoadingList ? (
                  <div className="flex h-40 flex-col items-center justify-center text-slate-400">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin" />
                    <span className="text-sm">Carregando equipe...</span>
                  </div>
                ) : existingMembers.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center p-6 text-center">
                    <Shield className="mb-3 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Nenhum funcionário encontrado.</p>
                    <p className="mt-1 text-xs text-slate-400">Use o painel ao lado para adicionar.</p>
                  </div>
                ) : (
                  <ul className="space-y-1 p-2">
                    {existingMembers.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-slate-50"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {member.name}
                          </p>
                          <p className="truncate text-xs font-medium text-slate-500">
                            {member.email}
                          </p>
                        </div>
                        {member.role === "AGENCY_ADMIN" && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            ADMIN
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Adicionar Novos Membros</h2>
                <p className="text-sm text-slate-500">Crie o acesso para os funcionários operarem o sistema.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div 
                      key={index} 
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-md"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                          Funcionário {index + 1}
                        </h3>
                        {members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="text-xs font-bold text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-xs font-bold text-slate-600">Nome Completo</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={member.name}
                              onChange={(e) => handleInputChange(index, "name", e.target.value)}
                              placeholder="Ex: João da Silva"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-600">E-mail corporativo</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={member.email}
                              onChange={(e) => handleInputChange(index, "email", e.target.value)}
                              placeholder="joao@agencia.com"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-600">Senha provisória</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={member.password}
                              onChange={(e) => handleInputChange(index, "password", e.target.value)}
                              placeholder="Mín. 6 caracteres"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addEmptyMember}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-transparent py-4 text-sm font-bold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar mais um funcionário ao lote
                </button>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Todos os Funcionários"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}