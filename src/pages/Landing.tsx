import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
  CalendarHeart,
  Wine,
  Coffee,
  Music,
  Compass,
  Star,
  Check,
  PlayCircle,
  Apple,
  Smartphone,
} from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";
import iconV3 from "@/assets/icon-v3-gradient.png";
import eventWine from "@/assets/event-wine.jpg";
import eventBoard from "@/assets/event-boardgames.jpg";
import eventCinema from "@/assets/event-cinema.jpg";
import eventRun from "@/assets/event-run.jpg";
import { AnimatedDemo } from "@/components/landing/AnimatedDemo";

/* ---------- helpers ---------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ---------- data ---------- */

const features = [
  {
    icon: Sparkles,
    title: "Вечера, а не свайпы",
    desc: "AI-конструктор соберёт маршрут на вечер: бар → ужин → крыша. Ты только подтверждаешь.",
    tone: "primary" as const,
  },
  {
    icon: Users,
    title: "Камерные встречи",
    desc: "Маленькие группы 4–8 человек по интересам и настроению — без анкет и давления.",
    tone: "secondary" as const,
  },
  {
    icon: MapPin,
    title: "Только рядом",
    desc: "Карта, фильтры по району и времени. Видишь только то, куда реально успеешь сегодня.",
    tone: "primary" as const,
  },
  {
    icon: MessageCircle,
    title: "Живой чат встречи",
    desc: "Голосовые, фото, реакции, шаги маршрута и общая геолокация — всё в одном месте.",
    tone: "secondary" as const,
  },
  {
    icon: ShieldCheck,
    title: "Безопасность по умолчанию",
    desc: "SOS, доверенные контакты, верификация и модерация. Спокойно — и тебе, и близким.",
    tone: "primary" as const,
  },
  {
    icon: CalendarHeart,
    title: "After Party и память",
    desc: "После встречи — общие фото, отметки, новые френды. Вечер не заканчивается в полночь.",
    tone: "secondary" as const,
  },
];

const flow = [
  {
    n: "01",
    title: "Открой Tonight",
    desc: "Лента вечеров на сегодня и ближайшие дни — подобрана под твой район и интересы.",
  },
  {
    n: "02",
    title: "Собери вечер",
    desc: "AI-конструктор предложит маршрут из 2–4 мест. Меняй перки, темп, бюджет.",
  },
  {
    n: "03",
    title: "Опубликуй встречу",
    desc: "Публично, по приглашению или для друзей. Чат подхватит участников.",
  },
  {
    n: "04",
    title: "Живи вечер",
    desc: "Live-таймлайн, чек-ин, голосовые. После — AfterParty с фото и контактами.",
  },
];

const eventCards = [
  { img: eventWine, title: "Винный вечер", meta: "Сегодня · 19:30 · Patriarshy", color: "primary" },
  { img: eventBoard, title: "Настолки", meta: "Сегодня · 20:00 · Hitzel", color: "secondary" },
  { img: eventCinema, title: "Кинопоказ", meta: "Завтра · 21:00 · Garage", color: "primary" },
  { img: eventRun, title: "Утренний забег", meta: "Сб · 08:00 · Парк Горького", color: "secondary" },
];

const testimonials = [
  {
    name: "Аня, 27",
    text: "За месяц 4 вечера и 2 настоящих друга. Это не Tinder — это про живых людей.",
  },
  {
    name: "Марк, 31",
    text: "AI-маршрут собрал идеальный вечер пятницы за 30 секунд. Я даже забыл про Google Maps.",
  },
  {
    name: "Лиза, 24",
    text: "Чувствую себя в безопасности: SOS, верификация, маленькие группы. Мама довольна 😅",
  },
];

