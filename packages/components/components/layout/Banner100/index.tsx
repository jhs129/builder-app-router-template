"use client";

import {
  Blocks,
  type BuilderBlock,
  type BuilderContextInterface,
} from "@builder.io/sdk-react";
import { Themeable, Alignable, TextAlignments, Opaque, Stylable } from "@repo/types";
import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "../common/ThemeProvider";

interface Banner100Props extends Themeable, Alignable, Opaque, Stylable {
  content?: { blocks: BuilderBlock[] };
  builderBlock?: BuilderBlock;
  builderContext?: BuilderContextInterface;
  backgroundType?: "none" | "image" | "video" | "youtube";
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundVideoId?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

const alignmentClasses: Record<TextAlignments, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const;

const Banner100: React.FC<Banner100Props> = ({
  content,
  builderBlock,
  builderContext,
  backgroundType = "none",
  backgroundImage,
  backgroundVideo: videoFile,
  backgroundVideoId: videoEmbedId,
  maskOpacity = 0.4,
  children,
  fullWidth,
  alignment = "center",
  theme = "light",
  inheritTheme = false,
  className,
}) => {

  // Helper function to extract URL from Builder.io file object or string
  const getFileUrl = (file: any): string | null => {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file && typeof file === "object" && file.url) return file.url;
    return null;
  };

  // Process background URLs based on backgroundType
  const backgroundImageUrl =
    backgroundType === "image" ? getFileUrl(backgroundImage) : null;
  const videoFileUrl =
    backgroundType === "video" ? getFileUrl(videoFile) : null;

  const backgroundStyle = useMemo(() => {
    if (backgroundType !== "image" || !backgroundImageUrl) return {};

    return {
      backgroundImage: `url("${backgroundImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "460px",
    };
  }, [backgroundType, backgroundImageUrl]);

  // Check if we have any background media
  const hasBackgroundMedia = backgroundType !== "none";

  // Determine height classes based on background type
  const heightClasses = hasBackgroundMedia
    ? "min-h-[520px] md:h-[calc(15vw+400px)]"
    : "h-auto";

  // Generate YouTube embed URL
  const youtubeEmbedUrl =
    backgroundType === "youtube" && videoEmbedId
      ? `https://www.youtube.com/embed/${videoEmbedId}?autoplay=1&mute=1&loop=1&playlist=${videoEmbedId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
      : null;

  // Theme overlay class for better content visibility over backgrounds
  const themeOverlayClass = hasBackgroundMedia
    ? `text-theme-text relative before:content-[''] before:absolute before:inset-0 before:z-0 before:bg-theme-bg before:opacity-[var(--overlay-opacity,0.6)]`
    : "text-theme-text";

  // Dynamic opacity style for theme overlay
  const themeOverlayStyle = hasBackgroundMedia
    ? ({ "--overlay-opacity": maskOpacity } as React.CSSProperties)
    : {};

  const bannerContent = (
    <section
      className={`component-section ${className} flex flex-col w-full ${heightClasses} justify-center items-start ${themeOverlayClass} relative`}
      style={{ ...backgroundStyle, ...themeOverlayStyle }}
    >
      {/* Render video background if backgroundType is video */}
      {backgroundType === "video" && videoFileUrl && (
        <video
          src={videoFileUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* YouTube embed background */}
      {backgroundType === "youtube" && youtubeEmbedUrl && (
        <iframe
          src={youtubeEmbedUrl}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />
      )}

      <div
        className={`${!fullWidth ? "container" : "px-4"} w-full h-full flex items-center ${alignmentClasses[alignment]} z-[2] relative`}
      >
        {builderBlock && content?.blocks ? (
          <Blocks
            parent={builderBlock.id}
            path="component.options.content.blocks"
            blocks={content.blocks}
            context={builderContext}
            className="w-full"
          />
        ) : (
          children
        )}
      </div>
    </section>
  );

  // Only wrap in ThemeProvider if we have an explicit theme and inheritTheme is false
  if (inheritTheme || !theme) {
    return bannerContent;
  }

  return (
    <ThemeProvider theme={theme} inheritTheme={false}>
      {bannerContent}
    </ThemeProvider>
  );
};

export { Banner100 };
export default Banner100;
