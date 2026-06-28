"use client";

import React from "react";
import { Blocks, type BuilderBlock, type BuilderContextInterface } from "@builder.io/sdk-react";
import type { AccordionItem } from "./index";

export interface AccordionItemRendererProps {
  group: AccordionItem;
  index: number;
  isOpen: boolean;
  alwaysExpanded: boolean;
  contentHeight: number;
  accordionId: string;
  animationDuration: number;
  className?: string;
  groupHeadlineLevel: "h2" | "h3" | "h4" | "h5" | "h6";
  onToggle: (index: number) => void;
  contentRef: (el: HTMLDivElement | null) => void;
  itemRef: (el: HTMLDivElement | null) => void;
  builderBlock?: BuilderBlock;
  builderContext?: BuilderContextInterface;
}

export const AccordionItemRenderer: React.FC<AccordionItemRendererProps> = ({
  group,
  index,
  isOpen,
  alwaysExpanded,
  contentHeight,
  accordionId,
  animationDuration,
  className,
  groupHeadlineLevel,
  onToggle,
  contentRef,
  itemRef,
  builderBlock,
  builderContext,
}) => {
  const GroupHeadlineTag = groupHeadlineLevel;
  const buttonId = `accordion-${accordionId}-button-${index}`;
  const panelId = `accordion-${accordionId}-panel-${index}`;
  const itemClasses = alwaysExpanded ? "py-4 px-0" : "py-4 px-4";

  return (
    <div
      ref={itemRef}
      id={`accordion-${accordionId}-item-${index}`}
      className={`border-b border-primary last:border-b-0 ${className}`}
    >
      {alwaysExpanded ? (
        <div className={`w-full flex justify-between items-center ${itemClasses}`}>
          <GroupHeadlineTag id={buttonId} className="text-lg font-secondary text-left">
            {group.headline}
          </GroupHeadlineTag>
        </div>
      ) : (
        <button
          id={buttonId}
          onClick={() => onToggle(index)}
          className="w-full flex justify-between items-center py-4 px-4 rounded-none transition-colors duration-300"
          aria-expanded={isOpen}
          aria-controls={panelId}
          type="button"
        >
          <span className="text-lg font-secondary text-left">{group.headline}</span>
          <span
            className={`icon transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            {isOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
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
          maxHeight: isOpen ? `${contentHeight}px` : alwaysExpanded ? "auto" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
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

export default AccordionItemRenderer;