const faq = [
  {
    q: "Это приложение для знакомств?",
    a: "И да, и нет. Frendly — про вечера и компанию. Кто-то находит друзей, кто-то — пару, кто-то — просто план на пятницу.",
  },
  {
    q: "Сколько стоит?",
    a: "Базовое использование бесплатно. Frendly+ открывает приватные вечера, расширенные фильтры и After Dark.",
  },
  {
    q: "А если я интроверт?",
    a: "Камерные группы 4–8 человек, готовые сценарии, чат до встречи — всё, чтобы было нестрашно зайти.",
  },
  {
    q: "Где сейчас работает?",
    a: "Запускаемся в Москве и Петербурге, дальше — Тбилиси, Алматы, Белград, Лиссабон.",
  },
];

/* ---------- page ---------- */
/* ---------- FeaturesShowcase: interactive chapter I ---------- */

const FeaturesShowcase = () => {
  const [active, setActive] = useState(0);
  const f = features[active];
  const Icon = f.icon;
  const tonePrimary = f.tone === "primary";

  return (
    <section id="features" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-4">
            <p className="lux-eyebrow">Глава I · Возможности</p>
            <div className="mt-3 w-12 lux-rule" />
          </div>
          <div className="md:col-span-8">
            <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
              Всё, чтобы вечер <em className="lux-h1-italic text-primary">случился</em> —
              без неловкости.
            </h2>
            <p className="mt-6 text-[15px] text-ink-soft max-w-[520px] leading-[1.7]">
              Шесть вещей, которые превращают «надо бы выбраться» в реальный план.
              Кликай — увидишь, как это выглядит в приложении.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-stretch">
        {/* LEFT: list */}
        <div className="md:col-span-7 border-t border-hairline">
          {features.map((feat, i) => {
            const isActive = i === active;
            const FIcon = feat.icon;
            return (
              <button
                key={feat.title}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`w-full text-left grid grid-cols-12 gap-4 items-start py-7 border-b border-hairline transition-all duration-500 ${
                  isActive ? "bg-paper-deep/50 px-3 -mx-3" : "hover:px-2 hover:-mx-2 hover:bg-paper-deep/25"
                }`}
              >
                <div className="col-span-2 md:col-span-1 lux-num text-[24px] md:text-[28px] text-ink-mute leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-1 hidden md:block">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? feat.tone === "primary"
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-secondary text-secondary-foreground scale-110"
                        : feat.tone === "primary"
                        ? "bg-primary-soft text-primary"
                        : "bg-secondary-soft text-secondary"
                    }`}
                  >
                    <FIcon className="w-4 h-4" strokeWidth={1.6} />
                  </div>
                </div>
                <div className="col-span-9 md:col-span-9">
                  <h3
                    className={`font-display text-[22px] md:text-[26px] tracking-tight leading-[1.1] transition-colors duration-300 ${
                      isActive ? "text-foreground" : "text-foreground/55"
                    }`}
                  >
                    {feat.title}
                  </h3>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isActive ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[14px] md:text-[15px] text-ink-soft leading-[1.65] font-light max-w-[480px]">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`hidden md:flex col-span-1 justify-end pt-2 transition-all duration-500 ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                >
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: animated preview */}
        <div className="md:col-span-5 sticky top-24 self-start hidden md:block">
          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-paper-deep border border-hairline shadow-paper">
            <div className="absolute inset-0 lux-paper opacity-80" />
            {/* corner ticks */}
            <span className="absolute top-3 left-3 w-3 h-px bg-foreground/30" />
            <span className="absolute top-3 left-3 h-3 w-px bg-foreground/30" />
            <span className="absolute top-3 right-3 w-3 h-px bg-foreground/30" />
            <span className="absolute top-3 right-3 h-3 w-px bg-foreground/30" />
            <span className="absolute bottom-3 left-3 w-3 h-px bg-foreground/30" />
            <span className="absolute bottom-3 left-3 h-3 w-px bg-foreground/30" />
            <span className="absolute bottom-3 right-3 w-3 h-px bg-foreground/30" />
            <span className="absolute bottom-3 right-3 h-3 w-px bg-foreground/30" />

            <div className="absolute top-5 left-5 lux-eyebrow text-[9px]">
              Frendly · Feature {String(active + 1).padStart(2, "0")} / 06
            </div>

            <div key={active} className="absolute inset-0 flex flex-col items-center justify-center px-10 animate-fade-in">
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 transition-all ${
                  tonePrimary
                    ? "bg-primary text-primary-foreground shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]"
                    : "bg-secondary text-secondary-foreground shadow-[0_20px_60px_-15px_hsl(var(--secondary)/0.5)]"
                }`}
              >
                <Icon className="w-12 h-12" strokeWidth={1.4} />
              </div>
              <p className="lux-eyebrow text-[10px] mb-3">{String(active + 1).padStart(2, "0")} / 06</p>
              <h4 className="font-display text-[28px] tracking-tight text-center leading-[1.05] max-w-[280px]">
                {f.title}
              </h4>
              <p className="mt-4 text-[14px] text-ink-soft text-center leading-[1.6] max-w-[300px] font-light">
                {f.desc}
              </p>
            </div>

            {/* progress dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {features.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === active ? "w-6 bg-foreground" : "w-1 bg-foreground/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Landing = () => {
  return (
    <main className="site-shell min-h-screen bg-paper text-foreground overflow-x-hidden font-sans-lux relative">
      {/* Paper texture base */}
      <div className="fixed inset-0 pointer-events-none -z-10 lux-paper" />

      {/* NAV — editorial */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-paper/80 border-b border-hairline/60">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={iconV5} alt="Frendly" className="w-8 h-8 rounded-[28%] transition-transform group-hover:rotate-3" />
            <span className="font-serif text-[20px] tracking-tight">Frendly</span>
            <span className="hidden md:inline-block ml-3 lux-eyebrow text-[9px]">Est. MMXXVI</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[13px] text-ink-soft tracking-wide">
            <a href="#features" className="lux-link hover:text-foreground transition-colors">Возможности</a>
            <a href="#how" className="lux-link hover:text-foreground transition-colors">Метод</a>
            <a href="#demo" className="lux-link hover:text-foreground transition-colors">Демо</a>
            <a href="#events" className="lux-link hover:text-foreground transition-colors">Вечера</a>
            <Link to="/partners" className="lux-link hover:text-foreground transition-colors">Партнёрам</Link>
            <a href="#faq" className="lux-link hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden lg:inline-flex items-center text-[12px] tracking-[0.18em] uppercase font-semibold text-ink-soft hover:text-foreground transition-colors lux-link"
            >
              Прототип
            </Link>
            <a
              href="#cta"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-[12px] font-semibold tracking-[0.14em] uppercase tap-fade hover:bg-ink-deep transition-colors"
            >
              Скачать <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO — Editorial Luxe */}
      <section className="relative overflow-hidden">
        {/* Soft warm wash */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full bg-primary/[0.08] blur-3xl" />
          <div className="absolute top-32 -right-40 w-[560px] h-[560px] rounded-full bg-secondary/[0.10] blur-3xl" />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 md:pt-14">
          {/* Issue line */}
          <div className="flex items-center justify-between gap-4 pb-5">
            <div className="flex items-center gap-3">
              <span className="lux-eyebrow">N° 01 · The Frendly Manifesto</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 lux-eyebrow text-[10px]">
              <span>Apr · MMXXVI</span>
              <span className="lux-divider-dot inline-block" />
              <span>Москва — Тбилиси — Лиссабон</span>
            </div>
          </div>
          <div className="lux-rule" />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 lux-eyebrow mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Уже в Москве и Петербурге
            </div>

            <h1 className="lux-h1 text-[48px] min-[390px]:text-[56px] sm:text-[84px] md:text-[112px] tracking-[-0.04em]">
              Знакомства
              <br />
              через <span className="lux-h1-italic text-primary">вечера</span>,
              <br />
              <span className="text-ink-mute/80">а не свайпы</span>.
            </h1>

            {/* small dedication */}
            <div className="mt-8 flex items-start gap-5 max-w-xl">
              <div className="w-10 lux-rule mt-3 shrink-0" />
              <p className="text-[16px] md:text-[17px] text-ink-soft leading-[1.6] font-light">
                Frendly собирает <em className="font-serif font-light text-foreground">камерные встречи</em> и AI-маршруты на вечер
                с людьми, которые рядом и в твоём настроении.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-foreground text-background text-[13px] font-semibold tracking-[0.14em] uppercase tap-fade hover:bg-ink-deep transition-colors shadow-paper"
              >
                <Apple className="w-4 h-4" /> App Store
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#cta"
                className="group inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-paper border border-foreground/15 text-[13px] font-semibold tracking-[0.14em] uppercase tap-fade hover:border-foreground/40 transition-colors"
              >
                <Smartphone className="w-4 h-4" /> Google Play
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 h-12 px-3 text-foreground text-[13px] tracking-wide lux-link"
              >
                <PlayCircle className="w-4 h-4 text-primary" /> Открыть прототип
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-5 text-[13px] text-ink-mute">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-paper shadow-soft"
                    style={{ background: `hsl(${(i * 60 + 10) % 360} 60% 70%)` }}
                  />
                ))}
              </div>
              <span className="font-light">
                <span className="font-serif text-foreground text-[18px] lux-num">12 400</span>
                <span className="ml-1.5">френдов уже собирают вечера</span>
              </span>
            </div>
          </div>

          {/* Phone mock — premium framed */}
          <div className="md:col-span-5 relative flex justify-center md:justify-end">
            <div className="relative">
              {/* corner ticks */}
              <span className="absolute -top-3 -left-3 w-6 h-6 border-l border-t border-foreground/40 z-10" />
              <span className="absolute -top-3 -right-3 w-6 h-6 border-r border-t border-foreground/40 z-10" />
              <span className="absolute -bottom-3 -left-3 w-6 h-6 border-l border-b border-foreground/40 z-10" />
              <span className="absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-foreground/40 z-10" />

              <div className="absolute inset-0 -z-10 translate-y-8 scale-95 bg-gradient-to-b from-primary/15 via-secondary/10 to-transparent blur-2xl" />

              <div className="w-[280px] h-[580px] rounded-[44px] bg-foreground p-3 phone-shadow-lux relative">
                <div className="w-full h-full rounded-[34px] bg-paper overflow-hidden relative lux-frame">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full z-10" />
                  <div className="pt-12 px-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="lux-eyebrow text-[9px]">Сегодня · 18:42</p>
                        <p className="font-serif text-[22px] tracking-tight">Tonight</p>
                      </div>
                      <img src={iconV5} className="w-9 h-9 rounded-[28%]" alt="" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { img: eventWine, t: "Винный вечер", m: "19:30 · 5/8" },
                        { img: eventBoard, t: "Настолки", m: "20:00 · 4/6" },
                        { img: eventCinema, t: "Кинопоказ", m: "21:00 · 7/10" },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-card border border-hairline overflow-hidden shadow-soft"
                          style={{
                            animation: "fade-in 0.5s ease-out backwards",
                            animationDelay: `${400 + i * 120}ms`,
                          }}
                        >
                          <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${c.img})` }} />
                          <div className="p-3">
                            <p className="font-serif text-[16px] leading-tight">{c.t}</p>
                            <p className="text-[11px] text-ink-mute mt-0.5 tracking-wide">{c.m}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating editorial chips */}
              <div
                className="absolute left-2 xl:-left-12 top-24 bg-paper border border-hairline rounded-full px-3.5 py-2 shadow-paper flex items-center gap-2 text-[11px] font-medium animate-fade-in tracking-wide"
                style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
              >
                <Wine className="w-3.5 h-3.5 text-primary" /> Вино рядом
              </div>
              <div
                className="absolute right-2 xl:-right-10 top-48 bg-paper border border-hairline rounded-full px-3.5 py-2 shadow-paper flex items-center gap-2 text-[11px] font-medium animate-fade-in tracking-wide"
                style={{ animationDelay: "900ms", animationFillMode: "backwards" }}
              >
                <Music className="w-3.5 h-3.5 text-secondary" /> +3 френда
              </div>
              <div
                className="absolute left-2 xl:-left-8 bottom-28 bg-paper border border-hairline rounded-full px-3.5 py-2 shadow-paper flex items-center gap-2 text-[11px] font-medium animate-fade-in tracking-wide"
                style={{ animationDelay: "1100ms", animationFillMode: "backwards" }}
              >
                <Coffee className="w-3.5 h-3.5 text-primary" /> Кофе утром
              </div>
            </div>
          </div>
        </div>

        {/* Marquee — города */}
        <div className="border-t border-b border-hairline/70 bg-paper-deep/40">
          <div className="lux-marquee py-5 font-serif font-light text-[26px] md:text-[34px] text-foreground/70">
            <div className="lux-marquee-track">
              {[
                "Москва", "Санкт-Петербург", "Тбилиси", "Алматы", "Белград", "Лиссабон",
                "Берлин", "Стамбул", "Ереван", "Дубай",
              ].concat([
                "Москва", "Санкт-Петербург", "Тбилиси", "Алматы", "Белград", "Лиссабон",
                "Берлин", "Стамбул", "Ереван", "Дубай",
              ]).map((c, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span className="tracking-tight">{c}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS — editorial scoreboard */}
      <section className="border-b border-hairline">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {[
            { k: "12 400", suf: "+", v: "активных френдов" },
            { k: "1 800", suf: "+", v: "вечеров в месяц" },
            { k: "4.8", suf: "★", v: "рейтинг в сторах" },
            { k: "92", suf: "%", v: "идут на 2-ю встречу" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 80} className="relative px-6 md:px-8">
              {i > 0 && <span className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-hairline" />}
              <p className="lux-num text-[56px] md:text-[68px] text-foreground leading-none">
                {s.k}
                <span className="text-primary text-[32px] align-top ml-1">{s.suf}</span>
              </p>
              <p className="lux-eyebrow text-[10px] mt-3">{s.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES — interactive showcase */}
      <FeaturesShowcase />

      {/* HOW IT WORKS — editorial method */}
      <section id="how" className="relative bg-paper-deep/60 border-y border-hairline overflow-hidden">
        <div className="absolute inset-0 -z-10 lux-paper opacity-60" />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
              <div className="md:col-span-4">
                <p className="lux-eyebrow">Глава II · Метод</p>
                <div className="mt-3 w-12 lux-rule" />
              </div>
              <div className="md:col-span-8">
                <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                  От «скучно»
                  <br /> до <em className="lux-h1-italic text-primary">«выходим»</em> —
                  четыре шага.
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline rounded-[24px] overflow-hidden">
            {flow.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="group relative bg-paper p-8 h-full hover:bg-paper-deep/60 transition-colors">
                  <p className="lux-num text-[64px] text-foreground/15 leading-none mb-6 group-hover:text-primary/40 transition-colors">
                    {step.n}
                  </p>
                  <div className="w-8 lux-rule mb-4" />
                  <h3 className="font-serif text-[22px] tracking-tight mb-3">{step.title}</h3>
                  <p className="text-[14px] text-ink-soft leading-[1.65] font-light">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMATED DEMO */}
      <AnimatedDemo />

      {/* EVENTS GALLERY — editorial gazette */}
      <section id="events" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 items-end">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава III · Вечера</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-6">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                То, что <em className="lux-h1-italic text-primary">случается</em>
                <br /> сегодня вечером.
              </h2>
            </div>
            <div className="md:col-span-2 md:text-right">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.18em] uppercase text-foreground lux-link"
              >
                Прототип <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline rounded-[24px] overflow-hidden">
          {eventCards.map((e, i) => (
            <Reveal key={e.title} delay={i * 90}>
              <div className="group relative bg-paper overflow-hidden h-full cursor-pointer transition-colors hover:bg-paper-deep/60">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/15 to-transparent" />
                  <div className="absolute top-4 left-4 lux-eyebrow text-[9px] text-paper/90">
                    N° {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-paper/90 backdrop-blur text-[10px] font-semibold tracking-[0.14em] uppercase text-foreground">
                    Сегодня
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-serif text-[22px] tracking-tight leading-[1.05]">{e.title}</p>
                  <p className="text-[12px] text-ink-mute mt-2 tracking-wide font-light">{e.meta}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[0, 1, 2].map((k) => (
                        <span
                          key={k}
                          className="w-5 h-5 rounded-full border-2 border-paper"
                          style={{ background: `hsl(${(k * 60 + i * 40) % 360} 55% 70%)` }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-foreground/70 lux-link font-medium tracking-wide">
                      Войти →
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AFTER DARK TEASE — cinematic editorial */}
      <section className="relative overflow-hidden border-y border-hairline">
        <div className="absolute inset-0" style={{ background: "var(--gradient-after-dark)" }} />
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full bg-[hsl(var(--ad-magenta))]/35 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[520px] h-[520px] rounded-full bg-[hsl(var(--ad-violet))]/30 blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[hsl(var(--ad-cyan))]/15 blur-3xl" />
        </div>
        {/* film grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.18]" style={{
          backgroundImage: "radial-gradient(hsl(0 0% 100% / 0.4) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }} />

        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36 text-[hsl(var(--ad-fg))] grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <Reveal>
              <p className="lux-eyebrow text-[10px] text-[hsl(var(--ad-fg-mute))] mb-5 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ad-magenta))] animate-pulse" />
                Глава IV · After Dark · 18+
              </p>
              <h2 className="lux-h1 text-[52px] md:text-[88px] tracking-[-0.04em]">
                Когда город
                <br />
                <em className="lux-h1-italic" style={{
                  background: "var(--gradient-neon)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>просыпается</em> ночью.
              </h2>
              <div className="mt-8 flex items-start gap-5 max-w-xl">
                <div className="w-10 h-px bg-[hsl(var(--ad-fg-mute))] mt-3 shrink-0" />
                <p className="text-[16px] text-[hsl(var(--ad-fg-soft))] leading-[1.65] font-light">
                  Закрытый режим: kink-friendly события, swing-вечера, приватные клубы и ночные афтепати.
                  Только верифицированные френды, NDA, кодекс согласия.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#cta"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-[12px] font-semibold tracking-[0.18em] uppercase text-white transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "var(--gradient-neon)",
                    boxShadow: "var(--shadow-neon)",
                  }}
                >
                  Открыть After Dark <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--ad-fg-mute))]">
                  Только Frendly+ · 18+
                </span>
              </div>
            </Reveal>
          </div>

          {/* manifesto card */}
          <Reveal delay={140} className="md:col-span-5">
            <div className="relative rounded-[28px] p-7 backdrop-blur-xl border" style={{
              background: "hsl(var(--ad-surface) / 0.55)",
              borderColor: "hsl(var(--ad-border))",
            }}>
              <p className="lux-eyebrow text-[9px] text-[hsl(var(--ad-fg-mute))]">The After Dark Code</p>
              <div className="mt-3 w-8 h-px bg-[hsl(var(--ad-magenta))]" />
              <ul className="mt-6 space-y-5 text-[14px] text-[hsl(var(--ad-fg-soft))] font-light leading-snug">
                {[
                  ["Consent first", "Любое действие — только по обоюдному «да»."],
                  ["No photos", "Камеры выключены. Что в зале — остаётся в зале."],
                  ["Verified only", "Документы и видеоселфи. Анонимы не входят."],
                  ["Safety crew", "Дежурная команда и SOS в один тап."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <span className="font-serif font-light text-[hsl(var(--ad-magenta))] text-[18px] leading-none mt-0.5">·</span>
                    <div>
                      <p className="font-serif text-[hsl(var(--ad-fg))] text-[17px] tracking-tight">{t}</p>
                      <p className="text-[12.5px] text-[hsl(var(--ad-fg-mute))] mt-1">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS — editorial pull-quotes */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава V · Голоса</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-8">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                Тёплые отзывы —
                <br /> как тёплые <em className="lux-h1-italic text-primary">вечера</em>.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-[24px] overflow-hidden">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="h-full bg-paper p-8 md:p-10 flex flex-col">
                <span className="font-serif font-light text-[80px] leading-none text-primary/30 -mt-2">“</span>
                <p className="font-serif text-[22px] leading-[1.35] tracking-tight text-foreground -mt-6">
                  {t.text}
                </p>
                <div className="mt-auto pt-8">
                  <div className="lux-rule mb-4" />
                  <div className="flex items-center justify-between">
                    <p className="lux-eyebrow text-[10px]">{t.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING — editorial price card */}
      <section className="bg-paper-deep/60 border-y border-hairline relative">
        <div className="absolute inset-0 lux-paper opacity-50 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36 relative">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
              <div className="md:col-span-4">
                <p className="lux-eyebrow">Глава VI · Цены</p>
                <div className="mt-3 w-12 lux-rule" />
              </div>
              <div className="md:col-span-8">
                <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                  Старт <em className="lux-h1-italic text-primary">бесплатный</em>.
                  <br /> Frendly+ — когда захочется большего.
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline rounded-[28px] overflow-hidden max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-paper p-10 h-full flex flex-col">
                <p className="lux-eyebrow">Free</p>
                <div className="mt-3 w-8 lux-rule" />
                <p className="mt-6 font-serif text-[22px] tracking-tight">Чтобы попробовать вечер</p>
                <p className="lux-num text-[88px] mt-6 leading-none">0<span className="text-[28px] text-ink-mute ml-2 font-light">₽</span></p>
                <ul className="mt-8 space-y-3 text-[14px] text-ink-soft font-light">
                  {[
                    "Лента Tonight и публичные вечера",
                    "Базовые фильтры и карта",
                    "Чаты встреч и личные",
                    "SOS и доверенные контакты",
                  ].map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative bg-ink-deep text-paper p-10 h-full flex flex-col" style={{ background: "var(--gradient-ink)" }}>
                <div className="absolute top-6 right-6 lux-eyebrow text-[9px] text-primary">
                  Editor's choice
                </div>
                <p className="lux-eyebrow text-paper/70">Frendly+</p>
                <div className="mt-3 w-8 h-px bg-primary" />
                <p className="mt-6 font-serif text-[22px] tracking-tight">Полный город в кармане</p>
                <p className="lux-num text-[88px] mt-6 leading-none">490
                  <span className="text-[28px] text-paper/60 ml-2 font-light">₽ / мес</span>
                </p>
                <p className="text-[12px] text-paper/50 mt-2 tracking-wide">Первая неделя бесплатно</p>
                <ul className="mt-8 space-y-3 text-[14px] text-paper/85 font-light">
                  {[
                    "Приватные вечера и закрытые круги",
                    "AI-конструктор Premium с перками",
                    "After Dark · ночные события 18+",
                    "Расширенные фильтры и приоритет",
                    "Без рекламы и лимитов",
                  ].map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ — editorial Q&A */}
      <section id="faq" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава VII · FAQ</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-8">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                Частые <em className="lux-h1-italic text-primary">вопросы</em>.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="border-t border-hairline max-w-3xl mx-auto md:mx-0 md:ml-[33.333%]">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="group border-b border-hairline py-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex justify-between items-start gap-6">
                  <div className="flex gap-5">
                    <span className="lux-num text-[18px] text-ink-mute leading-none mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[22px] md:text-[26px] tracking-tight leading-[1.2]">
                      {item.q}
                    </span>
                  </div>
                  <span className="ml-4 w-9 h-9 rounded-full border border-hairline flex items-center justify-center group-open:bg-foreground group-open:text-background group-open:rotate-45 transition-all text-foreground shrink-0 mt-1">
                    +
                  </span>
                </summary>
                <p className="mt-4 ml-11 text-[15px] text-ink-soft leading-[1.7] font-light max-w-2xl">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA — editorial cover */}
      <section id="cta" className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-28 md:pb-36">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-hairline bg-paper-deep">
            <div className="absolute inset-0 lux-paper opacity-70" />
            <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative px-5 sm:px-8 md:px-16 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-7">
                <p className="lux-eyebrow mb-6">Issue No. 01 · Cover</p>
                <h2 className="lux-h1 text-[40px] min-[390px]:text-[48px] md:text-[88px] tracking-[-0.04em]">
                  Сегодня вечером —
                  <br /> кто-то уже собирает
                  <br /> вечер для <em className="lux-h1-italic text-primary">тебя</em>.
                </h2>
              </div>

              <div className="md:col-span-5 md:pl-10 md:border-l border-hairline">
                <img src={iconV3} alt="" className="w-16 h-16 mb-6 rounded-[28%] shadow-paper" />
                <p className="text-[16px] text-ink-soft leading-[1.65] font-light max-w-sm">
                  Установи Frendly и присоединяйся к первой встрече за пару минут.
                  Без анкет, без давления, без свайпов.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-foreground text-background text-[12px] font-semibold tracking-[0.16em] uppercase tap-fade hover:bg-ink-deep transition-colors">
                    <Apple className="w-4 h-4" /> App Store
                  </a>
                  <a className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-paper border border-foreground/15 text-[12px] font-semibold tracking-[0.16em] uppercase tap-fade hover:border-foreground/40">
                    <Smartphone className="w-4 h-4" /> Google Play
                  </a>
                </div>
                <p className="mt-6 lux-eyebrow text-[9px]">
                  4.8 ★ · 12 400+ френдов · App Store Editor's Pick
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER — editorial colophon */}
      <footer className="border-t border-hairline">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-hairline">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <img src={iconV5} alt="Frendly" className="w-9 h-9 rounded-[28%]" />
                <span className="font-serif font-light text-[22px] tracking-tight">Frendly</span>
              </div>
              <p className="font-serif font-light text-[20px] md:text-[24px] leading-[1.3] text-foreground/85 max-w-md tracking-tight">
                «Вечера, а не свайпы. Камерные встречи в твоём городе — каждый вечер.»
              </p>
              <p className="lux-eyebrow text-[10px] mt-6">
                Est. MMXXVI · Made in Москва · Тбилиси
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="lux-eyebrow text-[10px] mb-5">Продукт</p>
              <ul className="space-y-3 text-[13px] text-ink-soft font-light">
                <li><a href="#features" className="lux-link hover:text-foreground">Возможности</a></li>
                <li><a href="#how" className="lux-link hover:text-foreground">Как работает</a></li>
                <li><Link to="/partners" className="lux-link hover:text-foreground">Партнёрам</Link></li>
                <li><Link to="/" className="lux-link hover:text-foreground">Прототип</Link></li>
                <li><Link to="/admin" className="lux-link hover:text-foreground">Админка</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <p className="lux-eyebrow text-[10px] mb-5">Города</p>
              <ul className="space-y-3 text-[13px] text-ink-soft font-light">
                <li className="flex items-center gap-1.5"><Compass className="w-3 h-3" /> Москва</li>
                <li className="flex items-center gap-1.5"><Compass className="w-3 h-3" /> Санкт-Петербург</li>
                <li className="text-ink-mute/70">Скоро: Тбилиси, Алматы, Белград</li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <p className="lux-eyebrow text-[10px] mb-5">Подписаться на письма</p>
              <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">
                Раз в неделю — лучшие вечера твоего города и редакторские подборки.
              </p>
              <form className="flex flex-wrap gap-2 border-b border-foreground/40 pb-1" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="ты@example.com"
                  className="min-w-0 flex-[1_1_150px] bg-transparent text-[13px] outline-none placeholder:text-ink-mute/60 py-1"
                />
                <button className="lux-link text-[12px] uppercase tracking-[0.16em] font-semibold">
                  Подписаться
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap justify-between items-center gap-3 text-[11px] text-ink-mute tracking-wide">
            <p>© MMXXVI Frendly. Все права защищены.</p>
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <a href="#" className="lux-link hover:text-foreground">Условия</a>
              <a href="#" className="lux-link hover:text-foreground">Приватность</a>
              <a href="#" className="lux-link hover:text-foreground">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
