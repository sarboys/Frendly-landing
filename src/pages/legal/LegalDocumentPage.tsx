import { Navigate, useParams } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { getLegalDocument } from "./legalContent";

const LegalDocumentPage = () => {
  const { slug = "" } = useParams();
  const document = getLegalDocument(slug);

  if (!document) {
    return <Navigate to="/legal" replace />;
  }

  return (
    <LegalLayout>
      <article className="max-w-4xl">
        <p className="lux-eyebrow">Обновлено · {document.updatedAt}</p>
        <h1 className="lux-h1 mt-5 text-[38px] min-[390px]:text-[46px] md:text-[72px] tracking-[-0.04em] leading-[0.95]">
          {document.title}
        </h1>
        <p className="mt-7 text-[16px] md:text-[18px] text-ink-soft leading-[1.7] max-w-2xl">{document.description}</p>

        <div className="mt-12 border-t border-hairline">
          {document.sections.map((section) => (
            <section key={section.title} className="py-8 border-b border-hairline">
              <h2 className="font-display text-[24px] md:text-[30px] leading-tight tracking-tight">{section.title}</h2>
              <div className="mt-5 space-y-4 text-[15px] md:text-[16px] text-ink-soft leading-[1.75]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </LegalLayout>
  );
};

export default LegalDocumentPage;
