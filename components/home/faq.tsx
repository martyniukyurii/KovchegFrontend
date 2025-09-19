import { Accordion, AccordionItem } from "@heroui/react";

import { useTranslation } from "@/hooks/useTranslation";

export function FAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faq.questions.buyingProcess.question"),
      answer: t("faq.questions.buyingProcess.answer"),
    },
    {
      question: t("faq.questions.mortgage.question"),
      answer: t("faq.questions.mortgage.answer"),
    },
    {
      question: t("faq.questions.commission.question"),
      answer: t("faq.questions.commission.answer"),
    },
    {
      question: t("faq.questions.onlineRent.question"),
      answer: t("faq.questions.onlineRent.answer"),
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center relative py-12">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
          {t("faq.title")}
        </h2>
        <div className="w-full max-w-3xl mx-auto">
          <Accordion
            variant="shadow"
            className="bg-background/80 backdrop-blur-sm border-primary/20"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                aria-label={faq.question}
                title={faq.question}
                className="text-foreground hover:bg-background/60 transition-colors"
              >
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
