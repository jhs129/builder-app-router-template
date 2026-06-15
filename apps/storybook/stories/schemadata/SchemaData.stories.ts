import type { Meta, StoryObj } from "@storybook/nextjs";
import { WebsiteSchemaData } from "@repo/components";
import React from "react";

// Custom decorator to display the JSON-LD output in a readable format
const SchemaDataDecorator = (Story: any, context: any) => {
  return React.createElement(
    "div",
    {
      className: "p-4 space-y-4",
    },
    [
      React.createElement(
        "div",
        {
          key: "story",
          className: "bg-gray-100 p-4 rounded-lg",
        },
        [
          React.createElement(
            "h3",
            {
              key: "title",
              className: "text-lg font-semibold mb-2",
            },
            "Schema Data Component"
          ),
          React.createElement(
            "p",
            {
              key: "description",
              className: "text-sm text-gray-600 mb-4",
            },
            "This component generates JSON-LD structured data for SEO. The actual output is a script tag that is not visible in the browser but is read by search engines."
          ),
          React.createElement(Story),
        ]
      ),
      React.createElement(
        "div",
        {
          key: "json-output",
          className: "bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto",
        },
        [
          React.createElement(
            "h4",
            {
              key: "json-title",
              className: "text-white font-semibold mb-2",
            },
            "Generated JSON-LD Output:"
          ),
          React.createElement(
            "pre",
            {
              key: "json-content",
              className: "text-xs",
            },
            JSON.stringify(context.args, null, 2)
          ),
        ]
      ),
    ]
  );
};

const websiteMeta = {
  title: "Schema Data/WebsiteSchemaData",
  component: WebsiteSchemaData,
  decorators: [SchemaDataDecorator],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "WebsiteSchemaData component generates JSON-LD structured data for websites to improve SEO and search engine understanding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    url: { control: "text" },
    description: { control: "text" },
    inLanguage: { control: "text" },
    publisher: { control: "object" },
    potentialAction: { control: "object" },
  },
} satisfies Meta<typeof WebsiteSchemaData>;

// Website Schema Stories
export default websiteMeta;
type WebsiteStory = StoryObj<typeof websiteMeta>;

export const DefaultWebsite: WebsiteStory = {
  args: {
    name: "Company Name",
    url: "https://www.companyname.com",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    inLanguage: "en-US",
  },
};

export const WebsiteWithPublisher: WebsiteStory = {
  args: {
    name: "Company Name",
    url: "https://www.companyname.com",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    inLanguage: "en-US",
    publisher: {
      name: "Company Name",
      url: "https://www.companyname.com",
    },
  },
};

export const WebsiteWithSearch: WebsiteStory = {
  args: {
    name: "Company Name",
    url: "https://www.companyname.com",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    inLanguage: "en-US",
    potentialAction: [
      {
        "@type": "SearchAction",
        target:
          "https://www.companyname.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    ],
  },
};
