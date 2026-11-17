import KeystaticApp from "./keystatic";
import { cmsNeedsSetup } from "@/lib/cms-storage";

export default function KeystaticLayout() {
  // data-cms-admin switches off the site's film grain + custom cursor (see globals.css).
  return (
    <div data-cms-admin className="min-h-screen bg-white text-black">
      {cmsNeedsSetup ? <CmsSetupNotice /> : <KeystaticApp />}
    </div>
  );
}

function CmsSetupNotice() {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 font-sans text-[15px] leading-relaxed">
      <p className="text-[11px] tracking-[0.2em] uppercase text-black/45">Lab 13 · Admin</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">Editing isn’t switched on for the live site yet</h1>
      <p className="mt-4 text-black/70">
        The live site can’t save changes to its own files, so it needs Keystatic Cloud, which
        saves each change to GitHub and redeploys the site. This is a one-time setup for whoever
        manages the site:
      </p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-black/80">
        <li>
          Create a project at <a className="underline" href="https://keystatic.cloud">keystatic.cloud</a>{" "}
          and connect it to the <code>joshcorby28/lab13main</code> GitHub repo.
        </li>
        <li>
          In Vercel → Settings → Environment Variables, add{" "}
          <code>NEXT_PUBLIC_KEYSTATIC_PROJECT</code> with the project name shown in Keystatic
          Cloud (e.g. <code>lab13/lab13main</code>).
        </li>
        <li>Redeploy. This page then becomes the editor, and editors sign in with their Keystatic Cloud account.</li>
      </ol>
      <p className="mt-8 text-black/55">
        In the meantime you can edit locally: run <code>npm run dev</code> and open{" "}
        <code>localhost:3000/admin</code>.
      </p>
    </main>
  );
}
