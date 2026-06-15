import type { RegisteredComponent } from "@builder.io/sdk-react";
import EventSchemaData from "../components/seo/EventSchemaData";

// Helper function to conditionally set image property
const getImageConfig = () => {
  const envImage = process.env.NEXT_DEFAULT_COMPONENT_IMAGE;
  return envImage ? { image: envImage } : {};
};

export const seoComponents: RegisteredComponent[] = [
  {
    component: EventSchemaData,
    hideFromInsertMenu: true,
    name: "EventSchemaData",
    ...getImageConfig(),
    inputs: [
      // Required fields
      {
        name: "eventId",
        type: "text",
        required: true,
        helperText: "Unique identifier for the event",
      },
      {
        name: "name",
        type: "text",
        required: true,
        helperText: "Event name/title",
      },
      {
        name: "startDate",
        type: "date",
        required: true,
        helperText: "Event start date and time",
      },
      {
        name: "endDate",
        type: "date",
        helperText: "Event end date and time",
      },
      // Basic event details
      {
        name: "eventType",
        type: "text",
        enum: ["EducationEvent", "Event"],
        defaultValue: "EducationEvent",
        helperText: "Type of event",
      },
      {
        name: "description",
        type: "richText",
        helperText: "Event description",
      },
      {
        name: "teaches",
        type: "Tags",
        helperText: "What the event teaches",
      },
      {
        name: "eventAttendanceMode",
        type: "text",
        enum: [
          { label: "Online Event", value: "OnlineEventAttendanceMode" },
          { label: "In-Person Event", value: "OfflineEventAttendanceMode" },
          {
            label: "Hybrid (Online + In-Person)",
            value: "MixedEventAttendanceMode",
          },
        ],
        defaultValue: "OfflineEventAttendanceMode",
        helperText: "How attendees can participate",
      },
      {
        name: "eventStatus",
        type: "text",
        enum: [
          "EventScheduled",
          "EventCancelled",
          "EventMovedOnline",
          "EventPostponed",
          "EventRescheduled",
        ],
        defaultValue: "EventScheduled",
        helperText: "Current status of the event",
        advanced: true,
      },
      {
        name: "url",
        type: "url",
        advanced: true,
        helperText: "Override the default event page URL (default will be the path of the current page)",
      },
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
        helperText: "Event image or poster",
      },

      // Location
      {
        name: "location",
        type: "object",
        subFields: [
          {
            name: "type",
            type: "text",
            enum: ["Place", "VirtualLocation"],
            defaultValue: "Place",
            helperText: "Location type",
          },
          {
            name: "name",
            type: "text",
            helperText: "Location name",
          },
          {
            name: "url",
            type: "url",
            helperText: "Location URL (required for virtual events)",
          },
          {
            name: "address",
            type: "object",
            subFields: [
              {
                name: "address1",
                type: "text",
                required: true,
              },
              {
                name: "address2",
                type: "text",
              },
              {
                name: "city",
                type: "text",
              },
              {
                name: "state",
                type: "text",
              },
              {
                name: "postalCode",
                type: "text",
                helperText: "ZIP/Postal code",
              },
              {
                name: "country",
                type: "text",
                helperText: "Country code (e.g., US, CA)",
              },
            ],
          },
        ],
      },


      // Offers/Tickets
      {
        name: "offers",
        type: "list",
        subFields: [
          {
            name: "name",
            type: "text",
            helperText: "Offer name (e.g., 'Early Bird', 'General Admission')",
          },
          {
            name: "price",
            type: "text",
            helperText: "Price (e.g., '29.99' or '0' for free)",
          },
          {
            name: "priceCurrency",
            type: "text",
            defaultValue: "USD",
            helperText: "Currency code (USD, EUR, etc.)",
          },
          {
            name: "url",
            type: "url",
            helperText: "Registration/purchase URL",
          },
          {
            name: "availability",
            type: "text",
            enum: ["InStock", "SoldOut", "PreOrder"],
            defaultValue: "InStock",
            helperText: "Ticket availability",
          },
        ],
      },

      // Additional fields
      {
        name: "inLanguage",
        type: "text",
        defaultValue: "en-US",
        helperText: "Event language (e.g., en-US, es-ES)",
      },
      {
        name: "maximumAttendeeCapacity",
        type: "number",
        helperText: "Maximum number of attendees",
      },
      {
        name: "remainingAttendeeCapacity",
        type: "number",
        helperText: "Available spots remaining",
      },
    ],
    defaults: {
      bindings: {
        "component.options.name": "state.collection.title",
        "component.options.eventId": "state.content.data.handle",
        "component.options.description": "state.ecommCollection.description",
        "component.options.image": "state.ecommCollection.image.url",
        "component.options.location.type": "Place",
        "component.options.location.url": "state.location.data.url",
        "component.options.location.address": "state.location.data.address",
        "component.options.location.name": "state.ecommCollection.metadata.location.value",
      },
    },
  },
];
