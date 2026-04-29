import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, ChevronLeft, Clock3, Loader2, ShieldAlert } from "lucide-react";
import iconV5 from "@/assets/icon-v5-sage.png";

type OfferCodeActivationStatus =
  | "activated"
  | "already_activated"
  | "expired"
  | "not_found";

type OfferCodeActivationResponse = {
  status: OfferCodeActivationStatus;
  offerTitle: string | null;
  venueName: string | null;
  partnerName: string | null;
  activatedAt: string | null;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://api.frendly.tech";

const formatActivationTime = (value: string | null) => {
  if (!value) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const statusCopy: Record<
  OfferCodeActivationStatus | "network_error",
  {
    title: string;
    text: string;
    tone: "success" | "warning" | "error";
  }
> = {
  activated: {
    title: "Предложение активировано",
    text: "Код принят. Можно применить предложение для этой встречи.",
    tone: "success",
  },
  already_activated: {
    title: "Код уже использован",
    text: "Это предложение уже было активировано раньше.",
    tone: "warning",
  },
  expired: {
    title: "Код истек",
    text: "Срок действия предложения закончился.",
    tone: "error",
  },
  not_found: {
    title: "Код не найден",
    text: "Проверьте ссылку или попросите гостя открыть QR еще раз.",
    tone: "error",
  },
  network_error: {
    title: "Не удалось проверить код",
    text: "Попробуйте обновить страницу через несколько секунд.",
    tone: "error",
  },
};

const toneClasses = {
  success: "bg-secondary-soft text-secondary",
  warning: "bg-primary-soft text-primary",
  error: "bg-destructive/10 text-destructive",
};

const OfferCodePage = () => {
  const { code = "" } = useParams();
  const [result, setResult] = useState<OfferCodeActivationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNetworkError(false);
    setResult(null);

    fetch(
      `${API_BASE_URL}/public/offer-codes/${encodeURIComponent(code)}/activate`,
      {
        method: "POST",
        signal: controller.signal,
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Activation failed");
        }
        return response.json() as Promise<OfferCodeActivationResponse>;
      })
      .then((data) => {
        setResult(data);
        document.title = `${statusCopy[data.status].title} · Frendly`;
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") {
          setNetworkError(true);
          document.title = "Код оффера · Frendly";
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [code]);

  const status = networkError ? "network_error" : result?.status ?? "activated";
  const copy = statusCopy[status];
  const placeLabel = result?.venueName ?? result?.partnerName ?? null;
  const activationTime = useMemo(
    () => formatActivationTime(result?.activatedAt ?? null),
    [result?.activatedAt],
  );

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={iconV5} alt="" className="h-10 w-10 rounded-[8px]" />
            <span className="text-sm font-bold">Frendly</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft"
          >
            <ChevronLeft className="h-4 w-4" />
            На главную
          </Link>
        </nav>

        <section className="flex flex-1 items-center py-12">
          <div className="w-full border-t border-hairline pt-10">
            {loading ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-5 text-base font-semibold">Проверяем код</p>
              </div>
            ) : (
              <div className="mx-auto max-w-xl text-center">
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-[8px] ${toneClasses[copy.tone]}`}
                >
                  {copy.tone === "success" ? (
                    <BadgeCheck className="h-8 w-8" />
                  ) : copy.tone === "warning" ? (
                    <Clock3 className="h-8 w-8" />
                  ) : (
                    <ShieldAlert className="h-8 w-8" />
                  )}
                </div>

                <p className="mt-8 lux-eyebrow">Frendly offer</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                  {copy.title}
                </h1>
                <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-ink-soft">
                  {copy.text}
                </p>

                {(result?.offerTitle || placeLabel || activationTime) && (
                  <dl className="mt-9 grid gap-3 border-t border-hairline pt-6 text-left">
                    {result?.offerTitle && (
                      <div className="flex items-start justify-between gap-5">
                        <dt className="text-sm text-ink-mute">Предложение</dt>
                        <dd className="max-w-[65%] text-right text-sm font-bold">
                          {result.offerTitle}
                        </dd>
                      </div>
                    )}
                    {placeLabel && (
                      <div className="flex items-start justify-between gap-5">
                        <dt className="text-sm text-ink-mute">Место</dt>
                        <dd className="max-w-[65%] text-right text-sm font-bold">
                          {placeLabel}
                        </dd>
                      </div>
                    )}
                    {activationTime && (
                      <div className="flex items-start justify-between gap-5">
                        <dt className="text-sm text-ink-mute">Время</dt>
                        <dd className="max-w-[65%] text-right text-sm font-bold">
                          {activationTime}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default OfferCodePage;
