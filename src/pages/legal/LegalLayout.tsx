import { Link, NavLink } from "react-router-dom";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";
import { companyDetails, legalDocuments } from "./legalContent";

type LegalLayoutProps = {
  children: React.ReactNode;
};

export const LegalLayout = ({ children }: LegalLayoutProps) => (
  <main className="site-shell min-h-screen bg-paper text-foreground overflow-x-hidden font-sans-lux relative">
    <div className="fixed inset-0 pointer-events-none -z-10 lux-paper" />

    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-paper/85 border-b border-hairline/60">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={iconV5} alt="Frendly" className="w-8 h-8 rounded-[28%] transition-transform group-hover:rotate-3" />
          <span className="font-serif text-[20px] tracking-tight">Frendly</span>
          <span className="hidden md:inline-block ml-3 lux-eyebrow text-[9px]">Legal</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase font-semibold text-ink-soft hover:text-foreground transition-colors lux-link"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          На главную
        </Link>
      </div>
    </nav>

    <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <p className="lux-eyebrow text-[10px] mb-5">Документы</p>
            <div className="space-y-2">
              <NavLink
                to="/legal"
                end
                className={({ isActive }) =>
                  `block border-b border-hairline py-3 text-[14px] transition-colors ${
                    isActive ? "text-foreground" : "text-ink-soft hover:text-foreground"
                  }`
                }
              >
                Реквизиты
              </NavLink>
              {legalDocuments.map((document) => (
                <NavLink
                  key={document.slug}
                  to={`/legal/${document.slug}`}
                  className={({ isActive }) =>
                    `block border-b border-hairline py-3 text-[14px] transition-colors ${
                      isActive ? "text-foreground" : "text-ink-soft hover:text-foreground"
                    }`
                  }
                >
                  {document.shortTitle}
                </NavLink>
              ))}
            </div>

            <div className="mt-10 border border-hairline bg-paper/60 p-5 shadow-soft">
              <p className="lux-eyebrow text-[9px] mb-4">Контакты</p>
              <div className="space-y-3 text-[13px] text-ink-soft leading-relaxed">
                <a href={`mailto:${companyDetails.email}`} className="flex items-center gap-2 lux-link hover:text-foreground">
                  <Mail className="w-4 h-4" />
                  {companyDetails.email}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {companyDetails.address}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">{children}</section>
      </div>
    </div>
  </main>
);
