import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LegalLayout } from "./LegalLayout";
import { companyDetails, legalDocuments } from "./legalContent";

const detailRows = [
  ["ФИО ИП", "Поляков Сергей Викторович"],
  ["Правовая форма", "Индивидуальный предприниматель"],
  ["ИНН", companyDetails.inn],
  ["ОГРНИП", companyDetails.ogrnip],
  ["ОКПО", companyDetails.okpo],
  ["ОКТМО", companyDetails.oktmo],
  ["Рег. номер СФР", companyDetails.sfr],
  ["Email", companyDetails.email],
  ["Почтовый адрес", companyDetails.address],
];

const LegalIndex = () => (
  <LegalLayout>
    <div className="max-w-6xl">
      <div className="inline-flex items-center gap-2 glass border border-white/10 rounded-full px-3 py-1.5 text-xs">
        <span className="size-1.5 rounded-full bg-lime animate-pulse" />
        Публичные документы Frendly
      </div>

      <h1 className="mt-6 font-display font-semibold leading-[0.95] tracking-[-0.04em] text-[clamp(44px,8vw,104px)]">
        Правовая
        {" "}
        <span className="block text-muted-foreground/60">информация</span>
      </h1>

      <p className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
        Здесь собраны реквизиты оператора, условия использования Frendly, оферта, оплата,
        возвраты, удаление аккаунта, персональные данные, cookies, согласия и контакты поддержки.
      </p>

      <div className="mt-10 glass border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Реквизиты</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            ИП
          </span>
        </div>
        {detailRows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-5 border-t border-white/10 py-4 first:border-t-0 first:pt-0"
          >
            <div className="sm:col-span-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </div>
            <div className="sm:col-span-8 text-sm md:text-base text-foreground leading-relaxed">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Документы</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {legalDocuments.length} документов
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {legalDocuments.map((document) => (
          <Link
            key={document.slug}
            to={`/legal/${document.slug}`}
            className="group glass border border-white/10 rounded-[1.5rem] p-5 shadow-soft hover:border-lime/40 hover:-translate-y-1 transition duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Обновлено · {document.updatedAt}
                </p>
                <h3 className="font-display text-lg md:text-xl leading-tight font-semibold">
                  {document.title}
                </h3>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-muted-foreground group-hover:bg-lime group-hover:text-lime-foreground transition">
                <ArrowRight className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {document.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  </LegalLayout>
);

export default LegalIndex;
