export type SupportedLanguage = "en" | "ar"

export const LANGUAGE_COOKIE = "peeredu-language"
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === "en" || value === "ar"
}

export function resolveLanguage(value?: string | null): SupportedLanguage {
  return isSupportedLanguage(value) ? value : "en"
}
