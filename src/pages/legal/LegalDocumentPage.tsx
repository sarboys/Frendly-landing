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
      <article className="max-w-5xl">
        <div className="inline-flex items-center gap-2 glass border border-white/10 rounded-full px-3 py-1.5 text-xs">
          <span className="size-1.5 rounded-full bg-lime" />
          Обновлено · {document.updatedAt}
        </div>

        <h1 className="mt-6 font-display font-semibold leading-[0.95] tracking-[-0.04em] text-[clamp(38px,7vw,88px)]">
          {document.title}
        </h1>

        <p className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {document.description}
        </p>

        <div className="mt-10 glass border border-white/10 rounded-[2rem] p-5 md:p-8 shadow-soft">
          {document.sections.map((section) => (
            <section
              key={section.title}
              className="border-t border-white/10 py-7 first:border-t-0 first:pt-0 last:pb-0"
            >
              <h2 className="font-display text-2xl md:text-3xl leading-tight font-semibold">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
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
