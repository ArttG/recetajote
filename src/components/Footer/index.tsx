import Link from "next/link";
import Icon from "@/components/shared/Icon";

const columns = [
  {
    title: "Navigimi",
    links: [
      { href: "/", label: "Ballina" },
      { href: "/recipes", label: "Recetat" },
      { href: "/about", label: "Rreth Nesh" },
      { href: "/contact", label: "Kontakt" },
    ],
  },
  {
    title: "Ndihmë",
    links: [
      { href: "/faq", label: "Pyetjet e shpeshta" },
      { href: "/terms", label: "Kushtet e përdorimit" },
      { href: "/search", label: "Kërko receta" },
      { href: "/contact", label: "Na kontakto" },
    ],
  },
  {
    title: "Llogaria",
    links: [
      { href: "/sign-in", label: "Kyçu" },
      { href: "/sign-up", label: "Regjistrohu" },
      { href: "/dashboard", label: "Paneli im" },
      { href: "/favorites", label: "Favoritet" },
    ],
  },
];

const socials = ["photo_camera", "public", "forum"];

// Stilizim me klasa utility të Tailwind; `rj-foot-grid` ruan responsive-in për tablet/mobile.
const Footer = () => {
  return (
    <footer className="bg-[var(--bg-2)] border-t border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto pt-[56px] px-[26px] pb-[30px]">
        <div className="rj-foot-grid grid grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10">
          <div>
            <div className="flex items-center gap-[10px]">
              <span className="grid place-items-center w-9 h-9 rounded-[11px] bg-[var(--accent)] text-white">
                <Icon name="skillet" size={21} fill={1} weight={500} />
              </span>
              <span className="font-serif font-semibold text-[21px] text-[var(--ink)]">
                Receta<span className="text-[var(--accent)]">Jote</span>
              </span>
            </div>
            <p className="mt-[15px] max-w-[280px] text-[14px] leading-[1.6] text-[var(--muted)]">
              Platforma jote për të zbuluar, ruajtur dhe ndarë receta të shijshme nga kuzhina shqiptare dhe më gjerë.
            </p>
            <div className="flex gap-[9px] mt-5">
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="rj-footlink grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-[var(--border-2)] bg-[var(--surface)] no-underline text-[var(--ink-2)]"
                >
                  <Icon name={s} size={19} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono mt-0 mb-[15px] text-[11px] font-medium tracking-[.14em] uppercase text-[var(--muted)]">
                {col.title}
              </h4>
              <ul className="m-0 p-0 list-none flex flex-col gap-[11px]">
                {col.links.map((l) => (
                  <li key={l.href} className="list-none">
                    <Link href={l.href} className="rj-footlink no-underline text-[14px] text-[var(--ink-2)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-[44px] pt-[22px] border-t border-[var(--border)] flex items-center justify-between gap-4 flex-wrap">
          <p className="m-0 text-[13px] text-[var(--muted)]">
            © {new Date().getFullYear()} RecetaJote — Të gjitha të drejtat e rezervuara.
          </p>
          <p className="font-mono m-0 text-[11.5px] text-[var(--muted)]">
            Ndërtuar në Prishtinë · me ❤ për ushqimin
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          :global(.rj-foot-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          :global(.rj-foot-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
