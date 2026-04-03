type WorkspacePageProps = {
  title: string;
  description: string;
};

export function WorkspacePage({ title, description }: WorkspacePageProps) {
  return (
    <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
        {description}
      </p>
    </section>
  );
}
