import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Store,
  Ticket,
  Megaphone,
  TrendingUp,
  BarChart3,
  Sparkles,
  Calendar,
  MapPin,
  Wine,
  Coffee,
  Music,
  Camera,
  Check,
  Building2,
  Handshake,
  Zap,
  CreditCard,
  ChevronRight,
  PartyPopper,
} from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";
import eventWine from "@/assets/event-wine.jpg";
import eventBoard from "@/assets/event-boardgames.jpg";
import eventCinema from "@/assets/event-cinema.jpg";

/* ---------- reveal ---------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          o.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
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
  const { ref, v } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Counter = ({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) => {
  const { ref, v } = useReveal<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!v) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v, to, duration]);
  return (
    <span ref={ref}>
      {val.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
};

/* ---------- data ---------- */

const opportunities = [
  { icon: Store, title: "Подключить заведение", desc: "Бар, кофейня, ресторан, студия, шоу-рум — всё, куда ходят на вечера. Своя карточка, фото, меню, перки." },
  { icon: Ticket, title: "Запускать акции и перки", desc: "Скидка 20% на первый бокал, бесплатный десерт компании из 4+, секретное меню для Frendly+. Активация в один тап." },
  { icon: Calendar, title: "Свои мероприятия", desc: "Дегустации, концерты, мастер-классы, поэтические вечера. AI включит их в маршруты пользователей." },
  { icon: Megaphone, title: "Продвижение в ленте", desc: "Закреп в районе, баннер в After Dark, push-кампании. Платишь за реальные посещения, а не за клики." },
  { icon: Sparkles, title: "AI-маршруты", desc: "Когда AI собирает вечер — твоё место может стать пунктом #2 или #3. Приоритет по гео, тегам и окнам." },
  { icon: BarChart3, title: "Аналитика и кассовый эффект", desc: "Сколько френдов пришло, средний чек, повторные визиты, демография. Дашборд + еженедельный отчёт." },
];

const flow = [
  { n: "01", t: "Заявка за 2 минуты", d: "Заполняешь форму — мы отвечаем в течение суток." },
  { n: "02", t: "Верификация и онбординг", d: "Проверяем заведение, помогаем оформить карточку и первую акцию." },
  { n: "03", t: "Запуск в ленте", d: "Карточка появляется в Tonight и в AI-маршрутах твоего района." },
  { n: "04", t: "Растёшь по данным", d: "Смотришь аналитику, тестируешь перки, масштабируешь то, что работает." },
];

const cases = [
  { name: "Bar Strelka", type: "Винный бар · Москва", img: eventWine, metric: "+38%", metricLabel: "выручки в будни", quote: "Frendly закрыл нам понедельники и вторники. Теперь это лучшие дни недели.", author: "Артём, управляющий" },
  { name: "Hitzel", type: "Игротека · Санкт-Петербург", img: eventBoard, metric: "×2.4", metricLabel: "новых гостей в месяц", quote: "Через перк «бесплатная партия для компании 4+» к нам пришло 600 новых лиц за 8 недель.", author: "Катя, основатель" },
  { name: "Garage Cinema", type: "Кинопоказы · Москва", img: eventCinema, metric: "92%", metricLabel: "заполняемость залов", quote: "Перестали покупать рекламу. Френды сами собирают компании и выкупают сеансы.", author: "Денис, программный директор" },
];

const tariffs = [
  { name: "Старт", price: "0 ₽", sub: "Бесплатно навсегда", desc: "Чтобы попробовать и оценить поток.", features: ["Карточка заведения", "До 2 акций / перков", "1 событие в месяц", "Базовая аналитика", "Появление в ленте по геолокации"], cta: "Начать бесплатно", accent: false },
  { name: "Партнёр", price: "9 900 ₽", sub: "в месяц", desc: "Для активных мест и регулярных событий.", features: ["Безлимит акций и перков", "Безлимит событий", "Приоритет в AI-маршрутах", "Push-кампании по интересам", "Расширенная аналитика и когорты", "Менеджер поддержки"], cta: "Стать партнёром", accent: true, badge: "Editor's choice" },
  { name: "Сеть", price: "Договорная", sub: "от 5 локаций", desc: "Для сетей, фестивалей и крупных площадок.", features: ["Всё из «Партнёр»", "Мультилокационный кабинет", "Интеграция с CRM / iiko / Poster", "Брендированные коллекции", "Совместные кампании", "API и выгрузки"], cta: "Поговорить", accent: false },
];

