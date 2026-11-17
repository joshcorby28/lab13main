/**
 * Decides where the CMS saves edits.
 *
 * - `npm run dev`  → local files in this repo.
 * - Live site      → Keystatic Cloud (commits to GitHub, Vercel redeploys).
 *
 * Local mode can't work on Vercel (the server's files are read-only), so in
 * production without a Cloud project the editor shows setup instructions
 * instead of a broken editor.
 *
 * NEXT_PUBLIC_KEYSTATIC_PROJECT  – Cloud project, e.g. "lab13/lab13main"
 * NEXT_PUBLIC_KEYSTATIC_STORAGE  – optional override: "cloud" or "local"
 */
export const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT || undefined;

const override = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE;
const isProduction = process.env.NODE_ENV === "production";

export const useCloud =
  Boolean(cloudProject) && override !== "local" && (override === "cloud" || isProduction);

/** True when the live site has no working place to save edits. */
export const cmsNeedsSetup = isProduction && !useCloud && override !== "local";
