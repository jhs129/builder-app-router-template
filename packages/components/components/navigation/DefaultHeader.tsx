"use client";

import Header from "./Header";
import { Navigation } from "@repo/types";
import { useSiteContext } from "../../contexts/SiteContextProvider";

const defaultNavigation: Navigation = {
  data: { level1: [] },
  ownerId: "",
  lastUpdateBy: null,
  createdDate: 0,
  id: "default",
  "@version": 1,
  name: "Default Navigation",
  modelId: "navigation",
  published: "published",
  priority: 0,
  query: [],
  lastUpdated: 0,
  firstPublished: 0,
  testRatio: 0,
  createdBy: "",
  lastUpdatedBy: "",
};

const DefaultHeader = function() {
  const { siteContext } = useSiteContext();

  const primaryNav =
    (siteContext?.data?.headerNavigation1?.value as Navigation) ||
    defaultNavigation;
  const secondaryNav =
    (siteContext?.data?.headerNavigation2?.value as Navigation) ||
    defaultNavigation;

  return <Header navigation1={primaryNav} navigation2={secondaryNav} />;
};

export { DefaultHeader };
export default DefaultHeader;
