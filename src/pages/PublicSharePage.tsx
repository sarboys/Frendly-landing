import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";

type PublicSharePerson = {
  name: string;
  avatarUrl: string | null;
};

type PublicShareRouteStep = {
  id: string;
  time: string;
  endTime: string | null;
  title: string;
  venue: string;
  address: string;
  emoji: string;
  description: string | null;
  distance: string | null;
  walkMin: number | null;
  perk: string | null;
};

type PublicShare = {
  slug: string;
  kind: "event" | "evening_session";
  title: string;
  emoji: string;
  description: string;
  startsAt: string | null;
  durationMinutes: number | null;
  place: string | null;
  area: string | null;
  vibe: string | null;
  partnerName: string | null;
  partnerOffer: string | null;
  capacity: number;
  url: string;
  deepLink: string;
  host: {
    name: string;
    avatarUrl: string | null;
    verified: boolean;
  };
  people: {
    count: number;
    preview: PublicSharePerson[];
  };
  route: {
    area: string | null;
    durationLabel: string | null;
    totalPriceFrom: number | null;
    totalSavings: number | null;
    steps: PublicShareRouteStep[];
  } | null;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://api.frendly.tech";

const IOS_STORE_URL =
  import.meta.env.VITE_IOS_STORE_URL ?? "https://apps.apple.com/search?term=Frendly";

const ANDROID_STORE_URL =
  import.meta.env.VITE_ANDROID_STORE_URL ??
  "https://play.google.com/store/search?q=Frendly&c=apps";

const DEFAULT_STORE_URL = import.meta.env.VITE_DEFAULT_STORE_URL ?? "/";

const formatDate = (value: string | null) => {
  if (!value) return "Скоро";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const resolveAssetUrl = (value: string | null) => {
  if (!value) return null;
  if (/^(https?:|data:)/i.test(value)) return value;
  return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

const storeUrlForDevice = () => {
  const userAgent = window.navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isIos =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

  if (isAndroid) return ANDROID_STORE_URL;
  if (isIos) return IOS_STORE_URL;
  return DEFAULT_STORE_URL;
};

const openAppOrStore = (share: PublicShare) => {
  const fallbackUrl = storeUrlForDevice();
  let opened = false;

  const markOpened = () => {
    if (document.visibilityState === "hidden") {
      opened = true;
    }
  };

  document.addEventListener("visibilitychange", markOpened, { once: true });
  window.location.href = share.deepLink;

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markOpened);
    if (!opened) {
      window.location.href = fallbackUrl;
    }
  }, 1100);
};

const Avatar = ({ person }: { person: PublicSharePerson }) => {
  const avatarUrl = resolveAssetUrl(person.avatarUrl);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
      />
    );
  }

  return (
    <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary-soft text-sm font-bold text-secondary ring-2 ring-background">
      {person.name.slice(0, 1).toUpperCase()}
    </div>
  );
};

