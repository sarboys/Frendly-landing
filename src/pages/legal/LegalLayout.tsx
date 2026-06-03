import { Link, NavLink } from "react-router-dom";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { companyDetails, legalDocuments } from "./legalContent";

type LegalLayoutProps = {
  children: React.ReactNode;
};

export const LegalLayout = ({ children }: LegalLayoutProps) => (
  <main className="landing-theme site-shell min-h-screen w-full bg-hero text-foreground overflow-x-hidden">
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-40 -left-32 size-[36rem] rounded-full bg-lime-gradient opacity-20 blur-[120px]" />
      <div className="absolute top-1/4 -right-40 size-[34rem] rounded-full bg-pink-gradient opacity-20 blur-[120px]" />
      <div
        className="absolute bottom-0 left-1/4 size-[28rem] rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.18 305), transparent 70%)" }}
      />
    </div>

    <header className="relative z-30 sticky top-0">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-4 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="glass border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-soft"
        >
          <Logo size="sm" />
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-muted-foreground pl-2 border-l border-white/10">
            Legal
          </span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-foreground/90 hover:bg-white/10 transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          На главную
        </Link>
      </div>
    </header>

    <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10 pt-10 pb-20 lg:pt-16">
      <div className="mb-10 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>N° Legal · Frendly</span>
        <span className="hidden sm:inline">Условия · Оферта · ПДн · Оплата</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <div className="glass border border-white/10 rounded-[2rem] p-4 shadow-soft">
              <p className="px-3 pb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Документы
              </p>
              <div className="lg:max-h-[calc(100vh-13rem)] lg:overflow-y-auto lg:pr-1">
                <NavLink
                  to="/legal"
                  end
                  className={({ isActive }) =>
                    `block rounded-2xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-lime-gradient text-lime-foreground font-bold shadow-glow"
                        : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
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
                      `mt-1 block rounded-2xl px-3 py-2.5 text-sm leading-tight transition ${
                        isActive
                          ? "bg-lime-gradient text-lime-foreground font-bold shadow-glow"
                          : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`
                    }
                  >
                    {document.shortTitle}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="mt-4 glass border border-white/10 rounded-[2rem] p-5 shadow-soft">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                Поддержка
              </p>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <a
                  href={`mailto:${companyDetails.email}`}
                  className="flex items-center gap-2 hover:text-foreground transition"
                >
                  <Mail className="size-4 text-lime" />
                  {companyDetails.email}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="size-4 mt-0.5 shrink-0 text-lime" />
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
