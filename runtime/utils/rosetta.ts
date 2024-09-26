// @ts-ignore
import { language, languages, messages } from "#build/rosetta.config.mjs";
import type { RosettaCode, RosettaMessage } from "#build/types/rosetta.d.ts";

const options = languages as { name: string; code: RosettaCode }[];
const codes = options.map((l) => l.code);

export type RosettaLanguageOption = {
  key: RosettaCode;
  label: string;
};

export type RosettaScheme = {
  [M in RosettaMessage]: string;
};

export const useRosettaLanguage = () =>
  useState<RosettaCode>("rosetta-code", () => language);

export const useRosettaMessages = () =>
  useState<RosettaScheme>("rosetta-messages", () => messages);

export function useRosetta() {
  return {
    language: useRosettaLanguage(),
    messages: useRosettaMessages(),
  };
}

export function isRosettaCode(code: unknown): code is RosettaCode {
  return (
    typeof code === "string" && codes.map((c) => c.toString()).includes(code)
  );
}

export function isRosettaMessage(message: unknown): message is RosettaMessage {
  return typeof message === "string" && message in messages;
}

export function isRosettaScheme(scheme: unknown): scheme is RosettaScheme {
  return (
    scheme !== null &&
    typeof scheme === "object" &&
    Object.keys(scheme).every((key) => key in messages)
  );
}

export function useRosettaLanguageOptions(): RosettaLanguageOption[] {
  return options.map((l) => ({
    key: l.code as RosettaCode,
    label: l.name,
  }));
}

export async function setRosettaLanguage(code: RosettaCode) {
  const rosetta = useRosetta();
  const data = await $fetch(`/api/rosetta/${code}`);
  if (isRosettaScheme(data)) {
    rosetta.messages.value = data;
    rosetta.language.value = code;
  }
  return rosetta;
}

export function useRosettaMessage(message: RosettaMessage) {
  const rosetta = useRosetta();
  return reactive(rosetta.messages.value)[message];
}

export const $t = useRosettaMessage;

export type { RosettaCode, RosettaMessage };
