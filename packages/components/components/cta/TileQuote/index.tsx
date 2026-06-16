import { FC } from "react";
import { Themeable, Alignable, TextAlignments, Heroic } from "@repo/types";
import { ThemeProvider } from "../common/ThemeProvider";

interface TileQuoteProps extends Themeable, Alignable, Heroic {
  quote: string;
  className?: string;
}

const alignmentClasses: Record<TextAlignments, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

const TileQuote: FC<TileQuoteProps> = ({
  quote,
  alignment = "center",
  theme = "light",
  inheritTheme = false,
  className = "",
  isHero = false,
  headline,
}) => {
  const content = (
    <div
      className={`component-tile ${isHero ? 'hero-tile' : ''} flex flex-col p-8 ${alignmentClasses[alignment]} bg-theme-bg text-theme-text ${className}`}
    >
      {headline && <h6>{headline}</h6>}
      <blockquote className="text-lg leading-relaxed italic text-theme-text">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </div>
  );

  // Only wrap in ThemeProvider if we have an explicit theme and inheritTheme is false
  if (inheritTheme || !theme) {
    return content;
  }

  return (
    <ThemeProvider theme={theme} inheritTheme={false}>
      {content}
    </ThemeProvider>
  );
};

export { TileQuote };
export default TileQuote;