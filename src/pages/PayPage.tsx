import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const supportEmail = "team@frendly.tech";

const paymentNotes = [
  {
    icon: CreditCard,
    title: "Банк и СБП",
    text: "Платежи проходят через T-Bank Internet Acquiring. Доступны банковские карты и СБП, если способ включен у провайдера.",
  },
  {
    icon: ShieldCheck,
    title: "Данные карты",
    text: "Frendly не хранит полные данные банковской карты. Обработку платежных данных выполняет платежный провайдер.",
  },
  {
    icon: Smartphone,
    title: "Доступ в приложении",
    text: "После подтверждения оплаты доступ к Frendly+ и другим платным функциям начисляется в аккаунт Frendly.",
  },
];

export default function PayPage() {
  useEffect(() => {
    document.title = "Оплата Frendly";
  }, []);

  return (
    <main className="landing-theme min-h-screen w-full bg-hero text-foreground overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-32 size-[36rem] rounded-full bg-lime-gradient opacity-20 blur-[120px]" />
        <div className="absolute top-1/4 -right-40 size-[34rem] rounded-full bg-pink-gradient opacity-20 blur-[120px]" />
        <div
          className="absolute bottom-0 left-1/4 size-[28rem] rounded-full opacity-15 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.7 0.18 305), transparent 70%)",
          }}
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
              Pay
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

      <section className="relative z-10 mx-auto max-w-5xl px-5 lg:px-10 pt-12 pb-20 lg:pt-20">
        <div className="mb-8 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Frendly payments
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="glass border border-white/10 rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-soft">
            <p className="mb-4 inline-flex rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
              Постоянная страница оплаты
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Оплата Frendly+
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Эта страница используется для внешней оплаты цифровых функций
              Frendly. Если вы открыли ее из приложения, вернитесь в приложение
              и нажмите кнопку оплаты еще раз.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-gradient px-5 py-3 text-sm font-bold text-lime-foreground shadow-glow transition hover:scale-[1.01]"
              >
                <Mail className="size-4" />
                Написать в поддержку
              </a>
              <Link
                to="/legal/payment-and-refund"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-foreground/90 transition hover:bg-white/10"
              >
                Оплата и возвраты
              </Link>
            </div>
          </div>

          <aside className="glass border border-white/10 rounded-[2rem] p-5 sm:p-6 shadow-soft">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Payment provider
            </p>
            <h2 className="mt-3 text-2xl font-semibold">T-Bank</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Платежная страница провайдера открывается после создания заказа.
              Чек, возврат и вопросы по доступу обрабатывает Frendly.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Поддержка</p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-1 inline-flex text-lime hover:text-foreground transition"
              >
                {supportEmail}
              </a>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {paymentNotes.map((note) => {
            const Icon = note.icon;
            return (
              <div
                key={note.title}
                className="glass border border-white/10 rounded-[1.5rem] p-5 shadow-soft"
              >
                <Icon className="size-5 text-lime" />
                <h3 className="mt-4 text-lg font-semibold">{note.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {note.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