const PublicSharePage = () => {
  const { slug = "" } = useParams();
  const [share, setShare] = useState<PublicShare | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(`${API_BASE_URL}/public/shares/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Share not found");
        }
        return response.json() as Promise<PublicShare>;
      })
      .then((data) => {
        setShare(data);
        document.title = `${data.title} · Frendly`;
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== "AbortError") {
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug]);

  const dateLabel = useMemo(() => formatDate(share?.startsAt ?? null), [share]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-5 py-8 text-foreground">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error || !share) {
    return (
      <main className="min-h-screen bg-background px-5 py-8 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <ChevronLeft className="h-4 w-4" />
            На главную
          </Link>
          <div className="mt-20 border-t border-hairline pt-12">
            <p className="lux-eyebrow">Frendly</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
              Ссылка не найдена
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
              Возможно, встреча стала приватной или ссылка больше не активна.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-10">
        <div>
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={iconV5} alt="" className="h-10 w-10 rounded-2xl" />
              <span className="text-sm font-bold tracking-wide">Frendly</span>
            </Link>
            <span className="rounded-full bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {share.kind === "event" ? "Встреча" : "Маршрут"}
            </span>
          </nav>

          <div className="mt-16 max-w-3xl lg:mt-24">
            <div className="text-6xl">{share.emoji}</div>
            <p className="mt-8 lux-eyebrow">{share.vibe ?? "Frendly evening"}</p>
            <h1 className="mt-5 text-[44px] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[72px]">
              {share.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-8 text-ink-soft">
              {share.description}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openAppOrStore(share)}
              className="inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm font-bold text-background shadow-soft transition hover:-translate-y-0.5"
            >
              Перейти в приложение
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={share.url}
              className="inline-flex items-center rounded-full border border-hairline px-6 py-4 text-sm font-bold text-foreground"
            >
              Открыть ссылку
            </a>
          </div>
        </div>

        <aside className="self-start rounded-[28px] border border-hairline bg-card p-5 shadow-paper md:p-7 lg:mt-12">
          <div className="rounded-[22px] bg-gradient-to-br from-primary-soft via-background to-secondary-soft p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-mute">
                  Детали
                </p>
                <h2 className="mt-3 text-2xl font-semibold">{share.title}</h2>
              </div>
              <span className="text-4xl">{share.emoji}</span>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">{dateLabel}</p>
                  <p className="text-sm text-ink-soft">Дата и время встречи</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-bold">{share.place ?? share.area ?? "Место в приложении"}</p>
                  <p className="text-sm text-ink-soft">Точка старта</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {share.people.count} из {share.capacity}
                  </p>
                  <p className="text-sm text-ink-soft">Уже присоединились</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-5">
              <Avatar person={{ name: share.host.name, avatarUrl: share.host.avatarUrl }} />
              <div>
                <p className="text-sm font-bold">{share.host.name}</p>
                <p className="text-sm text-ink-soft">
                  {share.host.verified ? "Проверенный организатор" : "Организатор"}
                </p>
              </div>
            </div>

            {share.people.preview.length > 0 ? (
              <div className="mt-5 flex items-center">
                {share.people.preview.map((person) => (
                  <div key={person.name} className="-ml-2 first:ml-0">
                    <Avatar person={person} />
                  </div>
                ))}
                <span className="ml-3 text-sm font-semibold text-ink-soft">
                  Люди уже внутри
                </span>
              </div>
            ) : null}
          </div>

          {share.partnerOffer ? (
            <div className="mt-5 flex gap-3 rounded-2xl bg-secondary-soft p-5">
              <Sparkles className="mt-0.5 h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-bold">{share.partnerName ?? "Партнер"}</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{share.partnerOffer}</p>
              </div>
            </div>
          ) : null}
        </aside>
      </section>

      {share.route?.steps.length ? (
        <section className="border-t border-hairline bg-paper px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[980px]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="lux-eyebrow">Маршрут</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
                  Места вечера
                </h2>
              </div>
              {share.route.durationLabel ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                  <Clock3 className="h-4 w-4" />
                  {share.route.durationLabel}
                </div>
              ) : null}
            </div>

            <div className="mt-10 grid gap-4">
              {share.route.steps.map((step, index) => (
                <article
                  key={step.id}
                  className="grid grid-cols-[auto_1fr] gap-4 border-t border-hairline py-5 md:grid-cols-[80px_1fr_auto]"
                >
                  <div className="text-sm font-bold text-primary">
                    {step.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{step.emoji}</span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink-soft">
                      {step.venue}, {step.address}
                    </p>
                    {step.description ? (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:justify-end">
                    {step.perk ? (
                      <span className="rounded-full bg-primary-soft px-3 py-2 text-xs font-bold text-primary">
                        {step.perk}
                      </span>
                    ) : null}
                    {step.walkMin ? (
                      <span className="rounded-full bg-background px-3 py-2 text-xs font-bold text-ink-soft">
                        {step.walkMin} мин пешком
                      </span>
                    ) : null}
                    <span className="rounded-full bg-background px-3 py-2 text-xs font-bold text-ink-soft">
                      {index + 1}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default PublicSharePage;
