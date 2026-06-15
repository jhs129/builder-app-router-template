"use client";

import React, { useState, useEffect } from "react";
import { Themeable, getThemeClasses } from "@repo/types";
import { Stylable } from "@repo/types";

export interface AlertProps extends Themeable, Stylable {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  icon?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  message,
  dismissible = true,
  autoHide = false,
  autoHideDelay = 5000,
  icon,
  onDismiss,
  theme = "light",
  className = "",
  inheritTheme = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      default:
        return "border-blue-200 bg-blue-50 text-blue-800";
    }
  };

  const getVariantIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  };

  if (!isVisible) return null;

  const themeClasses = inheritTheme ? "" : getThemeClasses(theme);
  const variantClasses = getVariantClasses();

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 border rounded-lg
        ${themeClasses}
        ${variantClasses}
        ${className}
      `.trim()}
      role="alert"
    >
      <div className="flex-shrink-0 text-lg font-medium">
        {getVariantIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium text-theme-heading mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-theme-text">
          {message}
        </p>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="
            flex-shrink-0 ml-auto pl-3 text-theme-text hover:text-theme-heading
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            rounded transition-colors duration-200
          "
          aria-label="Dismiss alert"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;