import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/simple-auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in | Kima CMS",
  description: "Sign in to manage your Kima CMS workspace.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-violet-600 text-xl font-bold text-white shadow-sm shadow-violet-200">
            k
          </span>
          <span className="text-2xl font-bold tracking-[-0.04em] text-slate-900">
            kima<span className="text-violet-600">.</span>
          </span>
        </Link>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <h1 className="text-xl font-bold tracking-[-0.03em] text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to your workspace to continue.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
