import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Sparkles, MapPin, Users, MessageCircle, Shield, Moon, Wand2,
  ArrowRight, Play, Apple, Star, Check, ChevronDown, Heart, Wine,
  Dices, Film, Sunrise, Lock, Eye, ShieldCheck, KeyRound, Compass,
  Zap, CalendarPlus, Music2, Coffee,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";

const IOS_STORE_URL = import.meta.env.VITE_IOS_STORE_URL ?? "/";
const ANDROID_STORE_URL = import.meta.env.VITE_ANDROID_STORE_URL ?? "/";
const DEFAULT_STORE_URL = import.meta.env.VITE_DEFAULT_STORE_URL ?? "/";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://api.frendly.tech";

const CITIES = ["Москва", "Санкт-Петербург", "Тбилиси", "Алматы", "Белград", "Лиссабон", "Берлин", "Стамбул", "Ереван", "Дубай"];

const STATS = [
  { v: "12 400+", l: "активных френдов" },
  { v: "1 800+", l: "вечеров в месяц" },
  { v: "4.8★", l: "рейтинг в сторах" },
  { v: "92%", l: "идут на 2-ю встречу" },
];

const FEATURES = [
  { i: Wand2, t: "Вечера, а не свайпы", d: "AI-конструктор соберёт маршрут: бар → ужин → крыша. Ты только подтверждаешь.", c: "lime" },
  { i: Users, t: "Камерные встречи", d: "Маленькие группы 4–8 человек по интересам и настроению — без анкет и давления.", c: "pink" },
  { i: MapPin, t: "Только рядом", d: "Карта, фильтры по району и времени. Видишь только то, куда реально успеешь.", c: "lilac" },
  { i: MessageCircle, t: "Живой чат встречи", d: "Голосовые, фото, реакции, шаги маршрута и общая геолокация — в одном месте.", c: "lime" },
  { i: Shield, t: "Безопасность по умолчанию", d: "SOS, доверенные контакты, верификация и модерация. Спокойно тебе и близким.", c: "pink" },
  { i: Heart, t: "After Party и память", d: "После встречи — общие фото, отметки, новые френды. Вечер не заканчивается в полночь.", c: "lilac" },
];

const STEPS = [
  { n: "01", t: "Открой Tonight", d: "Лента вечеров на сегодня и ближайшие дни — подобрана под твой район и интересы." },
  { n: "02", t: "Собери вечер", d: "AI-конструктор предложит маршрут из 2–4 мест. Меняй перки, темп, бюджет." },
  { n: "03", t: "Опубликуй встречу", d: "Публично, по приглашению или для друзей. Чат подхватит участников." },
  { n: "04", t: "Живи вечер", d: "Live-таймлайн, чек-ин, голосовые. После — AfterParty с фото и контактами." },
];

const EVENT_GRADIENTS = [
  "from-rose-500/30 to-amber-500/20",
  "from-violet-500/30 to-fuchsia-500/20",
  "from-indigo-500/30 to-cyan-500/20",
  "from-emerald-500/30 to-lime-500/20",
  "from-sky-500/30 to-pink-500/20",
];

const DARK_CODE = [
  { i: Heart, t: "Consent first", d: "Любое действие — только по обоюдному «да»." },
  { i: Eye, t: "No photos", d: "Камеры выключены. Что в зале — остаётся в зале." },
  { i: ShieldCheck, t: "Verified only", d: "Документы и видеоселфи. Анонимы не входят." },
  { i: KeyRound, t: "Safety crew", d: "Дежурная команда и SOS в один тап." },
];

const VOICES = [
  { q: "За месяц 4 вечера и 2 настоящих друга. Это не Tinder — это про живых людей.", a: "Аня, 27" },
  { q: "AI-маршрут собрал идеальный вечер пятницы за 30 секунд. Я даже забыл про Google Maps.", a: "Марк, 31" },
  { q: "Чувствую себя в безопасности: SOS, верификация, маленькие группы. Мама довольна 😅", a: "Лиза, 24" },
];

const FAQ = [
  { q: "Это приложение для знакомств?", a: "И да, и нет. Frendly — про вечера и компанию. Кто-то находит друзей, кто-то — пару, кто-то — просто план на пятницу." },
  { q: "Сколько стоит?", a: "Базовое использование бесплатно. Frendly+ открывает приватные вечера, расширенные фильтры и After Dark." },
  { q: "А если я интроверт?", a: "Камерные группы 4–8 человек, готовые сценарии, чат до встречи — всё, чтобы было нестрашно зайти." },
  { q: "Где сейчас работает?", a: "Запускаемся в Москве и Петербурге, дальше — Тбилиси, Алматы, Белград, Лиссабон." },
];

type ActiveMeetup = {
  id: string;
  title: string;
  emoji: string;
  startsAt: string;
  time: string;
  place: string;
  going: number;
  capacity: number;
  vibe: string;
  priceMode: "free" | "fixed" | "from" | "upto" | "range" | "split" | "host_pays" | "fifty_fifty";
  priceAmountFrom: number | null;
  priceAmountTo: number | null;
  imageUrl: string | null;
  routePointCount: number | null;
  isDate: boolean;
};

