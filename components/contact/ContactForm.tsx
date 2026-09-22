"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const budgets = [
  "To be confirmed",
  "Under £10k",
  "£10k – £25k",
  "£25k – £50k",
  "£50k+",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="grid gap-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Company" name="company" autoComplete="organization" />
      <Field label="Project" name="project" placeholder="New store, Plus, migration, app…" />
      <label className="block">
        <span className="eyebrow text-muted">Budget</span>
        <select
          name="budget"
          defaultValue=""
          className="mt-3 w-full appearance-none border-b border-line bg-transparent py-3 text-[1.05rem] outline-none focus:border-ink"
        >
          <option value="" disabled>
            Select a range
          </option>
          {budgets.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-3 w-full resize-y border-b border-line bg-transparent py-3 text-[1.05rem] outline-none focus:border-ink"
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="bg-ink px-8 py-4 text-[0.75rem] tracking-[0.16em] text-[var(--paper)] uppercase transition-colors hover:bg-accent"
        >
          Send message
        </button>
        <p className="text-[0.85rem] text-muted">
          Prefer email? Write to{" "}
          <a className="underline decoration-line underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>

      {submitted ? (
        <p role="status" className="text-[1.02rem] text-ink-soft">
          Thanks — we have your details. If you need a faster reply, write to us directly
          at {site.email}.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border-b border-line bg-transparent py-3 text-[1.05rem] outline-none placeholder:text-muted/60 focus:border-ink"
      />
    </label>
  );
}
