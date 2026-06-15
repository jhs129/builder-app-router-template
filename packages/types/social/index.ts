export const socialNetworkNames = [
  "facebook",
  "x",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "pinterest",
  "snapchat",
  "reddit",
  "discord",
  "telegram",
] as const;
export type SocialNetworkName = (typeof socialNetworkNames)[number];

export const socialNetworkIconStyles: Record<SocialNetworkName, string> = {
  facebook: "fab fa-facebook-f",
  x: "fab fa-x-twitter",
  instagram: "fab fa-instagram",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
  pinterest: "fab fa-pinterest-p",
  snapchat: "fab fa-snapchat-ghost",
  reddit: "fab fa-reddit-alien",
  discord: "fab fa-discord",
  telegram: "fab fa-telegram-plane",
};
