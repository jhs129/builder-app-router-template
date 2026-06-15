export type DefaultBlockStyles = {
  boxSizing: string;
  flexShrink?: string;
  position: string;
  display: string;
  flexDirection: string;
  [key: string]: any;
};

export const defaultStyles: DefaultBlockStyles = {
  boxSizing: "border-box",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
};




