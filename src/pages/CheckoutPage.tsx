import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Coins,
  CreditCard,
  Crown,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Logo } from "@/components/Logo";

type CheckoutPlan = {
  id: string;
  label: string;
  description: string;
  priceRub: number;
  priceMonthlyRub: number;
  badge: string | null;
  benefits: string[];
};

type CheckoutTokenPack = {
  id: string;
  label: string;
  tokens: number;
  bonus: number;
  priceRub: number;
  originalPriceRub: number | null;
  discountPercent: number;
  best: boolean;
};

type CheckoutData = {
  token: string;
  source: string;
  returnTo: string;
  expiresAt: string;
  user: {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  catalog: {
    subscriptions: CheckoutPlan[];
    tokenPacks: CheckoutTokenPack[];
    plusBenefits?: string[];
  };
  subscription: {
    status: string;
    plan: string | null;
  };
  datingLimits: {
    hourlySwipes?: {
      remaining?: number | null;
      resetAt?: string | null;
    };
  } | null;
  appReturnUrl: string;
};

type PaymentOrder = {
  orderId: string;
  status: string;
  paymentUrl: string | null;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://api.frendly.tech";

const fallbackBenefits = [
  "Больше встреч и лайков",
  "Приоритет в радаре",
  "Расширенные фильтры",
  "Закрытые встречи Frendly+",
  "Больше лимитов в дейтинге",
];

const CheckoutPage = () => {
  const { token = "", result } = useParams();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedTokenPackId, setSelectedTokenPackId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<PaymentOrder | null>(null);

  const orderId = useMemo(() => {
    return new URLSearchParams(window.location.search).get("orderId");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/public/checkout/${encodeURIComponent(token)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("checkout_load_failed");
        return response.json() as Promise<CheckoutData>;
      })
      .then((payload) => {
        setData(payload);
        setSelectedPlanId((current) => {
          return current ?? payload.catalog.subscriptions[0]?.id ?? null;
        });
        document.title = "Оплата Frendly";
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== "AbortError") {
          setError("Ссылка оплаты не найдена или истекла.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    if (!orderId || !token) return;
    const controller = new AbortController();

    fetch(
      `${API_BASE_URL}/public/checkout/${encodeURIComponent(token)}/payments/${encodeURIComponent(orderId)}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("payment_check_failed");
        return response.json() as Promise<PaymentOrder>;
      })
      .then(setPayment)
      .catch(() => undefined);

    return () => controller.abort();
  }, [orderId, token]);

  const selectedPlan = useMemo(() => {
    return (
      data?.catalog.subscriptions.find((plan) => plan.id === selectedPlanId) ??
      null
    );
  }, [data, selectedPlanId]);

  const selectedTokenPack = useMemo(() => {
    return (
      data?.catalog.tokenPacks.find((pack) => pack.id === selectedTokenPackId) ??
      null
    );
  }, [data, selectedTokenPackId]);

  const totalRub =
    (selectedPlan?.priceRub ?? 0) + (selectedTokenPack?.priceRub ?? 0);

  const benefits = useMemo(() => {
    const labels = [
      ...(data?.catalog.plusBenefits ?? []),
      ...(selectedPlan?.benefits ?? []),
      ...fallbackBenefits,
    ];
    return Array.from(new Set(labels.map((item) => item.trim()).filter(Boolean)))
      .slice(0, 5);
  }, [data, selectedPlan]);

  const startPayment = async () => {
    if (!selectedPlan && !selectedTokenPack) {
      setError("Выберите подписку или токены.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = selectedPlan
        ? {
            productKind: "bundle",
            subscriptionProductId: selectedPlan.id,
            tokenProductId: selectedTokenPack?.id ?? null,
          }
        : {
            productKind: "tokens",
            productId: selectedTokenPack?.id,
          };
      const response = await fetch(
        `${API_BASE_URL}/public/checkout/${encodeURIComponent(token)}/payments/init`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) throw new Error("payment_init_failed");
      const order = (await response.json()) as PaymentOrder;
      if (!order.paymentUrl) throw new Error("payment_url_missing");
      window.location.href = order.paymentUrl;
    } catch {
      setError("Не удалось открыть оплату. Попробуйте еще раз.");
      setBusy(false);
    }
  };

  const contact = data?.user.email ?? data?.user.phoneNumber ?? null;
  const success = result === "success" || payment?.status === "confirmed";
  const appReturnUrl = useMemo(() => {
    if (!data) return "#";
    const url = new URL(data.appReturnUrl);
    if (orderId) url.searchParams.set("orderId", orderId);
    return url.toString();
  }, [data, orderId]);

  return (
    <main className="landing-theme min-h-screen overflow-x-hidden bg-hero text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-40 size-[30rem] rounded-full bg-lime-gradient opacity-20 blur-[110px]" />
        <div className="absolute -right-36 top-1/4 size-[32rem] rounded-full bg-pink-gradient opacity-25 blur-[120px]" />
        <div
          className="absolute bottom-0 left-1/4 size-[26rem] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.7 0.18 305), transparent 70%)",
          }}
        />
      </div>
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-4 pt-3 sm:px-5 sm:py-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="glass inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-muted-foreground shadow-soft transition hover:bg-white/10"
          >
            <ChevronLeft size={15} />
            На главную
          </Link>
          <Logo />
        </header>

        {loading ? (
          <div className="grid flex-1 place-items-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : error && !data ? (
          <div className="glass rounded-3xl border border-white/10 p-5 shadow-soft">
            <h1 className="text-2xl font-semibold">Оплата недоступна</h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : data ? (
          <div className="grid flex-1 gap-3 pb-24">
            <div className="glass rounded-[28px] border border-white/10 p-4 shadow-soft sm:p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime-gradient text-lime-foreground shadow-glow">
                  {success ? <Check size={20} /> : <Crown size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-lime">Frendly+</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
                    {success ? "Оплата прошла" : "Выберите доступ"}
                  </h1>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">
                    {success
                      ? "Вернитесь в приложение. Plus и FT обновятся после проверки платежа."
                      : "Можно взять Plus и сразу добавить FT. Оплата одна, картой или СБП через T-Bank."}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-lime">
                  {data.user.displayName || "Пользователь Frendly"}
                </span>
                {contact ? (
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-muted-foreground">
                    {contact}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-muted-foreground">
                  {data.subscription.status === "active" ||
                  data.subscription.status === "trial"
                    ? "Frendly+ активен"
                    : "Обычный аккаунт"}
                </span>
              </div>
              {success ? (
                <a
                  href={appReturnUrl}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-gradient px-5 py-3 text-sm font-bold text-lime-foreground shadow-glow transition hover:scale-[1.01] sm:w-auto"
                >
                  <Smartphone size={18} />
                  Открыть Frendly
                </a>
              ) : null}
            </div>

            {!success ? (
              <>
                <section className="glass rounded-[28px] border border-white/10 p-4 shadow-soft">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
                        Подписка
                      </p>
                      <h2 className="text-lg font-semibold">Frendly Plus</h2>
                    </div>
                    <ShieldCheck className="text-lime" size={20} />
                  </div>
                  <div className="grid gap-2">
                    {data.catalog.subscriptions.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        disabled={busy}
                        className={`rounded-2xl border p-3 text-left transition ${
                          selectedPlanId === plan.id
                            ? "border-lime/50 bg-lime/10 shadow-glow"
                            : "border-white/10 bg-surface/30 hover:border-lime/40 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">{plan.label}</h3>
                              {plan.badge ? (
                                <span className="rounded-full border border-lime/20 bg-lime/10 px-2 py-0.5 text-[11px] text-lime">
                                  {plan.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {plan.description}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-lg font-semibold">{plan.priceRub} ₽</p>
                            <p className="text-[11px] text-muted-foreground">
                              {plan.priceMonthlyRub} ₽/мес
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground"
                      >
                        <Check className="shrink-0 text-lime" size={14} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="glass rounded-[28px] border border-white/10 p-4 shadow-soft">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
                        Дополнительно
                      </p>
                      <h2 className="text-lg font-semibold">FT токены</h2>
                    </div>
                    <Coins className="text-lime" size={21} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTokenPackId(null)}
                      disabled={busy}
                      className={`rounded-2xl border p-3 text-left text-sm transition ${
                        selectedTokenPackId == null
                          ? "border-lime/50 bg-lime/10"
                          : "border-white/10 bg-surface/30 hover:border-lime/40 hover:bg-white/10"
                      }`}
                    >
                      <p className="font-semibold">Без FT</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Только Plus
                      </p>
                    </button>
                    {data.catalog.tokenPacks.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedTokenPackId(pack.id)}
                        disabled={busy}
                        className={`rounded-2xl border p-3 text-left transition ${
                          selectedTokenPackId === pack.id
                            ? "border-lime/50 bg-lime/10"
                            : "border-white/10 bg-surface/30 hover:border-lime/40 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{pack.label}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {pack.tokens + pack.bonus} FT
                            </p>
                          </div>
                          {pack.best ? (
                            <span className="rounded-full bg-lime-gradient px-2 py-0.5 text-[10px] font-bold text-lime-foreground">
                              топ
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex items-end gap-2">
                          <p className="text-base font-semibold">{pack.priceRub} ₽</p>
                          {pack.originalPriceRub ? (
                            <p className="text-xs text-muted-foreground line-through">
                              {pack.originalPriceRub} ₽
                            </p>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="glass sticky bottom-3 z-10 rounded-[28px] border border-white/10 p-3 shadow-soft backdrop-blur">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">К оплате</p>
                      <p className="truncate text-sm font-semibold">
                        {selectedPlan?.label ?? "Без Plus"}
                        {selectedTokenPack
                          ? ` + ${selectedTokenPack.tokens + selectedTokenPack.bonus} FT`
                          : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-2xl font-semibold">{totalRub} ₽</p>
                  </div>
                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={busy || totalRub <= 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-gradient px-5 py-3 text-sm font-bold text-lime-foreground shadow-glow transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard size={17} />
                    )}
                    Оплатить
                    {!busy ? <ArrowRight size={17} /> : null}
                  </button>
                </div>
              </>
            ) : null}

            {error ? (
              <p className="rounded-3xl border border-pink/30 bg-pink/10 p-4 text-sm text-pink">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default CheckoutPage;
