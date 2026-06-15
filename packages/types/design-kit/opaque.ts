export interface Opaque {
  maskOpacity?: number;
}

export const opacityInputs = [
    {
      name: "maskOpacity",
      type: "number",
      defaultValue: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
      helperText: "Opacity of the overlay mask (0-1)",
    },
  ] as const;