import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-violet-600 text-2xl font-bold text-white shadow-sm shadow-violet-200">
        k
      </span>
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-900">
          Kima CMS
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          Manage your content, media, and publishing activity in one modular
          workspace.
        </p>
      </div>
      <Link
        href="/admin"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      >
        Open workspace
      </Link>
    </main>
  );
}