const faq = [
  { q: "Сколько стоит привлечение одного гостя?", a: "В среднем 80–180 ₽ на тарифе «Партнёр» против 400–900 ₽ через таргет. Платишь только за реальные посещения, отслеженные через чек-ин." },
  { q: "Как вы считаете, что гость пришёл от Frendly?", a: "Через QR-чек-ин в приложении, активацию перка на кассе и интеграцию с системой учёта. Никаких догадок — только подтверждённые визиты." },
  { q: "Можем ли мы устраивать закрытые события?", a: "Да. Закрытые вечера для Frendly+ или по приглашению, с лимитом мест и предоплатой — всё настраивается из кабинета партнёра." },
  { q: "Какие требования к заведению?", a: "Лицензия, опрятный профиль в соцсетях, понятный сервис. Мы не пускаем места с плохими отзывами и токсичной репутацией — это вопрос безопасности френдов." },
  { q: "Когда придут первые гости?", a: "Обычно в первые 7–10 дней после публикации карточки. Если запускаешь акцию или событие — часто в тот же вечер." },
];

/* ---------- page ---------- */

const Partners = () => {
  return (
    <main className="site-shell min-h-screen bg-paper text-foreground overflow-x-hidden font-sans-lux relative">
      <div className="fixed inset-0 pointer-events-none -z-10 lux-paper" />

      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-paper/80 border-b border-hairline/60">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={iconV5} alt="Frendly" className="w-8 h-8 rounded-[28%] transition-transform group-hover:rotate-3" />
            <span className="font-serif text-[20px] tracking-tight">Frendly</span>
            <span className="hidden md:inline-block ml-3 lux-eyebrow text-[9px]">Partners · Vol. I</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[13px] text-ink-soft tracking-wide">
            <a href="#why" className="lux-link hover:text-foreground transition-colors">Возможности</a>
            <a href="#how" className="lux-link hover:text-foreground transition-colors">Метод</a>
            <a href="#cases" className="lux-link hover:text-foreground transition-colors">Кейсы</a>
            <a href="#pricing" className="lux-link hover:text-foreground transition-colors">Тарифы</a>
            <a href="#faq" className="lux-link hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden lg:inline-flex items-center text-[12px] tracking-[0.18em] uppercase font-semibold text-ink-soft hover:text-foreground transition-colors lux-link"
            >
              Для пользователей
            </Link>
            <a
              href="#apply"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-[12px] font-semibold tracking-[0.14em] uppercase tap-fade hover:bg-ink-deep transition-colors"
            >
              Заявка <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full bg-secondary/[0.10] blur-3xl" />
          <div className="absolute top-32 -right-40 w-[560px] h-[560px] rounded-full bg-primary/[0.08] blur-3xl" />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 md:pt-14">
          <div className="flex items-center justify-between gap-4 pb-5">
            <span className="lux-eyebrow">N° 02 · Frendly for Business</span>
            <div className="hidden sm:flex items-center gap-3 lux-eyebrow text-[10px]">
              <span>Apr · MMXXVI</span>
              <span className="lux-divider-dot inline-block" />
              <span>240+ заведений · 12 400+ френдов</span>
            </div>
          </div>
          <div className="lux-rule" />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 lux-eyebrow mb-7">
              <Handshake className="w-3.5 h-3.5 text-secondary" />
              Партнёрская программа
            </div>

            <h1 className="lux-h1 text-[48px] min-[390px]:text-[56px] sm:text-[84px] md:text-[112px] tracking-[-0.04em]">
              Город,
              <br /> который
              <br /> приходит <span className="lux-h1-italic text-secondary">сам</span>.
            </h1>

            <div className="mt-8 flex items-start gap-5 max-w-xl">
              <div className="w-10 lux-rule mt-3 shrink-0" />
              <p className="text-[16px] md:text-[17px] text-ink-soft leading-[1.6] font-light">
                Подключи заведение к Frendly — и пусть тысячи френдов сегодня вечером
                <em className="font-serif font-light text-foreground"> соберут компанию</em> и придут к тебе.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#apply"
                className="group inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-foreground text-background text-[12px] font-semibold tracking-[0.16em] uppercase tap-fade hover:bg-ink-deep transition-colors shadow-paper"
              >
                Стать партнёром
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#cases"
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-paper border border-foreground/15 text-[12px] font-semibold tracking-[0.16em] uppercase tap-fade hover:border-foreground/40 transition-colors"
              >
                Посмотреть кейсы
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 max-w-md gap-x-10">
              <div>
                <p className="lux-num text-[42px] leading-none">240<span className="text-primary text-[24px] align-top ml-1">+</span></p>
                <p className="lux-eyebrow text-[10px] mt-2">заведений на платформе</p>
              </div>
              <div className="border-l border-hairline pl-6">
                <p className="lux-num text-[42px] leading-none">12 400<span className="text-primary text-[24px] align-top ml-1">+</span></p>
                <p className="lux-eyebrow text-[10px] mt-2">активных френдов</p>
              </div>
            </div>
          </div>

          {/* Right — partner dashboard mock framed */}
          <div className="md:col-span-5 relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <span className="absolute -top-3 -left-3 w-6 h-6 border-l border-t border-foreground/40 z-10" />
              <span className="absolute -top-3 -right-3 w-6 h-6 border-r border-t border-foreground/40 z-10" />
              <span className="absolute -bottom-3 -left-3 w-6 h-6 border-l border-b border-foreground/40 z-10" />
              <span className="absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-foreground/40 z-10" />

              <div className="absolute inset-0 -z-10 translate-y-8 scale-95 bg-gradient-to-b from-secondary/15 via-primary/10 to-transparent blur-2xl" />

              <div className="bg-paper rounded-[28px] border border-hairline p-6 shadow-paper relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                    <Wine className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[18px] tracking-tight">Bar Strelka</p>
                    <p className="text-[11px] text-ink-mute flex items-center gap-1 tracking-wide">
                      <MapPin className="w-3 h-3" /> Patriarshy · 0.3 km
                    </p>
                  </div>
                  <span className="lux-eyebrow text-[9px] text-secondary">Партнёр</span>
                </div>

                <div className="lux-rule mb-5" />

                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { l: "Сегодня", v: "47", s: "гостей" },
                    { l: "Перков", v: "12", s: "активаций" },
                    { l: "Чек", v: "+18%", s: "к среднему" },
                  ].map((m) => (
                    <div key={m.l} className="text-center">
                      <p className="lux-eyebrow text-[8px]">{m.l}</p>
                      <p className="lux-num text-[28px] text-primary mt-1">{m.v}</p>
                      <p className="text-[10px] text-ink-mute mt-0.5">{m.s}</p>
                    </div>
                  ))}
                </div>

                <div className="lux-rule mb-4" />

                <p className="lux-eyebrow text-[9px] mb-3">Активные перки</p>
                <div className="space-y-2.5">
                  {[
                    { t: "Бокал натурального вина в подарок", c: "4+ человек" },
                    { t: "−20% на первый раунд", c: "Frendly+" },
                  ].map((p) => (
                    <div key={p.t} className="flex items-center gap-3 text-[12.5px]">
                      <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                        <Ticket className="w-3 h-3 text-primary" />
                      </div>
                      <span className="flex-1 truncate font-light">{p.t}</span>
                      <span className="lux-eyebrow text-[8px]">{p.c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="absolute left-2 xl:-left-10 -bottom-5 bg-foreground text-background rounded-2xl px-4 py-2.5 shadow-paper flex items-center gap-2 max-w-[240px] animate-fade-in"
                style={{ animationDelay: "600ms", animationFillMode: "backwards" }}
              >
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <PartyPopper className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11.5px] leading-tight">
                  <p className="font-semibold">+5 френдов идут к тебе</p>
                  <p className="opacity-70 text-[10px] tracking-wide">Винный вечер · 19:30</p>
                </div>
              </div>

              <div
                className="absolute right-2 xl:-right-6 -top-5 bg-paper border border-hairline rounded-full px-3.5 py-2 shadow-paper flex items-center gap-2 text-[11px] font-medium animate-fade-in tracking-wide"
                style={{ animationDelay: "800ms", animationFillMode: "backwards" }}
              >
                <Zap className="w-3.5 h-3.5 text-primary" /> Live · 4 стола
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — editorial scoreboard */}
      <section className="border-y border-hairline">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {[
            { v: <Counter to={240} />, suf: "+", l: "заведений-партнёров" },
            { v: <Counter to={1800} />, suf: "+", l: "вечеров в месяц" },
            { v: <Counter to={62} />, suf: "%", l: "возвращаются повторно" },
            { v: <span>×<Counter to={3} />,4</span>, suf: "", l: "ROI vs таргет" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80} className="relative px-6 md:px-8">
              {i > 0 && <span className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-hairline" />}
              <p className="lux-num text-[56px] md:text-[68px] text-foreground leading-none">
                {s.v}
                {s.suf && <span className="text-secondary text-[32px] align-top ml-1">{s.suf}</span>}
              </p>
              <p className="lux-eyebrow text-[10px] mt-3">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY / OPPORTUNITIES — editorial chapters */}
      <section id="why" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава I · Возможности</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-8">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                Что ты получаешь, став <em className="lux-h1-italic text-secondary">партнёром</em>.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="border-t border-hairline">
          {opportunities.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start py-10 border-b border-hairline hover:bg-paper-deep/40 transition-colors px-2 -mx-2">
                <div className="md:col-span-1 lux-num text-[28px] text-ink-mute leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-1">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-secondary-soft text-secondary transition-transform group-hover:scale-110">
                    <f.icon className="w-4 h-4" strokeWidth={1.6} />
                  </div>
                </div>
                <h3 className="md:col-span-4 font-serif text-[26px] md:text-[30px] tracking-tight leading-[1.05]">
                  {f.title}
                </h3>
                <p className="md:col-span-5 md:col-start-8 text-[15px] text-ink-soft leading-[1.7] font-light">
                  {f.desc}
                </p>
                <div className="md:col-span-1 hidden md:flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW — editorial method */}
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
                  От заявки
                  <br /> до первых <em className="lux-h1-italic text-secondary">гостей</em> —
                  за неделю.
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline rounded-[24px] overflow-hidden">
            {flow.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="group relative bg-paper p-8 h-full hover:bg-paper-deep/60 transition-colors">
                  <p className="lux-num text-[64px] text-foreground/15 leading-none mb-6 group-hover:text-secondary/40 transition-colors">
                    {s.n}
                  </p>
                  <div className="w-8 lux-rule mb-4" />
                  <h3 className="font-serif text-[22px] tracking-tight mb-3">{s.t}</h3>
                  <p className="text-[14px] text-ink-soft leading-[1.65] font-light">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CASES — gazette */}
      <section id="cases" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава III · Кейсы</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-8">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                Они уже <em className="lux-h1-italic text-secondary">растут</em>
                <br /> с Frendly.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-[24px] overflow-hidden">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <div className="group bg-paper h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-transparent" />
                  <div className="absolute top-4 left-4 lux-eyebrow text-[9px] text-paper/90">
                    Case N° {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 text-paper">
                    <p className="font-serif text-[24px] tracking-tight leading-tight">{c.name}</p>
                    <p className="text-[11px] opacity-80 tracking-wide mt-0.5">{c.type}</p>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-baseline gap-3 mb-5">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <p className="lux-num text-[36px] leading-none text-foreground">{c.metric}</p>
                    <p className="lux-eyebrow text-[9px]">{c.metricLabel}</p>
                  </div>
                  <div className="lux-rule mb-5" />
                  <p className="font-serif font-light text-[16px] leading-[1.45] text-foreground/85">«{c.quote}»</p>
                  <p className="mt-auto pt-5 lux-eyebrow text-[10px]">— {c.author}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TYPES — editorial directory */}
      <section className="bg-paper-deep/60 border-y border-hairline relative">
        <div className="absolute inset-0 lux-paper opacity-50 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-24 relative">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
              <div className="md:col-span-4">
                <p className="lux-eyebrow">Глава IV · Кому подходит</p>
                <div className="mt-3 w-12 lux-rule" />
              </div>
              <div className="md:col-span-8">
                <h2 className="lux-h1 text-[36px] md:text-[52px] tracking-[-0.035em]">
                  Любому месту, где случается <em className="lux-h1-italic text-secondary">вечер</em>.
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline rounded-[20px] overflow-hidden">
            {[
              { i: Wine, t: "Бары и винотеки" },
              { i: Coffee, t: "Кофейни и пекарни" },
              { i: Music, t: "Клубы и лайв-сцены" },
              { i: Camera, t: "Студии и шоурумы" },
              { i: Building2, t: "Рестораны" },
              { i: Ticket, t: "Театры и кино" },
              { i: Calendar, t: "Фестивали и ивенты" },
              { i: Sparkles, t: "Мастер-классы" },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 50}>
                <div className="bg-paper p-6 flex items-center gap-4 h-full hover:bg-paper-deep/60 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary-soft text-secondary flex items-center justify-center shrink-0">
                    <c.i className="w-4 h-4" strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="lux-eyebrow text-[8px]">N° {String(i + 1).padStart(2, "0")}</p>
                    <p className="font-serif text-[17px] tracking-tight mt-0.5">{c.t}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — editorial price card */}
      <section id="pricing" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="lux-eyebrow">Глава V · Тарифы</p>
              <div className="mt-3 w-12 lux-rule" />
            </div>
            <div className="md:col-span-8">
              <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                Старт <em className="lux-h1-italic text-secondary">бесплатный</em>.
                <br /> Платишь, когда видишь поток.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-[28px] overflow-hidden">
          {tariffs.map((t) => (
            <Reveal key={t.name}>
              <div
                className={`relative h-full p-10 flex flex-col ${
                  t.accent ? "text-paper" : "bg-paper"
                }`}
                style={t.accent ? { background: "var(--gradient-ink)" } : undefined}
              >
                {t.badge && (
                  <div className={`absolute top-6 right-6 lux-eyebrow text-[9px] ${t.accent ? "text-primary" : "text-secondary"}`}>
                    {t.badge}
                  </div>
                )}
                <p className={`lux-eyebrow ${t.accent ? "text-paper/70" : ""}`}>{t.name}</p>
                <div className={`mt-3 w-8 h-px ${t.accent ? "bg-primary" : "bg-secondary"}`} />
                <p className={`mt-6 font-serif text-[20px] tracking-tight ${t.accent ? "font-light" : ""}`}>{t.desc}</p>
                <p className="lux-num text-[64px] mt-6 leading-none">
                  {t.price}
                </p>
                <p className={`text-[12px] mt-2 tracking-wide ${t.accent ? "text-paper/60" : "text-ink-mute"}`}>{t.sub}</p>

                <ul className={`mt-8 space-y-3 text-[14px] font-light ${t.accent ? "text-paper/85" : "text-ink-soft"}`}>
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${t.accent ? "text-primary" : "text-secondary"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#apply"
                  className={`mt-10 inline-flex items-center justify-center gap-2 h-12 rounded-full font-semibold text-[12px] tracking-[0.16em] uppercase tap-fade transition-colors ${
                    t.accent
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-ink-deep"
                  }`}
                >
                  {t.cta} <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-10 flex items-start gap-4 max-w-3xl border-t border-b border-hairline py-6">
            <CreditCard className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
            <p className="text-[14px] text-ink-soft leading-[1.65] font-light">
              <span className="font-serif font-light text-foreground">CPA-модель доступна по запросу. </span>
              Для крупных партнёров мы можем считать оплату по факту посещения — например,
              80–180 ₽ за подтверждённого гостя через QR-чек-ин.
            </p>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-paper-deep/60 border-y border-hairline relative">
        <div className="absolute inset-0 lux-paper opacity-50 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36 relative">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
              <div className="md:col-span-4">
                <p className="lux-eyebrow">Глава VI · FAQ</p>
                <div className="mt-3 w-12 lux-rule" />
              </div>
              <div className="md:col-span-8">
                <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[68px] tracking-[-0.035em]">
                  Частые <em className="lux-h1-italic text-secondary">вопросы</em>
                  <br /> партнёров.
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
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="max-w-[1240px] mx-auto px-5 sm:px-8 py-28 md:py-36">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-hairline bg-paper-deep">
            <div className="absolute inset-0 lux-paper opacity-70" />
            <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-primary/20 blur-3xl" />

            <div className="relative px-5 sm:px-8 md:px-14 py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-6">
                <p className="lux-eyebrow mb-6">Cover · Apply now</p>
                <h2 className="lux-h1 text-[36px] min-[390px]:text-[42px] md:text-[72px] tracking-[-0.04em]">
                  Подключись
                  <br /> за пару <em className="lux-h1-italic text-secondary">минут</em>.
                </h2>
                <div className="mt-8 flex items-start gap-5 max-w-md">
                  <div className="w-10 lux-rule mt-3 shrink-0" />
                  <p className="text-[15px] text-ink-soft leading-[1.65] font-light">
                    Оставь заявку — мы свяжемся в течение суток, поможем оформить карточку
                    и запустить первую акцию.
                  </p>
                </div>
                <ul className="mt-8 space-y-3 text-[14px] text-ink-soft font-light">
                  {[
                    "Бесплатное подключение и онбординг",
                    "Без долгосрочных контрактов",
                    "Менеджер на старте",
                  ].map((x) => (
                    <li key={x} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-secondary" /> {x}
                    </li>
                  ))}
                </ul>
              </div>

              <form
                className="md:col-span-6 relative bg-paper rounded-[24px] p-8 border border-hairline shadow-paper space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Спасибо! Мы свяжемся с тобой в течение суток.");
                }}
              >
                <div>
                  <label className="lux-eyebrow text-[9px]">Название заведения</label>
                  <input
                    required
                    className="mt-2 w-full h-11 bg-transparent border-b border-hairline focus:border-foreground transition-colors text-[15px] outline-none font-light placeholder:text-ink-mute/60"
                    placeholder="Bar Strelka"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="lux-eyebrow text-[9px]">Город</label>
                    <input
                      required
                      className="mt-2 w-full h-11 bg-transparent border-b border-hairline focus:border-foreground transition-colors text-[15px] outline-none font-light placeholder:text-ink-mute/60"
                      placeholder="Москва"
                    />
                  </div>
                  <div>
                    <label className="lux-eyebrow text-[9px]">Тип</label>
                    <select className="mt-2 w-full h-11 bg-transparent border-b border-hairline focus:border-foreground transition-colors text-[15px] outline-none font-light">
                      <option>Бар</option>
                      <option>Ресторан</option>
                      <option>Кофейня</option>
                      <option>Клуб</option>
                      <option>Студия</option>
                      <option>Другое</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="lux-eyebrow text-[9px]">Контакт (телефон или Telegram)</label>
                  <input
                    required
                    className="mt-2 w-full h-11 bg-transparent border-b border-hairline focus:border-foreground transition-colors text-[15px] outline-none font-light placeholder:text-ink-mute/60"
                    placeholder="@username или +7…"
                  />
                </div>
                <div>
                  <label className="lux-eyebrow text-[9px]">Что хочешь запустить?</label>
                  <textarea
                    rows={3}
                    className="mt-2 w-full bg-transparent border-b border-hairline focus:border-foreground transition-colors text-[15px] outline-none font-light placeholder:text-ink-mute/60 resize-none py-2"
                    placeholder="Например: акция на первый бокал и винные дегустации по средам"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-foreground text-background text-[12px] font-semibold tracking-[0.16em] uppercase tap-fade flex items-center justify-center gap-2 hover:bg-ink-deep transition-colors"
                >
                  Отправить заявку <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-ink-mute text-center tracking-wide">
                  Нажимая кнопку, ты соглашаешься на обработку данных.
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-hairline">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-hairline">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <img src={iconV5} alt="Frendly" className="w-9 h-9 rounded-[28%]" />
                <span className="font-serif font-light text-[22px] tracking-tight">Frendly · Partners</span>
              </div>
              <p className="font-serif font-light text-[20px] md:text-[24px] leading-[1.3] text-foreground/85 max-w-md tracking-tight">
                «Платформа для заведений, которые растут вместе с городом.»
              </p>
              <p className="lux-eyebrow text-[10px] mt-6">
                Est. MMXXVI · partners@frendly.app
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="lux-eyebrow text-[10px] mb-5">Партнёрам</p>
              <ul className="space-y-3 text-[13px] text-ink-soft font-light">
                <li><a href="#why" className="lux-link hover:text-foreground">Возможности</a></li>
                <li><a href="#cases" className="lux-link hover:text-foreground">Кейсы</a></li>
                <li><a href="#pricing" className="lux-link hover:text-foreground">Тарифы</a></li>
                <li><a href="#apply" className="lux-link hover:text-foreground">Подать заявку</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <p className="lux-eyebrow text-[10px] mb-5">Frendly</p>
              <ul className="space-y-3 text-[13px] text-ink-soft font-light">
                <li><Link to="/" className="lux-link hover:text-foreground">Для пользователей</Link></li>
                <li><Link to="/" className="lux-link hover:text-foreground">Прототип</Link></li>
                <li><Link to="/admin" className="lux-link hover:text-foreground">Админка</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap justify-between items-center gap-3 text-[11px] text-ink-mute tracking-wide">
            <p>© MMXXVI Frendly. Все права защищены.</p>
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <a href="#" className="lux-link hover:text-foreground">Условия партнёрства</a>
              <a href="#" className="lux-link hover:text-foreground">Приватность</a>
              <a href="mailto:partners@frendly.app" className="lux-link hover:text-foreground">partners@frendly.app</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Partners;
