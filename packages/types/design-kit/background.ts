export const backgroundTypes = [
    "image",
    "video",
    "youtube",
    "none",
    "color",
  ] as const;
  export type BackgroundType = (typeof backgroundTypes)[number];

  export const backgroundInputs = [
    {
      name: "backgroundType",
      type: "string",
      required: true,
      enum: backgroundTypes,
      defaultValue: "none",
      helperText: "Type of background to display",
    },
    {
      name: "backgroundImage",
      type: "file",
      showIf: (options: any) => options.get("backgroundType") === "image",
      helperText: "Background image file",
    },
    {
      name: "backgroundVideoFile",
      type: "file",
      allowedFileTypes: ["mp4", "webm"],
      showIf: (options: any) => options.get("backgroundType") === "video",
      helperText: "Background video file",
    },
    {
      name: "backgroundVideoId",
      type: "string",
      showIf: (options: any) => options.get("backgroundType") === "youtube",
      helperText: "YouTube video ID for background",
    },
  ] as const;