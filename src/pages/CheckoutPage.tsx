import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, CreditCard, Loader2, Smartphone } from "lucide-react";
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

const CheckoutPage = () => {
  const { token = "", result } = useParams();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
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

  const startPayment = async (
    productKind: "subscription" | "tokens",
    productId: string,
  ) => {
    setBusyProductId(`${productKind}:${productId}`);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/public/checkout/${encodeURIComponent(token)}/payments/init`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ productKind, productId }),
        },
      );
      if (!response.ok) throw new Error("payment_init_failed");
      const order = (await response.json()) as PaymentOrder;
      if (!order.paymentUrl) throw new Error("payment_url_missing");
      window.location.href = order.paymentUrl;
    } catch {
      setError("Не удалось открыть оплату. Попробуйте еще раз.");
      setBusyProductId(null);
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
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-6">
        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
          >
            <ChevronLeft size={16} />
            На главную
          </Link>
          <Logo />
        </header>

        {loading ? (
          <div className="grid flex-1 place-items-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : error && !data ? (
          <div className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-card">
            <h1 className="text-2xl font-semibold">Оплата недоступна</h1>
            <p className="mt-3 text-muted-foreground">{error}</p>
          </div>
        ) : data ? (
          <div className="grid gap-5">
            <div className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-primary">Frendly+</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">
                {success ? "Оплата прошла" : "Лимиты кончились"}
              </h1>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {success
                  ? "Вернитесь в приложение. Подписка обновится после проверки платежа."
                  : "Оформите Frendly+ или купите токены. Карта и СБП доступны на странице T-Bank."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-primary">
                  {data.user.displayName || "Пользователь Frendly"}
                </span>
                {contact ? (
                  <span className="rounded-full bg-secondary-soft px-3 py-1 text-secondary">
                    {contact}
                  </span>
                ) : null}
                <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                  {data.subscription.status === "active" ||
                  data.subscription.status === "trial"
                    ? "Frendly+ активен"
                    : "Обычный аккаунт"}
                </span>
              </div>
              {success ? (
                <a
                  href={appReturnUrl}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground"
                >
                  <Smartphone size={18} />
                  Открыть Frendly
                </a>
              ) : null}
            </div>

            {!success ? (
              <>
                <section className="grid gap-3">
                  <h2 className="text-xl font-semibold">Подписка</h2>
                  {data.catalog.subscriptions.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => startPayment("subscription", plan.id)}
                      disabled={busyProductId !== null}
                      className="rounded-[var(--radius)] border border-border bg-card p-5 text-left shadow-soft transition hover:border-primary"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{plan.label}</h3>
                            {plan.badge ? (
                              <span className="rounded-full bg-primary-soft px-2 py-1 text-xs text-primary">
                                {plan.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {plan.benefits.slice(0, 3).join(" · ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">{plan.priceRub} ₽</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.priceMonthlyRub} ₽/мес
                          </p>
                        </div>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-2 text-primary">
                        Оплатить <ArrowRight size={16} />
                      </span>
                    </button>
                  ))}
                </section>

                <section className="grid gap-3">
                  <h2 className="text-xl font-semibold">Токены</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.catalog.tokenPacks.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => startPayment("tokens", pack.id)}
                        disabled={busyProductId !== null}
                        className="rounded-[var(--radius)] border border-border bg-card p-5 text-left shadow-soft transition hover:border-primary"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{pack.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pack.tokens + pack.bonus} FT
                            </p>
                          </div>
                          <CreditCard className="text-primary" size={20} />
                        </div>
                        <p className="mt-4 text-xl font-semibold">{pack.priceRub} ₽</p>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {error ? (
              <p className="rounded-[var(--radius)] bg-destructive/10 p-4 text-sm text-destructive">
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
