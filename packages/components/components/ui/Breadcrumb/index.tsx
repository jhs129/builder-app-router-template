import React, { FC } from "react";
import Link from "next/link";
import { ThemeProvider } from "../../common/ThemeProvider";
import { Themeable, BreadcrumbListSchema } from "@repo/types";

export interface BreadcrumbTrailItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Themeable {
  className?: string;
  items?: BreadcrumbTrailItem[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  className = "",
  theme,
  inheritTheme,
  items = [],
}) => {
  if (items.length === 0) return null;

  const schema: BreadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  const content = (
    <nav
      aria-label="Breadcrumb"
      className={`w-full bg-theme-bg text-theme-text px-6 md:px-12 lg:px-16 py-4 box-border ${className}`}
    >
      <ol role="list" className="w-full max-width-content mx-auto flex flex-row flex-wrap items-center gap-2 m-0 p-0 list-none text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex flex-row items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-theme-heading-alt hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-theme-text"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-theme-text opacity-60" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/<\//g, "<\\/"),
      }}
    />
  );

  if (inheritTheme || !theme)
    return (
      <>
        {jsonLd}
        {content}
      </>
    );
  return (
    <>
      {jsonLd}
      <ThemeProvider theme={theme} inheritTheme={false}>
        {content}
      </ThemeProvider>
    </>
  );
};

export { Breadcrumb };
export default Breadcrumb;
