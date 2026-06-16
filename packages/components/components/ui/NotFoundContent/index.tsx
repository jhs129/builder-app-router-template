"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

interface NotFoundContentProps {
  className?: string;
  requestedPath?: string;
  errorCode?: string;
  title?: string;
  description?: string;
  backButtonText?: string;
  homeButtonText?: string;
}

const NotFoundContent = function({
  className = "",
  requestedPath = "",
  errorCode = "404",
  title = "Page Not Found",
  description = "The page you&apos;re looking for doesn&apos;t exist or has been moved.",
  backButtonText = "Go Back",
  homeButtonText = "Return Home",
}: NotFoundContentProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`max-w-xl w-full text-center ${className}`}>
      <h1 className="text-5xl font-bold text-primary-accent dark:text-primary-light mb-3">
        {errorCode}
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {title}
        {mounted && requestedPath ? ` - ${requestedPath}` : ""}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button label={backButtonText} onClick={() => router.back()} />
        <Button label={homeButtonText} href="/" />
      </div>
    </div>
  );
};

export { NotFoundContent };
export default NotFoundContent;
