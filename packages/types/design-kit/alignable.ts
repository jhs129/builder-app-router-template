export const textAlignments = ["left", "center", "right"] as const;
export type TextAlignments = (typeof textAlignments)[number];

export interface Alignable {
    alignment?: TextAlignments;
}

export const alignmentClasses: Record<TextAlignments, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

export const childrenAlignmentClasses: Record<TextAlignments, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const;

export const alignableInputs = [
    {
      name: "alignment",
      type: "string",
      defaultValue: "center",
      enum: textAlignments,
      helperText: "Content alignment within the component",
    },
  ] as const;