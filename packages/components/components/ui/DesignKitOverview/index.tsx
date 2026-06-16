"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Themeable, Theme, standardThemes } from "@repo/types";
import Button from "../Button";
import Banner100 from "../../layout/Banner100";
import { ThemeProvider } from "../../common/ThemeProvider";
import tailwindTheme from "../../../tailwind-theme.json";

interface DesignKitOverviewProps extends Themeable {
  className?: string;
}

interface ThemeColor {
  name: string;
  title: string;
  category: "primary" | "accent";
  value?: string;
}

// Function to extract hex/RGB value from CSS var definition
const extractColorValue = (colorDefinition: string): string => {
  // Extract the fallback value from var(--variable, fallback)
  const match = colorDefinition.match(/var\([^,]+,\s*([^)]+)\)/);
  if (match) {
    return match[1].trim();
  }
  // If no var() format, return the value as-is
  return colorDefinition;
};

// Function to dynamically extract colors from tailwind config
const extractColorsFromConfig = (): ThemeColor[] => {
  const colors = tailwindTheme?.colors || {};
  const colorList: ThemeColor[] = [];

  Object.keys(colors).forEach((colorKey) => {
    // Skip theme-aware colors as they are not static color swatches
    if (colorKey.startsWith("theme-")) {
      return;
    }

    // Determine category based on color name patterns
    let category: ThemeColor["category"] = "accent";

    if (colorKey.includes("primary") || colorKey.includes("secondary")) {
      category = "primary";
    }
   

    // Generate friendly title from color key
    const title = colorKey
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Extract the actual color value
    const colorDefinition = colors[colorKey as keyof typeof colors];
    const colorValue = extractColorValue(colorDefinition as string);

    colorList.push({
      name: colorKey,
      title,
      category,
      value: colorValue,
    });
  });

  return colorList;
};

// Get colors by category
const getColorsByCategory = (
  category: ThemeColor["category"],
  colors: ThemeColor[]
) => colors.filter((color) => color.category === category);

// Determine text color based on background color
const getTextColorForBackground = (colorName: string): string => {
  // Light colors get dark text
  const lightColors = ["primary-light", "secondary-light"];

  if (lightColors.includes(colorName)) {
    return "text-primary-dark";
  }

  // All other colors (dark and accent colors) get light text
  return "text-primary-light";
};

// Individual Color Swatch Component
interface ColorSwatchProps {
  color: ThemeColor;
  opacity: number;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ color, opacity }) => {
  return (
    <div key={color.name} className="text-center">
      <div
        className={`w-full h-12 bg-${color.name} shadow-lg rounded-lg mb-2 flex items-center justify-center`}
        style={{ opacity: opacity / 100 }}
      >
        <span
          className={`text-xs font-medium ${getTextColorForBackground(color.name)}`}
        >
          {color.title}
        </span>
      </div>
      {color.value && (
        <div className="text-xs text-theme-text-muted mt-1">{color.value}</div>
      )}
    </div>
  );
};

// Color Section Component
interface ColorSectionProps {
  title: string;
  colors: ThemeColor[];
  opacity: number;
  gridCols?: string;
}

const ColorSection: FC<ColorSectionProps> = ({
  title,
  colors,
  opacity,
  gridCols = "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
}) => {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-theme-heading">{title}</h3>
      <div className={`grid ${gridCols} gap-4`}>
        {colors.map((color) => (
          <ColorSwatch key={color.name} color={color} opacity={opacity} />
        ))}
      </div>
    </div>
  );
};

