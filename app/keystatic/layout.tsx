import KeystaticApp from "./keystatic";

export default function KeystaticLayout() {
  // data-cms-admin switches off the site's film grain + custom cursor (see globals.css).
  return (
    <div data-cms-admin className="min-h-screen bg-white text-black">
      <KeystaticApp />
    </div>
  );
}
