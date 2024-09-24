import { promises as fs } from "node:fs";
import { translateFile } from "@parvineyvazov/json-translator";
import { useLogger } from "@nuxt/kit";

export async function useRosettaTranslator(
  path: string,
  from: string,
  to: string[],
) {
  // @ts-expect-error 4th arg not required
  return await translateFile(path, from, to);
}

export async function useRosettaCache({
  reference,
  translations,
  cache,
  messages,
}: {
  reference: string;
  translations: string[];
  cache: string;
  messages: Record<string, string>;
}) {
  const logger = useLogger();

  const path = `${cache}/${reference}.json`;
  const template = JSON.stringify(messages);

  try {
    await fs.access(cache);
    await fs.access(path);
  } catch {
    logger.debug("Creating cache & translating...");
    await fs.mkdir(cache);
    await fs.writeFile(path, template);
    return await useRosettaTranslator(path, reference, translations);
  }

  const cachedReference = await fs.readFile(path);
  if (cachedReference.toString() !== template) {
    logger.debug("Updating messages & translating...");
    await fs.writeFile(path, template);
    return await useRosettaTranslator(path, reference, translations);
  }

  const cachedTranslations = await fs.readdir(cache);
  if (
    !translations.every(
      (t) => cachedTranslations.findIndex((c) => c.endsWith(`${t}.json`)) >= 0,
    )
  ) {
    logger.debug("Updating missing translations...");
    return await useRosettaTranslator(path, reference, translations);
  }

  logger.debug("Using cached translations...");
  return;
}