const DesignKitOverview: FC<DesignKitOverviewProps> = ({
  theme = "light",
  inheritTheme = false,
  className = "",
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme);
  const [opacity, setOpacity] = useState<number>(40);
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(true);

  // Check if current theme is a transparent theme
  const isTransparentTheme =
    currentTheme === "transparent-light" || currentTheme === "transparent-dark";

  // Extract colors dynamically from tailwind config
  const themeColors = extractColorsFromConfig();

  const content = (
    <div className={`component-section text-theme-text ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header with Theme Selector */}
        <div
          className={`mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
        >
          <div>
            <h1>Design Kit Overview</h1>
            <p className="text-theme-text-muted">
              A comprehensive view of all design elements and components
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="theme-selector"
                className="text-sm font-medium text-theme-text"
              >
                Current Theme:
              </label>
              <select
                id="theme-selector"
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value as Theme)}
                className="px-3 py-2 border rounded-lg bg-theme-bg text-theme-text border-gray-300"
              >
                {standardThemes.map((themeOption) => (
                  <option key={themeOption} value={themeOption}>
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-theme-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBackgroundImage}
                  onChange={(e) => setShowBackgroundImage(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                Show Background Image
              </label>
            </div>

            {!isTransparentTheme && showBackgroundImage && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="opacity-slider"
                  className="text-sm font-medium text-theme-text"
                >
                  Typography Background Mask Opacity: {opacity}%
                </label>
                <input
                  id="opacity-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-theme-bg rounded-lg appearance-none cursor-pointer border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Typography Section */}
        <Banner100
          backgroundType={showBackgroundImage ? "image" : "none"}
          backgroundImage={
            showBackgroundImage
              ? "https://cdn.builder.io/api/v1/image/assets%2Faa26d0ed43ef421da301a1603f38faeb%2F8b14eeae28114d33a5c8a95006468d3d?width=500&height=500"
              : undefined
          }
          maskOpacity={showBackgroundImage ? opacity / 100 : 0}
          theme={currentTheme}
          alignment="left"
          fullWidth={false}
        >
          <div className="w-full mb-12 p-4">
            <h2 className="mb-6">Banner 100</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div>
                    <h1>Heading 1 - Main Page Title</h1>
                  </div>
                  <div>
                    <h2>Heading 2 - Section Title</h2>
                  </div>
                  <div>
                    <h3>Heading 3 - Subsection Title</h3>
                  </div>
                  <div>
                    <h4>Heading 4 - Content Header</h4>
                  </div>
                  <div>
                    <h5>Heading 5 - Accent Style</h5>
                  </div>
                  <div>
                    <h6>HEADING 6 - UPPERCASE SMALL</h6>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Body Text & Elements</h3>
                <div className="space-y-4">
                  <div>
                    <p>
                      This is regular paragraph text that shows how body content
                      appears with the current theme. It demonstrates line
                      height, font weight, and color.
                    </p>
                  </div>
                  <div>
                    <blockquote className="text-lg leading-relaxed italic pl-4">
                      &ldquo;This is a blockquote showing how quoted content
                      appears in the design system.&rdquo;
                    </blockquote>
                  </div>
                  <div>
                    <p>
                      This text has a handwritten{" "}
                      <u className="underline-accent">underline</u> and shows{" "}
                      <a href="#"> how links appear</a>.
                    </p>
                    <Button
                      label="Sample Button"
                      inheritTheme={true}
                      href="#"
                      className="mt-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Banner100>
        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="mb-6 text-theme-heading">Theme Colors</h2>

          <ColorSection
            title="Primary Colors"
            colors={getColorsByCategory("primary", themeColors)}
            opacity={100}
          />

          <ColorSection
            title="Accent Colors"
            colors={getColorsByCategory("accent", themeColors)}
            opacity={100}
          />
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-theme-heading">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="mb-4 text-theme-heading">Primary Buttons</h3>
              <div className="space-y-3">
                <Button label="Default Button" inheritTheme={true} />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-theme-heading">Button States</h3>
              <div className="flex flex-col md:flex-row gap-2">
                <Button label="Normal" inheritTheme={true} />
                <Button
                  label="Hover"
                  inheritTheme={true}
                  className="hover:scale-105 transition-transform"
                />
                <Button
                  label="Disabled"
                  inheritTheme={true}
                  className="opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Images Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-theme-heading">Images & Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="mb-4 text-theme-heading">Standard Image</h3>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://placehold.co/400x300/e5e7eb/6b7280.png?text=Sample+Image"
                  alt="Sample image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-theme-heading">Portrait Image</h3>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="https://placehold.co/300x400/e5e7eb/6b7280.png?text=Portrait"
                  alt="Portrait image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-theme-heading">Square Image</h3>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="https://placehold.co/300x300/e5e7eb/6b7280.png?text=Square"
                  alt="Square image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-12">
          <h2 className="mb-6 text-theme-heading">Component Examples</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Example */}
            <div className="component-card rounded-lg overflow-hidden bg-theme-bg-alt text-theme-text-alt">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://placehold.co/400x300/e5e7eb/6b7280.png?text=Card+Image"
                  alt="Card example"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h6 className="mb-2 text-theme-heading-alt">CARD COMPONENT</h6>
                <h3 className="mb-4 text-theme-heading">Sample Card Title</h3>
                <p className="mb-4 text-theme-text-alt">
                  This demonstrates how a card component looks with the current
                  theme applied.
                </p>
                <Button label="Card Action" inheritTheme={true} />
              </div>
            </div>

            {/* Tile Example */}
            <div className="component-tile rounded-lg p-8 flex flex-col justify-center items-center text-center bg-theme-bg-alt text-theme-text-alt">
              <h6 className="mb-2 text-theme-heading-alt">TILE COMPONENT</h6>
              <h3 className="mb-4 text-theme-heading">Sample Tile Content</h3>
              <p className="mb-6 text-theme-text-alt">
                This shows how a tile component expands to fill available space
                while maintaining consistent theming.
              </p>
              <Button label="Tile Action" inheritTheme={true} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-theme-text border-opacity-20">
          <p className="opacity-75 text-theme-text-muted">
            Design Kit Overview - Current Theme: {currentTheme}
          </p>
        </footer>
      </div>
    </div>
  );

  // Only wrap in ThemeProvider if we have an explicit theme and inheritTheme is false
  if (inheritTheme || !theme) {
    return content;
  }

  return (
    <ThemeProvider theme={currentTheme} inheritTheme={false}>
      {content}
    </ThemeProvider>
  );
};

export { DesignKitOverview };
export default DesignKitOverview;
