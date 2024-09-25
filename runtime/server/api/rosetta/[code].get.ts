import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code");
  if (!code || code.length !== 2) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid language code: ${code}`,
    });
  }

  const storage = useStorage("assets:rosetta");

  const translationPresent = await storage.hasItem(`${code}.json`);
  if (!translationPresent) {
    throw createError({
      statusCode: 404,
      statusMessage: `Cannot find language code: ${code}`,
    });
  }

  return await storage.getItem(`${code}.json`);
});