type ActiveMeetupListResponse = {
  items?: ActiveMeetup[];
};

function toAssetUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  if (/^(https?:|data:)/i.test(value)) {
    return value;
  }
  return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function getMeetupImage(meetup: ActiveMeetup) {
  return toAssetUrl(meetup.imageUrl);
}

function getMeetupIcon(meetup: ActiveMeetup): ComponentType<{ className?: string }> {
  const text = `${meetup.emoji} ${meetup.title} ${meetup.vibe} ${meetup.place}`.toLowerCase();
  if (text.includes("кино") || text.includes("film") || text.includes("театр")) {
    return Film;
  }
  if (text.includes("концерт") || text.includes("music") || text.includes("standup") || text.includes("стендап")) {
    return Music2;
  }
  if (text.includes("вино") || text.includes("бар") || text.includes("ужин")) {
    return Wine;
  }
  if (text.includes("игр") || text.includes("настол")) {
    return Dices;
  }
  if (text.includes("завтрак") || text.includes("утрен")) {
    return Sunrise;
  }
  if (text.includes("кофе")) {
    return Coffee;
  }
  return CalendarPlus;
}

function getMeetupDate(meetup: ActiveMeetup) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(meetup.startsAt));
}

function getMeetupPlace(meetup: ActiveMeetup) {
  return meetup.place || "Москва";
}

function getMeetupPrice(meetup: ActiveMeetup) {
  if (meetup.priceMode === "free") {
    return "Бесплатно";
  }
  if (meetup.priceMode === "host_pays") {
    return "Хост платит";
  }
  if (meetup.priceMode === "fifty_fifty") {
    return "50/50";
  }
  if (meetup.priceAmountFrom != null && meetup.priceAmountTo != null) {
    return `${meetup.priceAmountFrom.toLocaleString("ru-RU")}–${meetup.priceAmountTo.toLocaleString("ru-RU")} ₽`;
  }
  if (meetup.priceAmountFrom != null) {
    return `от ${meetup.priceAmountFrom.toLocaleString("ru-RU")} ₽`;
  }
  if (meetup.priceAmountTo != null) {
    return `до ${meetup.priceAmountTo.toLocaleString("ru-RU")} ₽`;
  }
  return "Встреча";
}

