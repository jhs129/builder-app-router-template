import type { RegisteredComponent } from "@builder.io/sdk-react";
import { registration as tileQuote } from "../components/cta/TileQuote/TileQuote.builder.registration";
import { registration as tileCTA } from "../components/cta/TileCTA/TileCTA.builder.registration";
import { registration as cardImageCTA } from "../components/cta/CardImageCTA/CardImageCTA.builder.registration";
import { registration as tileContent } from "../components/cta/TileContent/TileContent.builder.registration";
import { registration as tileImage } from "../components/cta/TileImage/TileImage.builder.registration";

// Each CTA component owns its own Builder registration alongside its
// implementation. This barrel just concatenates them in display order.
export const ctaComponents: RegisteredComponent[] = [
  ...tileQuote,
  ...tileCTA,
  ...cardImageCTA,
  ...tileContent,
  ...tileImage,
];
