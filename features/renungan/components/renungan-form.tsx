"use client";

import { useRenunganForm } from "../hooks/use-renungan-form";
import type { Renungan } from "../renungan.types";

const INPUT_CLASSES =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700";

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required = true,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className={LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={INPUT_CLASSES}
      />
    </div>
  );
}

type TextAreaProps = {
  name: string;
  label: string;
  defaultValue?: string;
  rows: number;
};

function TextArea({ name, label, defaultValue, rows }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className={LABEL_CLASSES}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required
        className={INPUT_CLASSES}
      />
    </div>
  );
}

type RenunganFormProps = {
  date: string;
  initial: Renungan | null;
};

export function RenunganForm({ date, initial }: RenunganFormProps) {
  const { error, formAction, isPending } = useRenunganForm();

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="publishDate" value={date} />
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <Field name="title" label="Title" defaultValue={initial?.title} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="verse" label="Verse" defaultValue={initial?.verse} />
        <Field
          name="imageUrl"
          label="Image URL"
          type="url"
          required={false}
          defaultValue={initial?.imageUrl ?? ""}
          placeholder="https://images.example.com/background.jpg"
        />
      </div>

      <TextArea
        name="scripture"
        label="Scripture"
        defaultValue={initial?.scripture}
        rows={4}
      />
      <TextArea
        name="description"
        label="Description"
        defaultValue={initial?.description}
        rows={8}
      />

      <p className="text-xs text-slate-500">
        Leave the image URL empty to auto-fill one from Openverse.
      </p>

      {initial?.imageAttribution && (
        <p className="text-xs text-slate-400">{initial.imageAttribution}</p>
      )}

      {initial?.imageUrl && (
        <div
          role="img"
          aria-label="Current background image"
          className="h-32 rounded-xl bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${initial.imageUrl})` }}
        />
      )}

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={initial?.isPublished ?? true}
          className="size-4 rounded border-slate-300 text-violet-600 focus:ring-violet-200"
        />
        Published
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save renungan"}
      </button>
    </form>
  );
}