function sortUpcomingMeetups(items: ActiveMeetup[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.startsAt).getTime();
    const bTime = new Date(b.startsAt).getTime();
    return aTime - bTime;
  });
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [evenings, setEvenings] = useState<ActiveMeetup[]>([]);
  const [eveningsLoading, setEveningsLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setVoiceIdx((i) => (i + 1) % VOICES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ city: "Москва", limit: "5" });

    setEveningsLoading(true);
    fetch(`${API_BASE_URL}/events/public/active?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Active meetups request failed: ${response.status}`);
        }
        return response.json() as Promise<ActiveMeetupListResponse>;
      })
      .then((data) => {
        const items = Array.isArray(data.items) ? sortUpcomingMeetups(data.items) : [];
        setEvenings(items.slice(0, 5));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setEvenings([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setEveningsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="landing-theme min-h-screen w-full bg-hero text-foreground overflow-x-hidden">
      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-32 size-[40rem] rounded-full bg-lime-gradient opacity-20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[36rem] rounded-full bg-pink-gradient opacity-25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 size-[30rem] rounded-full opacity-20 blur-[120px]"
             style={{ background: "radial-gradient(circle, oklch(0.7 0.18 305), transparent 70%)" }} />
      </div>

      {/* NAV */}
      <header className="relative z-30 sticky top-0">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-4 flex items-center justify-between">
          <div className="glass border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-soft">
            <Logo size="sm" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-muted-foreground pl-2 border-l border-white/10">Est. MMXXVI</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 glass border border-white/10 rounded-full px-2 py-1.5 text-sm">
            {["Возможности", "Метод", "Вечера", "Тарифы", "FAQ"].map((l, i) => (
              <a key={l} href={`#s-${i}`} className="px-3 py-1.5 rounded-full hover:bg-white/10 transition">{l}</a>
            ))}
          </nav>
          <a href={DEFAULT_STORE_URL} className="rounded-full bg-lime-gradient text-lime-foreground font-semibold px-4 py-2.5 text-sm inline-flex items-center gap-1.5 shadow-glow hover:scale-[1.02] transition">
            Открыть <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 pt-10 lg:pt-16 pb-20">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-10">
            <span>N° 01 · The Frendly Manifesto</span>
            <span className="hidden sm:inline">Москва — Тбилиси — Лиссабон</span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 glass border border-white/10 rounded-full px-3 py-1.5 text-xs">
                <span className="size-1.5 rounded-full bg-lime animate-pulse" />
                Уже в Москве и Петербурге
              </div>

              <h1 className="mt-6 font-display font-semibold leading-[0.95] tracking-[-0.04em] text-[clamp(48px,9vw,128px)]">
                Знакомства{" "}
                <span className="relative inline-block">
                  через
                  <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none">
                    <path d="M2 8 Q 50 0, 100 7 T 198 6" stroke="url(#g1)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="oklch(0.92 0.2 130)" /><stop offset="1" stopColor="oklch(0.78 0.19 0)" /></linearGradient></defs>
                  </svg>
                </span>{" "}
                <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: "oklch(0.92 0.2 130)" }}>вечера</span>,
                <br />
                <span className="text-muted-foreground/60">а не</span>{" "}
                <span className="relative">
                  свайпы
                  <span className="absolute left-0 right-0 top-1/2 h-[6px] bg-pink-gradient rounded-full -rotate-3" />
                </span>.
              </h1>

              <p className="mt-8 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed">
                Frendly собирает <span className="text-foreground font-medium">камерные встречи</span> и AI-маршруты на вечер с людьми, которые рядом и в твоём настроении.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={IOS_STORE_URL} className="rounded-2xl bg-lime-gradient text-lime-foreground font-bold px-6 py-4 inline-flex items-center gap-2 shadow-glow hover:scale-[1.02] transition">
                  <Apple className="size-5" /> App Store
                </a>
                <a href={ANDROID_STORE_URL} className="rounded-2xl glass border border-white/15 font-semibold px-6 py-4 inline-flex items-center gap-2 hover:bg-white/10 transition">
                  <Play className="size-5 fill-current" /> Google Play
                </a>
                <a href={DEFAULT_STORE_URL} className="rounded-2xl border border-white/10 font-medium px-6 py-4 inline-flex items-center gap-2 hover:bg-white/5 transition">
                  Открыть Frendly <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className="size-9 rounded-full border-2 border-background"
                         style={{background: `linear-gradient(135deg, oklch(${0.7 + i*0.05} 0.18 ${i*80}), oklch(0.5 0.2 ${i*120}))`}} />
                  ))}
                </div>
                <div className="text-sm"><span className="font-bold">12 400</span> <span className="text-muted-foreground">френдов уже собирают вечера</span></div>
              </div>
            </div>

            {/* Phone mockup */}
            <PhoneMock />
          </div>
        </div>

        {/* Cities marquee */}
        <div className="relative border-y border-white/10 bg-surface/30 backdrop-blur py-5 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...CITIES, ...CITIES, ...CITIES].map((c, i) => (
              <span key={i} className="text-2xl lg:text-4xl font-display font-semibold tracking-tight inline-flex items-center gap-12">
                {c} <span className="size-2 rounded-full bg-lime/60" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {STATS.map((s, i) => (
            <div key={i} className="glass border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-lime/30 transition group">
              <div className="font-display text-3xl lg:text-5xl font-semibold bg-clip-text text-transparent"
                   style={{backgroundImage: i % 2 ? "var(--gradient-pink)" : "var(--gradient-lime)"}}>
                {s.v}
              </div>
              <div className="mt-2 text-xs lg:text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="s-0" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Chapter no="I" label="Возможности" />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] max-w-3xl">
            Всё, чтобы вечер{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.78 0.19 0)" }}>случился</span>{" "}
            — без неловкости.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">Шесть вещей, которые превращают «надо бы выбраться» в реальный план.</p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="group relative rounded-3xl glass border border-white/10 p-6 overflow-hidden hover:border-white/20 transition hover:-translate-y-1 duration-300">
                <div className={`absolute -top-20 -right-20 size-48 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition`}
                     style={{background: `var(--${f.c})`}} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-2xl grid place-items-center" style={{background: `color-mix(in oklab, var(--${f.c}) 25%, transparent)`}}>
                      <f.i className="size-5" style={{color: `var(--${f.c})`}} />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">0{i+1} / 06</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="s-1" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Chapter no="II" label="Метод" />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] max-w-3xl">
            От «скучно» до{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.92 0.2 130)" }}>«выходим»</span>{" "}
            — четыре шага.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((s, i) => (
              <div key={i} className="relative rounded-3xl glass border border-white/10 p-6 hover:bg-white/5 transition">
                <div className="text-[64px] font-display font-semibold leading-none bg-clip-text text-transparent"
                     style={{backgroundImage: "var(--gradient-lime)"}}>{s.n}</div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 size-5 text-lime/60" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="s-2" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Chapter no="III" label="Вечера" />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] max-w-3xl">
            То, что{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.82 0.16 320)" }}>случается</span>{" "}
            сегодня вечером.
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {eveningsLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[3/4] p-5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${EVENT_GRADIENTS[i]}`} />
                  <div className="absolute inset-0 bg-black/20 animate-pulse" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="h-7 w-16 rounded-full bg-white/15" />
                      <div className="h-7 w-20 rounded-full bg-white/15" />
                    </div>
                    <div>
                      <div className="h-10 w-10 rounded-2xl bg-white/15 mb-3" />
                      <div className="h-7 w-4/5 rounded bg-white/15" />
                      <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}

            {!eveningsLoading &&
              evenings.map((meetup, i) => {
                const Icon = getMeetupIcon(meetup);
                const imageUrl = getMeetupImage(meetup);

                return (
                  <a
                    key={meetup.id}
                    href={DEFAULT_STORE_URL}
                    className="group relative rounded-3xl overflow-hidden border border-white/10 aspect-[3/4] flex flex-col justify-between p-5 hover:-translate-y-1 transition duration-300"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${EVENT_GRADIENTS[i % EVENT_GRADIENTS.length]}`} />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-br ${EVENT_GRADIENTS[i % EVENT_GRADIENTS.length]} opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
                    <div className="relative flex items-center justify-between gap-2 text-xs">
                      <span className="rounded-full glass border border-white/20 px-2.5 py-1">N° 0{i + 1}</span>
                      <span className="rounded-full bg-lime text-lime-foreground px-2.5 py-1 font-semibold whitespace-nowrap">{getMeetupPrice(meetup)}</span>
                    </div>
                    <div className="relative">
                      <Icon className="size-10 mb-3 opacity-90" />
                      <h3 className="font-display text-xl lg:text-2xl font-semibold leading-tight line-clamp-3">{meetup.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {getMeetupDate(meetup)} · {getMeetupPlace(meetup)}
                      </p>
                      <p className="mt-2 text-xs text-foreground/80">
                        {meetup.going}/{meetup.capacity} идут
                        {meetup.routePointCount ? ` · ${meetup.routePointCount} точки` : ""}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                        Открыть <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </a>
                );
              })}

            {!eveningsLoading && evenings.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-5 rounded-3xl glass border border-white/10 p-8">
                <CalendarPlus className="size-8 text-lime" />
                <h3 className="mt-4 font-display text-2xl font-semibold">Активных встреч в Москве пока нет</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Это нормально. Открой Frendly, там можно собрать свою встречу в Москве за пару минут.
                </p>
                <a href={DEFAULT_STORE_URL} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-lime-gradient text-lime-foreground font-bold px-5 py-3">
                  Открыть Frendly <ArrowRight className="size-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AFTER DARK */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 p-8 lg:p-14"
               style={{background: "linear-gradient(160deg, oklch(0.12 0.08 295), oklch(0.06 0.04 295))"}}>
            <div className="absolute -top-32 -right-20 size-96 rounded-full bg-pink-gradient opacity-30 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-96 rounded-full opacity-25 blur-3xl"
                 style={{background: "radial-gradient(circle, oklch(0.55 0.22 285), transparent)"}} />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full glass border border-pink/30 px-3 py-1.5 text-xs">
                  <Moon className="size-3.5 text-pink" /> Глава IV · After Dark · 18+
                </div>
                <h2 className="mt-5 font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em]">
                  Когда город{" "}
                  <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.78 0.19 0)" }}>просыпается</span>{" "}
                  ночью.
                </h2>
                <p className="mt-5 text-muted-foreground max-w-md">
                  Закрытый режим: kink-friendly события, swing-вечера, приватные клубы и ночные афтепати. Только верифицированные френды, NDA, кодекс согласия.
                </p>
                <a href={DEFAULT_STORE_URL} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-pink-gradient text-pink-foreground font-bold px-6 py-4 shadow-glow hover:scale-[1.02] transition">
                  <Lock className="size-4" /> Открыть After Dark
                </a>
                <p className="mt-3 text-xs text-muted-foreground">Только Frendly+ · 18+</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {DARK_CODE.map((c, i) => (
                  <div key={i} className="rounded-3xl glass border border-white/10 p-5">
                    <c.i className="size-5 text-pink mb-3" />
                    <div className="font-semibold text-sm">{c.t}</div>
                    <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-10 text-center">
          <Chapter no="V" label="Голоса" center />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em]">
            Тёплые отзывы —{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.92 0.2 130)" }}>как тёплые вечера</span>.
          </h2>

          <div className="mt-12 relative h-[280px] sm:h-[220px]">
            {VOICES.map((v, i) => (
              <div key={i}
                   className="absolute inset-0 transition-all duration-700 rounded-3xl glass border border-white/10 p-8 lg:p-12 flex flex-col items-center justify-center"
                   style={{opacity: i === voiceIdx ? 1 : 0, transform: i === voiceIdx ? "scale(1)" : "scale(0.96)"}}>
                <div className="flex gap-1 mb-5">
                  {[0,1,2,3,4].map(s => <Star key={s} className="size-4 fill-lime text-lime" />)}
                </div>
                <p className="font-display text-xl lg:text-2xl leading-snug max-w-2xl">«{v.q}»</p>
                <p className="mt-5 text-sm text-muted-foreground">— {v.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {VOICES.map((_, i) => (
              <button key={i} onClick={() => setVoiceIdx(i)}
                      className={"h-1.5 rounded-full transition-all " + (i === voiceIdx ? "w-8 bg-lime" : "w-1.5 bg-white/20")} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="s-3" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Chapter no="VI" label="Цены" />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] max-w-3xl">
            Старт{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.92 0.2 130)" }}>бесплатный</span>.
            Frendly+ — когда захочется большего.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-5">
            <PriceCard
              name="Free"
              tagline="Чтобы попробовать вечер"
              price="0₽"
              items={["Лента Tonight и публичные вечера", "Базовые фильтры и карта", "Чаты встреч и личные", "SOS и доверенные контакты"]}
            />
            <PriceCard
              name="Frendly+"
              tagline="Полный город в кармане"
              price="490₽"
              suffix="/ мес"
              note="Первая неделя бесплатно"
              highlight
              items={["Приватные вечера и закрытые круги", "AI-конструктор Premium с перками", "After Dark · ночные события 18+", "Расширенные фильтры и приоритет", "Без рекламы и лимитов"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="s-4" className="relative z-10 py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <Chapter no="VII" label="FAQ" center />
          <h2 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] text-center">
            Частые{" "}
            <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.82 0.16 320)" }}>вопросы</span>.
          </h2>

          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <button key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left rounded-2xl glass border border-white/10 p-5 hover:bg-white/5 transition">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground tabular-nums">0{i+1}</span>
                    <span className="font-semibold">{f.q}</span>
                  </div>
                  <ChevronDown className={"size-5 shrink-0 transition " + (openFaq === i ? "rotate-180 text-lime" : "text-muted-foreground")} />
                </div>
                <div className={"grid transition-all duration-300 " + (openFaq === i ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground leading-relaxed pl-8">{f.a}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 p-10 lg:p-16 text-center bg-hero">
            <div className="absolute inset-0 bg-lime-gradient opacity-15" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-lime-gradient opacity-30 blur-3xl" />

            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Issue No. 01 · Cover</div>
              <LogoMark size="xl" className="mx-auto mt-6 float-y shadow-glow" />
              <h2 className="mt-8 font-display text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.03em]">
                Сегодня вечером — кто-то уже собирает вечер для{" "}
                <span className="italic font-light" style={{ fontFamily: '"Instrument Serif", serif', color: "oklch(0.92 0.2 130)" }}>тебя</span>.
              </h2>
              <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
                Установи Frendly и присоединяйся к первой встрече за пару минут. Без анкет, без давления, без свайпов.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <a href={IOS_STORE_URL} className="rounded-2xl bg-foreground text-background font-bold px-6 py-4 inline-flex items-center gap-2 hover:scale-[1.02] transition">
                  <Apple className="size-5" /> App Store
                </a>
                <a href={ANDROID_STORE_URL} className="rounded-2xl bg-foreground text-background font-bold px-6 py-4 inline-flex items-center gap-2 hover:scale-[1.02] transition">
                  <Play className="size-5 fill-current" /> Google Play
                </a>
              </div>
              <a href={DEFAULT_STORE_URL} className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
                Открыть Frendly <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <Logo size="sm" />
          <span>© MMXXVI Frendly · Знакомства через вечера</span>
          <div className="flex gap-4">
            <Link to="/legal/privacy" className="hover:text-foreground">Приватность</Link>
            <Link to="/legal/terms" className="hover:text-foreground">Условия</Link>
            <a href="mailto:team@frendly.tech" className="hover:text-foreground">Поддержка</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
}

function Chapter({ no, label, center }: { no: string; label: string; center?: boolean }) {
  return (
    <div className={"flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-6 " + (center ? "justify-center" : "")}>
      <span className="size-1.5 rounded-full bg-lime" />
      Глава {no} · {label}
      <span className="flex-1 max-w-[60px] h-px bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  );
}

function PriceCard({ name, tagline, price, suffix, note, items, highlight }: {
  name: string; tagline: string; price: string; suffix?: string; note?: string;
  items: string[]; highlight?: boolean;
}) {
  return (
    <div className={"relative rounded-3xl p-8 border " + (highlight
      ? "border-lime/40 bg-gradient-to-br from-lime/10 to-pink/10 shadow-glow"
      : "border-white/10 glass")}>
      {highlight && (
        <div className="absolute -top-3 left-8 rounded-full bg-lime text-lime-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1">
          Editor's choice
        </div>
      )}
      <div className="text-sm text-muted-foreground">{tagline}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{name}</div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold">{price}</span>
        {suffix && <span className="text-muted-foreground">{suffix}</span>}
      </div>
      {note && <div className="mt-1 text-xs text-lime">{note}</div>}

      <ul className="mt-8 space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className={"mt-0.5 size-5 rounded-full grid place-items-center shrink-0 " + (highlight ? "bg-lime text-lime-foreground" : "bg-white/10")}>
              <Check className="size-3" />
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>

      <a href="#cta" className={"mt-8 w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2 transition " +
        (highlight ? "bg-lime-gradient text-lime-foreground shadow-glow hover:scale-[1.01]" : "border border-white/15 hover:bg-white/5")}>
        {highlight ? "Попробовать Frendly+" : "Начать бесплатно"} <ArrowRight className="size-4" />
      </a>
    </div>
  );
}

const PHONE_SCREENS = [
  { id: "tonight", label: "Лента «Tonight»", caption: "Видишь вечера рядом и присоединяешься в один тап." },
  { id: "map", label: "Карта города", caption: "Точки вечеров вокруг тебя в реальном времени." },
  { id: "ai", label: "AI-конструктор вечера", caption: "Опиши вайб — соберём маршрут за 30 секунд." },
  { id: "chat", label: "Чат встречи", caption: "Голосовые, фото, шаги маршрута — всё в одном месте." },
  { id: "dating", label: "Свидания и матчи", caption: "Френдли+, верифицированные, рядом." },
  { id: "dark", label: "After Dark · 18+", caption: "Закрытый ночной круг для верифицированных." },
];

function PhoneMock() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PHONE_SCREENS.length), 3700);
    return () => clearInterval(t);
  }, []);
  const current = PHONE_SCREENS[idx];

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* Floating chips */}
      <div className="absolute -left-6 top-16 z-20 rounded-full glass border border-white/15 px-3 py-2 text-xs font-semibold shadow-soft float-y inline-flex items-center gap-2">
        <Wine className="size-3.5 text-pink" /> Вино рядом
      </div>
      <div className="absolute -right-4 top-1/3 z-20 rounded-full glass border border-white/15 px-3 py-2 text-xs font-semibold shadow-soft float-y inline-flex items-center gap-2"
           style={{animationDelay: "1s"}}>
        <Music2 className="size-3.5 text-lime" /> +3 френда
      </div>
      <div className="absolute -left-2 bottom-24 z-20 rounded-full glass border border-white/15 px-3 py-2 text-xs font-semibold shadow-soft float-y inline-flex items-center gap-2"
           style={{animationDelay: "2s"}}>
        <Coffee className="size-3.5" style={{color: "oklch(0.7 0.15 60)"}} /> Кофе утром
      </div>

      {/* Screen label pill */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 rounded-full glass border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap shadow-soft">
        <span className="inline-block size-1.5 rounded-full bg-lime mr-2 animate-pulse" />
        {current.label}
      </div>

      {/* Phone frame */}
      <div className="relative rounded-[3rem] border-[10px] border-foreground/90 shadow-2xl overflow-hidden bg-background aspect-[9/19]">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full bg-foreground/90 z-30" />

        {/* Screens stacked, cross-fade */}
        {PHONE_SCREENS.map((s, i) => (
          <div key={s.id}
               className="absolute inset-0 transition-all duration-700"
               style={{
                 opacity: i === idx ? 1 : 0,
                 transform: i === idx ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
                 pointerEvents: i === idx ? "auto" : "none",
               }}>
            <PhoneScreen kind={s.id} />
          </div>
        ))}

        {/* Reflection */}
        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] z-20"
             style={{background: "linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 30%, transparent 70%, rgba(255,255,255,.06) 100%)"}} />
      </div>

      {/* Caption + dots under phone */}
      <div className="mt-5 text-center min-h-[56px]">
        <p className="text-xs text-muted-foreground transition-opacity duration-500" key={current.id}>
          {current.caption}
        </p>
        <div className="mt-3 flex justify-center gap-1.5">
          {PHONE_SCREENS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Экран ${i + 1}`}
                    className={"h-1.5 rounded-full transition-all " + (i === idx ? "w-6 bg-lime" : "w-1.5 bg-white/20 hover:bg-white/40")} />
          ))}
        </div>
      </div>

      {/* Radar ping behind */}
      <div className="absolute -z-10 inset-0 grid place-items-center">
        <div className="size-72 rounded-full bg-lime/20 blur-3xl radar-ping" />
      </div>
    </div>
  );
}

function PhoneStatus({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
      <span>Сегодня · 18:42</span>
      <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {subtitle ?? "Чистые пруды"}</span>
    </div>
  );
}

function PhoneScreen({ kind }: { kind: string }) {
  if (kind === "tonight") {
    return (
      <div className="absolute inset-0 p-5 pt-10 flex flex-col gap-3 overflow-hidden">
        <PhoneStatus />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Tonight</div>
            <div className="font-display text-2xl font-semibold leading-tight">Что сегодня вечером?</div>
          </div>
          <LogoMark size="sm" />
        </div>
        <div className="flex gap-1.5">
          {["Сегодня", "Завтра", "After Dark"].map((c, i) => (
            <span key={c} className={"text-[10px] px-2.5 py-1 rounded-full " + (i === 0 ? "bg-lime text-lime-foreground font-semibold" : "glass border border-white/10")}>{c}</span>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {[
            { i: Wine, t: "Винный вечер", w: "19:30 · 5/8", c: "from-rose-500/40 to-amber-500/30" },
            { i: Dices, t: "Настолки", w: "20:00 · 4/6", c: "from-violet-500/40 to-fuchsia-500/30" },
            { i: Film, t: "Кинопоказ", w: "21:00 · 7/10", c: "from-indigo-500/40 to-cyan-500/30" },
          ].map((e, i) => (
            <div key={i} className={"relative rounded-2xl overflow-hidden p-3 border border-white/10 bg-gradient-to-br " + e.c}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 backdrop-blur grid place-items-center"><e.i className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{e.t}</div>
                  <div className="text-[10px] text-white/70">{e.w}</div>
                </div>
                {i === 0 && <span className="rounded-full bg-lime text-lime-foreground text-[10px] font-bold px-2 py-1">Я в деле</span>}
              </div>
            </div>
          ))}
          <div className="rounded-2xl glass border border-lime/30 p-3 flex items-center gap-3">
            <div className="size-9 rounded-full bg-lime-gradient grid place-items-center text-lime-foreground"><Zap className="size-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold">Ты в вечере!</div>
              <div className="text-[10px] text-muted-foreground">Чат уже открыт</div>
            </div>
            <ArrowRight className="size-4 text-lime" />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "map") {
    return (
      <div className="absolute inset-0 overflow-hidden"
           style={{background: "radial-gradient(120% 80% at 50% 40%, oklch(0.32 0.13 295), oklch(0.18 0.08 295))"}}>
        {/* fake map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 400">
          {Array.from({length: 12}).map((_, i) => (
            <line key={"h"+i} x1="0" y1={i * 35} x2="200" y2={i * 35} stroke="white" strokeWidth="0.4" />
          ))}
          {Array.from({length: 7}).map((_, i) => (
            <line key={"v"+i} x1={i * 30} y1="0" x2={i * 30} y2="400" stroke="white" strokeWidth="0.4" />
          ))}
          <path d="M10 80 Q 80 120, 120 200 T 180 360" stroke="oklch(0.92 0.2 130 / .5)" strokeWidth="2" fill="none" />
          <path d="M20 200 Q 100 230, 180 180" stroke="oklch(0.78 0.19 0 / .4)" strokeWidth="2" fill="none" />
        </svg>

        {/* radar center */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-lime/30 blur-2xl radar-ping" />
            <div className="absolute inset-0 rounded-full bg-lime/20 blur-xl radar-ping" style={{animationDelay: ".8s"}} />
            <div className="relative size-12 rounded-full bg-lime-gradient grid place-items-center text-lime-foreground shadow-glow">
              <Compass className="size-5" />
            </div>
          </div>
        </div>

        {/* pins */}
        {[
          { x: "18%", y: "26%", i: Wine, c: "bg-pink" },
          { x: "72%", y: "32%", i: Coffee, c: "bg-lime" },
          { x: "28%", y: "62%", i: Music2, c: "bg-pink" },
          { x: "78%", y: "72%", i: Dices, c: "bg-lime" },
        ].map((p, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-full float-y"
               style={{ left: p.x, top: p.y, animationDelay: `${i * 0.4}s` }}>
            <div className={"size-8 rounded-full grid place-items-center text-lime-foreground shadow-glow " + p.c}>
              <p.i className="size-4" />
            </div>
            <div className="size-2 rounded-full bg-white/60 mx-auto -mt-0.5" />
          </div>
        ))}

        {/* top status */}
        <div className="absolute top-10 left-5 right-5">
          <PhoneStatus subtitle="Радиус 1.2 км" />
          <div className="mt-2 font-display text-xl font-semibold leading-tight">12 вечеров рядом</div>
        </div>

        {/* bottom card */}
        <div className="absolute left-4 right-4 bottom-5 rounded-2xl glass border border-white/15 p-3 flex items-center gap-3 shadow-soft">
          <div className="size-10 rounded-xl bg-gradient-to-br from-rose-500/60 to-amber-500/50 grid place-items-center">
            <Wine className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Винный вечер · 320 м</div>
            <div className="text-[10px] text-muted-foreground">19:30 · 5/8 · Patriarshy</div>
          </div>
          <ArrowRight className="size-4 text-lime" />
        </div>
      </div>
    );
  }

  if (kind === "ai") {
    return (
      <div className="absolute inset-0 p-5 pt-10 flex flex-col gap-3 overflow-hidden bg-hero">
        <PhoneStatus subtitle="AI Builder" />
        <div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><Sparkles className="size-3 text-lime" /> AI Date Builder</div>
          <div className="font-display text-xl font-semibold leading-tight mt-1">Опиши вайб вечера</div>
        </div>

        <div className="rounded-2xl glass border border-white/15 p-3 text-xs">
          <span className="text-muted-foreground">«</span>
          <span className="font-medium">Тёплый вечер · вино · крыша</span>
          <span className="inline-block w-px h-3 bg-foreground align-middle ml-0.5 animate-pulse" />
        </div>

        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Маршрут</div>
        {[
          { n: "01", t: "Patriarshy Wine Bar", w: "19:30 · вино", i: Wine },
          { n: "02", t: "Roof White", w: "21:00 · ужин", i: Music2 },
          { n: "03", t: "Кофе у Чистых", w: "23:30 · поздний", i: Coffee },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl glass border border-white/10 p-2.5 flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-lime tabular-nums">{s.n}</span>
            <div className="size-8 rounded-lg bg-white/10 grid place-items-center"><s.i className="size-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{s.t}</div>
              <div className="text-[10px] text-muted-foreground">{s.w}</div>
            </div>
          </div>
        ))}

        <div className="mt-auto rounded-2xl bg-lime-gradient text-lime-foreground font-bold text-sm py-3 flex items-center justify-center gap-2 shadow-glow">
          <Wand2 className="size-4" /> Опубликовать вечер
        </div>
      </div>
    );
  }

  if (kind === "chat") {
    return (
      <div className="absolute inset-0 p-5 pt-10 flex flex-col overflow-hidden bg-hero">
        <PhoneStatus subtitle="Винный вечер · 5/8" />
        <div className="mt-2 flex items-center gap-2 pb-3 border-b border-white/10">
          <div className="flex -space-x-2">
            {[0,1,2].map(i => <div key={i} className="size-7 rounded-full border-2 border-background"
                                  style={{background: `linear-gradient(135deg, oklch(0.7 0.18 ${i*100}), oklch(0.5 0.2 ${i*60}))`}} />)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">Чат встречи</div>
            <div className="text-[9px] text-lime">● 5 онлайн</div>
          </div>
          <MessageCircle className="size-4 text-muted-foreground" />
        </div>

        <div className="flex-1 flex flex-col gap-2 py-3 overflow-hidden text-xs">
          <div className="self-start max-w-[80%] rounded-2xl rounded-bl-sm glass border border-white/10 px-3 py-2">
            <div className="text-[9px] text-lime mb-0.5">Аня</div>
            Я уже на месте 🍷
          </div>
          <div className="self-start max-w-[80%] rounded-2xl rounded-bl-sm glass border border-white/10 px-3 py-2">
            <div className="text-[9px] text-pink mb-0.5">Марк</div>
            Беру белое, кому что взять?
          </div>
          <div className="self-end max-w-[80%] rounded-2xl rounded-br-sm bg-lime-gradient text-lime-foreground px-3 py-2 font-medium">
            Розе, спасибо! Иду 🙌
          </div>
          <div className="self-start rounded-full glass border border-white/15 px-3 py-1.5 inline-flex items-center gap-2 text-[10px]">
            <span className="size-2 rounded-full bg-pink animate-pulse" /> Аня печатает…
          </div>
        </div>

        <div className="rounded-full glass border border-white/15 p-2 flex items-center gap-2 text-xs">
          <span className="size-7 rounded-full bg-white/10 grid place-items-center">+</span>
          <span className="flex-1 text-muted-foreground">Сообщение…</span>
          <span className="size-7 rounded-full bg-lime grid place-items-center text-lime-foreground">
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "dating") {
    return (
      <div className="absolute inset-0 p-5 pt-10 flex flex-col gap-3 overflow-hidden bg-hero">
        <PhoneStatus subtitle="Dating" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Рядом сегодня</div>
            <div className="font-display text-xl font-semibold leading-tight">Свидания</div>
          </div>
          <Heart className="size-5 text-pink" />
        </div>

        <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/15"
             style={{background: "linear-gradient(160deg, oklch(0.7 0.2 340), oklch(0.45 0.22 295))"}}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* decorative blobs as "photo" */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 size-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute top-20 right-8 size-16 rounded-full bg-pink/40 blur-xl" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="rounded-full bg-lime text-lime-foreground text-[10px] font-bold px-2 py-0.5 inline-flex items-center gap-1">
              <ShieldCheck className="size-3" /> Verified
            </span>
            <span className="rounded-full bg-pink text-pink-foreground text-[10px] font-bold px-2 py-0.5">Frendly+</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-display text-2xl font-semibold leading-tight">Алина, 26</div>
            <div className="text-[10px] text-white/80 mt-0.5 inline-flex items-center gap-1.5">
              <MapPin className="size-3" /> 1.4 км · Tverskaya
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {["вино", "арт", "пятницы"].map(t => (
                <span key={t} className="text-[9px] glass border border-white/20 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button className="size-11 rounded-full glass border border-white/15 grid place-items-center text-muted-foreground">×</button>
          <button className="size-12 rounded-full bg-pink-gradient grid place-items-center text-pink-foreground shadow-glow">
            <Heart className="size-5 fill-current" />
          </button>
          <button className="size-11 rounded-full glass border border-lime/30 grid place-items-center text-lime">
            <Sparkles className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  if (kind === "dark") {
    return (
      <div className="absolute inset-0 p-5 pt-10 flex flex-col gap-3 overflow-hidden"
           style={{background: "linear-gradient(160deg, oklch(0.12 0.08 295), oklch(0.05 0.04 295))"}}>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">After Dark · 23:42</span>
          <span className="rounded-full bg-pink-gradient text-pink-foreground px-2 py-0.5 font-bold">18+</span>
        </div>

        <div>
          <div className="text-xs text-pink inline-flex items-center gap-1.5"><Moon className="size-3" /> Night Mode</div>
          <div className="font-display text-2xl font-semibold leading-tight mt-1">Город не спит</div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-pink/30 flex-1 grid place-items-center"
             style={{background: "radial-gradient(circle at 30% 30%, oklch(0.4 0.22 320 / .6), oklch(0.1 0.08 295) 70%)"}}>
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-pink-gradient opacity-40 blur-3xl" />
          <div className="text-center">
            <div className="size-14 rounded-full bg-pink/15 border border-pink/40 grid place-items-center mx-auto shadow-glow">
              <Lock className="size-6 text-pink" />
            </div>
            <div className="mt-3 text-sm font-semibold">8 событий сегодня ночью</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Адрес откроется за 4 часа</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[9px]">
          {[
            { i: ShieldCheck, t: "Verified" },
            { i: Eye, t: "No photos" },
            { i: KeyRound, t: "NDA" },
          ].map((b) => (
            <div key={b.t} className="rounded-xl glass border border-white/10 p-2 flex flex-col items-center gap-1">
              <b.i className="size-3.5 text-pink" />
              <span>{b.t}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-pink-gradient text-pink-foreground font-bold text-sm py-3 flex items-center justify-center gap-2 shadow-glow">
          <Lock className="size-4" /> Войти
        </div>
      </div>
    );
  }

  return null;
}
