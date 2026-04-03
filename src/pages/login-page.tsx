export function LoginPage() {
  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-slate-100 px-2 py-4 sm:px-4 sm:py-8 lg:px-8 lg:py-10">
      <section className="w-full max-w-full overflow-hidden rounded-2xl  p-2 sm:max-w-6xl sm:p-4 lg:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-w-0 flex flex-col bg-slate-50 px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:px-12 ">
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
                Aether Agency
              </p>

              <div className="mt-8 sm:mt-10 lg:mt-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-[2.65rem]">
                  Bem-vindo de volta
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 sm:text-lg">
                  Acesse seu portal exclusivo de gestão e performance.
                </p>
              </div>

              <form
                className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
                aria-label="Formulário de login"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@aether.agency"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-extrabold uppercase tracking-widest text-slate-400"
                    >
                      Senha
                    </label>
                    <button
                      type="button"
                      className="text-xs font-bold text-slate-400 transition hover:text-slate-500"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value="***********"
                      readOnly
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 pr-11 text-sm tracking-[0.2em] text-slate-700 outline-none"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 inline-flex items-center text-slate-400">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 12C3.8 8.7 7.5 6 12 6C16.5 6 20.2 8.7 22 12C20.2 15.3 16.5 18 12 18C7.5 18 3.8 15.3 2 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-1 text-sm font-medium text-slate-400 sm:text-[15px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-slate-300 bg-slate-100 text-slate-600 accent-slate-600"
                  />
                  Lembrar de mim por 30 dias
                </label>

                <button
                  type="submit"
                  className="mt-1 h-12 w-full rounded-xl bg-slate-600 text-base font-bold text-white shadow-sm transition hover:bg-slate-700"
                >
                  Entrar
                </button>
              </form>

              <div className="mt-10 pt-8 sm:mt-12 sm:pt-10 lg:mt-auto lg:pt-12">
                <div className="h-px w-full bg-slate-200" />
                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-400 sm:text-[15px]">
                  <p className="font-semibold">Ainda não possui acesso?</p>
                  <button
                    type="button"
                    className="font-bold text-slate-500 transition hover:text-slate-700"
                  >
                    Solicitar acesso
                  </button>
                </div>
              </div>
            </div>

            <aside className="relative hidden min-w-0 min-h-full overflow-hidden bg-slate-900 lg:block lg:min-h-168">
              {/* <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=80"
                alt="Vista interna de um carro com cidade ao fundo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-slate-900/30 via-slate-900/45 to-slate-900/60" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/25 bg-slate-900/45 p-5 backdrop-blur-md xl:bottom-8 xl:left-8 xl:right-8 xl:p-7">
                <div className="text-[38px] font-extrabold leading-none text-white">
                  ”
                </div>
                <p className="mt-2 max-w-xl text-2xl font-medium leading-tight tracking-tight text-slate-100 xl:text-[2.125rem]">
                  A simplicidade é o último grau de sofisticação.
                </p>

                <div className="mt-6 flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80"
                    alt="Diretora executiva"
                    className="h-12 w-12 rounded-full border border-white/40 object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">
                      Diretoria Executiva
                    </p>
                    <p className="text-xs font-medium text-slate-200">
                      Aether Strategic Group
                    </p>
                  </div>
                </div>
              </div> */}
            </aside>
          </div>
        </div>

        <footer className="px-2 pb-1 pt-7 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:pt-9 sm:text-xs">
          © 2024 Aether Agency • Suporte premium • Privacidade
        </footer>
      </section>
    </main>
  );
}
