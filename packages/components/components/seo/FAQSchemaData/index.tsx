import React from "react";
import type { FAQPage } from "@repo/types";

export interface FAQSchemaDataItem {
  name: string;
  text: string;
}

export interface FAQSchemaDataProps {
  items: FAQSchemaDataItem[];
}

export const FAQSchemaData: React.FC<FAQSchemaDataProps> = ({ items }) => {
  const filtered = items.filter((item) => item.name && item.text);
  if (filtered.length === 0) return null;

  const schema: FAQPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: filtered.map((item) => ({
      "@type": "Question",
      name: item.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.text,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export default FAQSchemaData;
