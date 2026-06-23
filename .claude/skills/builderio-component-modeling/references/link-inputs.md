# CMS link & reference inputs

A link is never just a string. It either points at an external URL, or at a CMS entry whose
real URL is resolved later (and changes when the entry's slug changes). Modeling links as a
**typed, structured value** chosen through a custom editor input is what makes internal links
survive content changes and lets editors pick a page from a list instead of pasting fragile
URLs.

Both reference repos ship a custom link input — Orlando Health calls it `CMSLink`, Aventiv
calls it `DynamicLink` — built on the same idea.

## Table of contents
- [The link value shape](#the-link-value-shape)
- [Registering a custom editor input type](#registering-a-custom-editor-input-type)
- [Using the custom type in a config](#using-the-custom-type-in-a-config)
- [The input value vs. the saved value](#the-input-value-vs-the-saved-value)
- [Plugin settings: models the editor can link to](#plugin-settings-models-the-editor-can-link-to)
- [Built-in alternatives & when to use them](#built-in-alternatives--when-to-use-them)
- [Modeling checklist](#modeling-checklist)

## The link value shape

The stored value is a small object with a discriminant:

```ts
{
  type: "url" | "model",     // (Aventiv adds "dynamicUrl")
  href: string,              // external URL, or a resolved/last-known href
  model?: string,            // CMS model name when type === "model"
  referenceId?: string,      // the entry's id when type === "model"
}
```

- **`type: "url"`** — an external/manual link; `href` is the literal URL.
- **`type: "model"`** — an internal link to a CMS entry. `model` + `referenceId` identify the
  entry; the renderer resolves the live URL from those at render time, so the link follows the
  entry even if its slug changes. `href` may hold a last-known/cached value but the reference
  is the source of truth.

Aventiv's `"dynamicUrl"` variant adds linking to a parameterized URL template (a `base`
`{ name, label, value }`) for patterns like search result or detail routes.

This discriminated shape is the whole point: the renderer switches on `type` to decide whether
to use `href` directly or resolve the reference. Model your renderer the same way.

## Registering a custom editor input type

A custom input type is a React component registered with `Builder.registerEditor` (Gen 1).
Its name becomes a usable `type` string in any config. The editor component receives `value`
and `onChange` and renders whatever UI it wants (a type toggle, a URL field, a "pick content"
button that opens a model browser).

```ts
// plugins/aventiv-builder/src/plugin.tsx
import { Builder } from "@builder.io/react";
import DynamicLinkInput from "./components/DynamicLinkInput";

Builder.registerEditor({
  name: "DynamicLink",          // becomes type: "DynamicLink" in configs
  component: DynamicLinkInput,  // the editor UI
});
```

The editor component's contract (from the repos):

```ts
interface CMSLinkProps {
  value: {
    get(key: "type" | "href" | "model" | "referenceId"): string | undefined;
    type: "url" | "model"; href: string; model?: string; referenceId?: string;
  };
  onChange: (value: { type: "url" | "model"; href: string;
                      model?: string; referenceId?: string }) => void;
  apiKey: string;                          // to query the content API
  models: { name: string; displayName: string }[]; // which models are linkable
}
```

Internally it: reads the saved value via `value.get(...)`, lets the editor switch `type`,
and for `type: "model"` opens a **content selector** that queries
`https://cdn.builder.io/api/v2/content/{model}` and writes back `{ type, href, referenceId,
model }` via `onChange`. When the editor switches back to `url`, it clears `model`/`referenceId`
so stale reference data doesn't linger.

You usually build this once per project (or copy it from a reference repo) and reuse it
everywhere via the registered type name.

## Using the custom type in a config

Once registered, it's just a `type` like any other input:

```ts
export const DynamicLinkConfig = {
  name: "DynamicLink", friendlyName: "Dynamic Link",
  inputs: [
    { name: "link", type: "DynamicLink" },               // the custom type
    { name: "label", type: "string", required: true,
      defaultValue: "[Link Label]", localized: true },
    ...makeOptional(themeableInputs),
  ],
  defaultStyles: { display: "inline" },
};
```

In Orlando Health it appears inside many CTA configs as a single field:
`{ name: "link", type: "CMSLink" }` alongside the tile's text and image inputs. A CTA tile,
a button, and a list item all reuse the same link type — consistent linking everywhere.

## The input value vs. the saved value

A subtlety worth modeling correctly: Builder hands the editor component a `value` that has a
`.get(key)` accessor, but you send back a **plain object** (no `get`). The repos type these
separately:

```ts
interface DynamicLinkInputValue { get(key): string|undefined; type; href; model?; referenceId?; }
interface DynamicLinkValue      { type; href; model?; referenceId?; }   // what onChange sends
```

Read with `value.get("href")`; write with `onChange({ type, href, model, referenceId })`.
Mixing these up is the most common bug in custom inputs.

## Plugin settings: models the editor can link to

Which CMS models are linkable shouldn't be hardcoded in the input — it's per-project config.
Register a plugin with settings so each space configures its own linkable models (and API
keys), and the input reads them:

```ts
Builder.register("plugin", {
  id: pluginId, name: "Aventiv Builder",
  settings: [
    { name: "dynamicLinkConfig", type: "object", subFields: [
      { name: "models", type: "list", subFields: [
        { name: "name", type: "string" }, { name: "displayName", type: "string" } ] },
      { name: "dynamicUrls", type: "list", subFields: [
        { name: "name", type: "string" }, { name: "label", type: "string" },
        { name: "value", type: "string" } ] },
    ]},
  ],
});
```

This keeps the link *type* generic and pushes the *list of linkable things* to configuration —
the same "shared shape, injected specifics" principle as theme bundles.

## Built-in alternatives & when to use them

- **`type: "reference"`** — Builder's built-in single-entry reference. Use for a plain
  "pick one entry" relationship where you don't need the url/model discriminant or a custom UI.
  Orlando Health uses it for direct content references; it uses `CMSLink` when the value must
  also support an external URL and resolve to a navigable href.
- **A bare `string` URL** — only for genuinely external, manually-entered links where there's
  no CMS entry to point at. Never use a string for internal navigation; slugs change and the
  link rots.

Rule of thumb: **internal navigation → custom link type or `reference`; external-only → string.**

## Modeling checklist

- [ ] Is this link ever internal? → use a typed link input, not a string.
- [ ] Does the value carry `type` + (`href` | `model`+`referenceId`)?
- [ ] Does the renderer switch on `type` to resolve the URL?
- [ ] Are linkable models configured (plugin settings), not hardcoded in the input?
- [ ] Reused via the registered type name across all components that link?
