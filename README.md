# nuxt-rosetta

🌹 Translate application content & effortlessly switch languages in Nuxt.

[✨ &nbsp;Release Notes](/CHANGELOG.md)

## Configuration

1. Install the module

```bash
pnpm add nuxt-rosetta
```

2. Create a config

```ts
// ~/rosetta.config.ts
import { defineRosettaConfig } from "rosetta";

export default defineRosettaConfig({
  reference: "en",
  translations: ["es", "fr"],
  cache: ".rosetta",
  messages: {
    home: "Home",
    example: "Example",
    info: "Information",
  },
});
```

3. Activate the module

```ts
// ~/nuxt.config.ts
import rosetta from "./rosetta.config";

export default defineNuxtConfig({
  modules: ["nuxt-rosetta"],
  rosetta,
});
```

4. Spend time in your garden, your translation system is complete!

## Features

The `nuxt-rosetta` module allows you to define a language configuration that offers:

- Automatic content translation at build-time
- Lazy-load language content
- Literally-typed language & message keys for improved DX

When `nuxt-rosetta` starts up, we hook into the Nuxt build to maintain a cache of translated language content that will default to the `~/.rosetta` directory. The [`@parvineyvazov/json-translator`](https://github.com/mololab/json-translator) package is used to manage translations, which are performed w/ the Google Translate API by default.

The module also registers a set of utility functions to manage the `nuxt-rosetta` configuration & a server API endpoint that returns translated content. State management of the active langauge code & message set is managed internally by Nuxt.

### Utilities

| Function                      | Description                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `useRosettaLanguage()`        | Access the reactive state of the currently active `language`.                                     |
| `useRosettaMessages()`        | Access the reactive state of the currently active `messages`.                                     |
| `useRosetta()`                | Access an object w/ both `language` & `messages` states.                                          |
| `isRosettaCode(code)`         | Check if a given string is a valid Rosetta language code.                                         |
| `isRosettaMessage(message)`   | Check if a given string is a valid Rosetta message code.                                          |
| `isRosettaScheme(scheme)`     | Check if a given object is a valid Rosetta message scheme.                                        |
| `useRosettaLanguageOptions()` | Access a list of currently active languages w/ `key` & `label` attributes.                        |
| `setRosettaLanguage(code)`    | Fetch a set of langauge content w/ a given langauge code & set the `language` & `messages` state. |
| `useRosettaMessage(message)`  | Access the reactive translated value of a given message code (alias `$t`).                        |

### Endpoints

| Endpoint              | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `/api/rosetta/[code]` | Check if a given code is valid & return the active translation JSON |

## License

MIT License &copy; 2024-PRESENT [Alexander Thorwaldson](https://github.com/zoobzio)
