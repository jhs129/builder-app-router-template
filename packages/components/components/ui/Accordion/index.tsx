"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { type BuilderBlock, type BuilderContextInterface } from "@builder.io/sdk-react";
import { Themeable, getThemeClasses, Stylable } from "@repo/types";
import { AccordionItemRenderer } from "./AccordionItemRenderer";

export interface AccordionItem {
  headline: string;
  content: { blocks: BuilderBlock[] };
  schemaAnswer?: string;
}

export interface AccordionProps extends Themeable, Stylable {
  groups: AccordionItem[];
  alignment?: string;
  builderBlock?: BuilderBlock;
  builderContext?: BuilderContextInterface;
  headline?: string;
  headlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  subheadline?: string;
  subheadlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  groupHeadlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  body?: string;
  alwaysExpanded?: boolean;
  isFAQ?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  groups = [],
  theme = "light",
  inheritTheme = false,
  alignment = "left",
  builderBlock,
  builderContext,
  headline,
  headlineLevel = "h2",
  subheadline,
  subheadlineLevel = "h3",
  groupHeadlineLevel = "h4",
  body,
  alwaysExpanded = false,
  className,
}) => {
  const animationDuration = 300;
  const HeadlineTag = headlineLevel;
  const SubheadlineTag = subheadlineLevel;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [contentHeights, setContentHeights] = useState<{ [key: number]: number }>({});
  const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // useId() is stable across server/client renders, preventing hydration mismatches with multiple accordions.
  const generatedId = useId();
  const accordionId = builderBlock?.id || generatedId;

  useEffect(() => {
    const newHeights: { [key: number]: number } = {};
    groups.forEach((_, index) => {
      const contentEl = contentRefs.current[index];
      if (contentEl) {
        newHeights[index] = contentEl.scrollHeight;
      }
    });
    setContentHeights(newHeights);
  }, [groups]);

  useEffect(() => {
    if (openIndex !== null && !alwaysExpanded) {
      const timeoutId = setTimeout(() => {
        const itemEl = itemRefs.current[openIndex];
        if (itemEl) {
          const rect = itemEl.getBoundingClientRect();
          if (rect.top < 0) {
            itemEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, animationDuration);
      return () => clearTimeout(timeoutId);
    }
  }, [openIndex, alwaysExpanded, animationDuration]);

  const toggleAccordion = (index: number) => {
    if (alwaysExpanded) return;
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const themeClasses = inheritTheme ? "" : getThemeClasses(theme);

  return (
    <div className={`accordion ${themeClasses} w-full`}>
      <div className="container">
        <HeadlineTag className={`text-${alignment || "left"}`}>{headline}</HeadlineTag>
        {subheadline && (
          <SubheadlineTag className={`text-${alignment || "left"}`}>{subheadline}</SubheadlineTag>
        )}
        {body && (
          <p
            className={`text-${alignment || "left"}`}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
        {groups.map((group, index) => (
          <AccordionItemRenderer
            key={index}
            group={group}
            index={index}
            isOpen={alwaysExpanded || openIndex === index}
            alwaysExpanded={alwaysExpanded}
            contentHeight={contentHeights[index] || 0}
            accordionId={accordionId}
            animationDuration={animationDuration}
            className={className}
            groupHeadlineLevel={groupHeadlineLevel}
            onToggle={toggleAccordion}
            contentRef={(el) => {
              contentRefs.current[index] = el;
            }}
            itemRef={(el) => {
              itemRefs.current[index] = el;
            }}
            builderBlock={builderBlock}
            builderContext={builderContext}
          />
        ))}
      </div>
    </div>
  );
};

export default Accordion;
