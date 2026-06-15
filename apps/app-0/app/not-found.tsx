import React from "react";
import { fetchOneEntry } from "@builder.io/sdk-react";
import { DefaultHeader, Footer, NotFoundContent } from "@repo/components";
import { BUILDER_API_KEY } from "../lib/builder";
import RenderBuilderContent from "../components/RenderBuilderContent";

export default async function NotFound() {
  const page404 = await fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath: "/404" },
  });

  return (
    <>
      <DefaultHeader />
      <main className="container mx-auto flex lg:min-h-[550px] items-center justify-center">
        {page404 ? (
          <div className="w-full">
            <RenderBuilderContent content={page404} model="page" />
          </div>
        ) : (
          <NotFoundContent
            errorCode="404"
            title="Page Not Found"
            description="The page you're looking for doesn't exist or has been moved."
            backButtonText="Go Back"
            homeButtonText="Return Home"
          />
        )}
      </main>
      <Footer />
    </>
  );
}
