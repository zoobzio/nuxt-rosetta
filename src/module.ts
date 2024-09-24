import {
  addImportsDir,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  useNitro,
  useLogger,
  addServerScanDir,
} from "@nuxt/kit";
import { useRosettaCache } from "./service/translate";
import { useLanguages } from "./config";
import type { LanguageCode } from "./config";

interface RosettaNuxtOptions {
  reference: LanguageCode;
  translations: LanguageCode[];
  cache: string;
  messages: Record<string, string>; // TODO consider supporting nested messages
}

export default defineNuxtModule<RosettaNuxtOptions>({
  meta: {
    name: "nuxt-rosetta",
    configKey: "rosetta",
  },
  defaults: {
    reference: "en",
    translations: ["es", "fr"],
    cache: ".rosetta",
    messages: {},
  },
  async setup(options, nuxt) {
    const logger = useLogger();

    if (Object.keys(options.messages).length === 0) {
      logger.info("No messages to translate, skipping nuxt-rosetta...");
      return;
    }

    const codes = [options.reference, ...options.translations];
    const cacheDir = `${nuxt.options.rootDir}/${options.cache}`;

    nuxt.hook("build:before", async () => {
      logger.debug("Started translation...");
      try {
        await useRosettaCache({
          cache: cacheDir,
          reference: options.reference,
          translations: options.translations,
          messages: options.messages,
        });
      } catch (err) {
        logger.error(err);
      }
      logger.debug("Finished translation!");
    });

    nuxt.hook("ready", () => {
      const nitro = useNitro();
      nitro.options.serverAssets.push({
        baseName: "rosetta",
        dir: `${cacheDir}/`,
      });
    });

    addTemplate({
      filename: "rosetta.config.mjs",
      getContents: () =>
        [
          `export const language = "${options.reference}";`,
          `export const languages = ${JSON.stringify(useLanguages(codes))};`,
          `export const codes = ${JSON.stringify(codes)};`,
          `export const messages = ${JSON.stringify(options.messages)}`,
        ].join("\n"),
    });

    addTypeTemplate({
      filename: "types/rosetta.d.ts",
      getContents: () =>
        [
          `export type RosettaCode = ${codes.map((c) => `"${c}"`).join(" | ")};`,
          `export type RosettaMessage = ${Object.keys(options.messages)
            .map((m) => `"${m}"`)
            .join(" | ")};`,
        ].join("\n"),
    });

    const { resolve } = createResolver(import.meta.url);
    addImportsDir(resolve("../runtime/utils"));
    addServerScanDir(resolve("../runtime/server"));
  },
});
