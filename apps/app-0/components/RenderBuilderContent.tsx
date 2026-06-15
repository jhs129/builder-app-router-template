"use client";

import React, { useEffect } from "react";
import { Content } from "@builder.io/sdk-react";
import { customComponents, registerBuilderEditor } from "@repo/components";
import { BUILDER_API_KEY } from "../lib/builder";
import { injectThemeStyles } from "../lib/theme-injection";

interface RenderBuilderContentProps {
  content: any;
  model: string;
  data?: Record<string, any>;
  locale?: string;
}

// Single client boundary for rendering Builder.io content with the Gen2 SDK.
// <Content> handles live editing/preview internally.
export default function RenderBuilderContent({
  content,
  model,
  data,
  locale,
}: RenderBuilderContentProps) {
  useEffect(() => {
    registerBuilderEditor();
    injectThemeStyles();
  }, []);

  return (
    <Content
      content={content}
      model={model}
      apiKey={BUILDER_API_KEY}
      customComponents={customComponents}
      data={data}
      locale={locale}
      enrich
    />
  );
}
