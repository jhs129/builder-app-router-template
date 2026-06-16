"use client";

import { Themeable, Alignable, TextAlignments, Stylable } from "@repo/types";
import Slider from "react-slick";
import React, { ReactNode } from "react";
import { ThemeProvider } from "../../common/ThemeProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type NavStyle = "arrows" | "dots" | "both" | "none";

interface CarouselProps extends Themeable, Alignable, Stylable {
  headline?: string;
  headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  description?: string;
  rowSize?: number;
  navStyle?: NavStyle;
  children?: ReactNode;
}

// Simple arrow components using SVG icons with solid fill
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
  >
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

export const Carousel: React.FC<CarouselProps> = ({
  headline,
  headlineLevel = "h2",
  description,
  theme,
  inheritTheme = false,
  alignment = "left",
  rowSize = 3,
  navStyle = "arrows",
  children,
  className,
}) => {
  const Headline = headlineLevel;

  const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      className="custom-prev-arrow absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200"
      onClick={onClick}
      aria-label="Previous slide"
      type="button"
    >
      <ChevronLeftIcon className="w-6 h-6 text-gray-700 fill-current" />
    </button>
  );

  const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      className="custom-next-arrow absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200"
      onClick={onClick}
      aria-label="Next slide"
      type="button"
    >
      <ChevronRightIcon className="w-6 h-6 text-gray-700 fill-current" />
    </button>
  );

  // Count the number of items to display
  const itemCount = React.Children.count(children);

  const settings = {
    dots: navStyle === "dots" || navStyle === "both",
    arrows: navStyle === "arrows" || navStyle === "both",
    infinite: itemCount > rowSize,
    speed: 500,
    slidesToShow: Math.min(rowSize, itemCount),
    slidesToScroll: Math.min(rowSize, itemCount),
    prevArrow: navStyle === "arrows" || navStyle === "both" ? <CustomPrevArrow /> : undefined,
    nextArrow: navStyle === "arrows" || navStyle === "both" ? <CustomNextArrow /> : undefined,
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: Math.min(Math.max(rowSize - 1, 1), itemCount),
          slidesToScroll: Math.min(Math.max(rowSize - 1, 1), itemCount),
          infinite: itemCount > Math.max(rowSize - 1, 1),
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(Math.max(rowSize - 2, 1), itemCount),
          slidesToScroll: Math.min(Math.max(rowSize - 2, 1), itemCount),
          infinite: itemCount > Math.max(rowSize - 2, 1),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: navStyle === "arrows" || navStyle === "both",
          dots: navStyle === "dots" || navStyle === "both",
          className: "mobile-carousel",
          centerMode: true,
          centerPadding: "20px",
          infinite: itemCount > 1,
        },
      },
    ],
  };

  const alignmentClasses: Record<TextAlignments, string> = {
    left: "text-left",
    center: "text-center", 
    right: "text-right",
  };

  return (
    <ThemeProvider theme={theme} inheritTheme={inheritTheme} className="component-section w-full py-8">
      <section className={`container mx-auto px-4 ${className}`}>
        <div className={`${alignmentClasses[alignment]} mb-8`}>
          {headline && <Headline className="mb-4 font-bold text-theme-heading">{headline}</Headline>}
          {description && <p className="mb-6 text-theme-text">{description}</p>}
        </div>

        <div className={`carousel-wrapper relative ${(navStyle === "dots" || navStyle === "both") ? "mb-12" : ""}`}>
          <Slider {...settings}>
            {children ? (
              React.Children.map(children, (child, index) => (
                <div key={index} className="carousel-slide px-2">
                  {child}
                </div>
              ))
            ) : (
              <div className="carousel-slide px-2">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">Add components here</p>
                </div>
              </div>
            )}
          </Slider>
        </div>
      </section>
    </ThemeProvider>
  );
};

export default Carousel;