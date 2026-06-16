"use client";

import {
  Blocks,
  type BuilderBlock,
  type BuilderContextInterface,
} from "@builder.io/sdk-react";
import { useState, useRef, useEffect, useId } from "react";
import { Themeable, getThemeClasses, Stylable } from "@repo/types";

export interface AccordionItem {
  headline: string;
  content: { blocks: BuilderBlock[] };
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
  const animationDuration = 300; // Best practice: 300ms for smooth UX
  const HeadlineTag = headlineLevel;
  const SubheadlineTag = subheadlineLevel;
  const GroupHeadlineTag = groupHeadlineLevel;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [contentHeights, setContentHeights] = useState<{ [key: number]: number }>({});
  const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  // Generate a unique ID for this accordion instance to prevent conflicts with multiple accordions on the page.
  // useId() is stable across server/client renders to avoid hydration mismatches.
  const generatedId = useId();
  const accordionId = builderBlock?.id || generatedId;

  // Calculate content heights when groups change
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

  // Handle scroll-to-view when accordion opens
  useEffect(() => {
    if (openIndex !== null && !alwaysExpanded) {
      const timeoutId = setTimeout(() => {
        const itemEl = itemRefs.current[openIndex];
        if (itemEl) {
          const rect = itemEl.getBoundingClientRect();
          // Only scroll if the top of the element is above the viewport
          if (rect.top < 0) {
            itemEl.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }, animationDuration);

      return () => clearTimeout(timeoutId);
    }
  }, [openIndex, alwaysExpanded, animationDuration]);

  const toggleAccordion = (index: number) => {
    if (alwaysExpanded) return;
    
    setOpenIndex((currentIndex) => {
      // If clicking the open item, close it (null). Otherwise, open the clicked item
      return currentIndex === index ? null : index;
    });
  };

  const renderAccordionItem = (group: AccordionItem, index: number) => {
    const isOpen = alwaysExpanded || openIndex === index;
    const showIcon = !alwaysExpanded;
    const contentHeight = contentHeights[index] || 0;
    
    const buttonId = `accordion-${accordionId}-button-${index}`;
    const panelId = `accordion-${accordionId}-panel-${index}`;
    
    // Helper function for accordion item classes
    const getAccordionItemClasses = () => {
      if (alwaysExpanded) return "py-4 px-0";
      return "py-4 px-4";
    };

    return (
      <div
        key={index}
        ref={(el) => { itemRefs.current[index] = el; }}
        id={`accordion-${accordionId}-item-${index}`}
        className={`border-b border-primary last:border-b-0 ${className}`}
      >
        {alwaysExpanded ? (
          <div className={`w-full flex justify-between items-center ${getAccordionItemClasses()}`}>
            <GroupHeadlineTag 
              id={buttonId}
              className="text-lg font-secondary text-left"
            >
              {group.headline}
            </GroupHeadlineTag>
          </div>
        ) : (
          <button
            id={buttonId}
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center py-4 px-4 rounded-none transition-colors duration-300"
            aria-expanded={isOpen}
            aria-controls={panelId}
            type="button"
          >
            <span className="text-lg font-secondary text-left">
              {group.headline}
            </span>
            {showIcon && (
              <span
                className={`icon transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                {isOpen ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M4 8h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M8 4v8M4 8h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
            )}
          </button>
        )}
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`accordion-content overflow-hidden transition-all duration-${animationDuration} ${
            !alwaysExpanded ? "bg-tertiary bg-opacity-40" : ""
          }`}
          style={{
            maxHeight: isOpen ? `${contentHeight}px` : alwaysExpanded ? 'auto' : '0px',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div 
            ref={(el) => { contentRefs.current[index] = el; }}
            className={!alwaysExpanded ? "p-4" : "px-0 py-4"}
          >
            <Blocks
              parent={builderBlock?.id}
              path={`component.options.groups.${index}.content.blocks`}
              blocks={group.content?.blocks || []}
              context={builderContext}
            />
          </div>
        </div>
      </div>
    );
  };

  const themeClasses = inheritTheme ? "" : getThemeClasses(theme);

  return (
    <div className={`accordion ${themeClasses} w-full`}>
      <div className="container">
        <HeadlineTag className={`text-${alignment || "left"}`}>
          {headline}
        </HeadlineTag>
        {subheadline && (
          <SubheadlineTag className={`text-${alignment || "left"}`}>
            {subheadline}
          </SubheadlineTag>
        )}
        {body && (
          <p
            className={`text-${alignment || "left"}`}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
        {groups.map(renderAccordionItem)}
      </div>
    </div>
  );
};

export default Accordion;
