import { FC, ReactNode } from "react";
import { Themeable, Alignable, Heroic, Opaque, Stylable } from "@repo/types";
import {
  alignmentClasses,
  childrenAlignmentClasses,
} from "@repo/types/design-kit/alignable";
import { ThemeProvider } from "../common/ThemeProvider";
import { Headline } from "../ui/Headline";
import { hasMeaningfulContent } from "../../utils/content";

interface TileContentProps
  extends Themeable,
    Alignable,
    Heroic,
    Opaque,
    Stylable {
  eyebrow?: string;
  eyebrowLevel?: "h5" | "h6";
  subheadline?: string;
  subheadlineLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  content: string;
  children?: ReactNode;
}

const TileContent: FC<TileContentProps> = ({
  eyebrow,
  eyebrowLevel,
  headline,
  subheadline,
  subheadlineLevel,
  isHero = false,
  content,
  alignment = "center",
  theme = "light",
  inheritTheme = false,
  className = "",
  children,
  maskOpacity = 0.3,
}) => {

  const tileContent = (
    <section
      className={`component-tile relative flex flex-col ${alignmentClasses[alignment]} bg-theme-bg ${maskOpacity > 0 ? 'text-white' : 'text-theme-text'} ${className}`}
    >
      {/* Overlay mask - only show if opacity > 0 */}
      {maskOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black rounded-xl pointer-events-none"
          style={{ opacity: maskOpacity }}
        />
      )}
      {/* Content with relative positioning to appear above mask */}
      <div className="relative z-10">
        {eyebrow && hasMeaningfulContent(eyebrow) && (
          <Headline level={eyebrowLevel} className="mb-2">{eyebrow}</Headline>
        )}
        {/* Title */}
        {headline && <Headline level="h2" isHero={isHero}>{headline}</Headline>}
        {subheadline && hasMeaningfulContent(subheadline) && (
          <Headline level={subheadlineLevel}>{subheadline}</Headline>
        )}
        {/* Description */}
        {hasMeaningfulContent(content) && (
          <div
            className={`${maskOpacity > 0 ? "text-white" : "text-theme-text"}`}
            dangerouslySetInnerHTML={{ 
              __html: typeof content === 'string' ? content : String(content || '') 
            }}
          />
        )}

        {/* Children (Buttons) */}
        {children && (
          <div
            className={`flex flex-col sm:flex-row w-full ${childrenAlignmentClasses[alignment]}`}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );

  // Only wrap in ThemeProvider if we have an explicit theme and inheritTheme is false
  if (!inheritTheme && theme) {
    return (
      <ThemeProvider
        theme={theme}
        inheritTheme={false}
      >
        {tileContent}
      </ThemeProvider>
    );
  }
  return tileContent;
};

export { TileContent };
export default TileContent;