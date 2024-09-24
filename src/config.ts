const languages = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Spanish",
    code: "es",
  },
  {
    name: "French",
    code: "fr",
  },
];

export type LanguageCode = (typeof languages)[number]["code"];

export function useLanguages(codes: LanguageCode[]) {
  return languages.filter((l) => codes.includes(l.code));
}
