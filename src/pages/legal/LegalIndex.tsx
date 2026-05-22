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
    <div className="max-w-4xl">
      <p className="lux-eyebrow">Frendly · Legal</p>
      <h1 className="lux-h1 mt-5 text-[42px] min-[390px]:text-[52px] md:text-[78px] tracking-[-0.04em] leading-[0.95]">
        Правовая
        <br />
        информация
      </h1>
      <p className="mt-7 text-[16px] md:text-[18px] text-ink-soft leading-[1.7] max-w-2xl">
        Здесь собраны реквизиты оператора, условия использования Frendly, политика обработки персональных данных,
        согласие на обработку персональных данных и контакты поддержки.
      </p>

      <div className="mt-12 border-y border-hairline divide-y divide-hairline">
        {detailRows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-5 py-5">
            <div className="sm:col-span-4 lux-eyebrow text-[9px]">{label}</div>
            <div className="sm:col-span-8 text-[15px] md:text-[16px] text-foreground leading-relaxed">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
        {legalDocuments.map((document) => (
          <Link
            key={document.slug}
            to={`/legal/${document.slug}`}
            className="group border border-hairline bg-paper/60 p-5 shadow-soft hover:border-foreground/25 transition-colors"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="lux-eyebrow text-[9px] mb-3">Обновлено · {document.updatedAt}</p>
                <h2 className="font-display text-[22px] leading-tight tracking-tight">{document.title}</h2>
              </div>
              <ArrowRight className="w-4 h-4 mt-1 text-ink-mute group-hover:text-foreground transition-colors" />
            </div>
            <p className="mt-4 text-[14px] text-ink-soft leading-relaxed">{document.description}</p>
          </Link>
        ))}
      </div>
    </div>
  </LegalLayout>
);

export default LegalIndex;
