import { normalize } from "@/utils/common";
import { type SupportedLanguage, supportedLanguages } from "../translator";

export const getClientLanguage = (): SupportedLanguage => {
	const defaultLanguage: SupportedLanguage = supportedLanguages[0].code;
	const detectedLang: string =
		typeof navigator !== "undefined"
			? navigator.language || (navigator as any).userLanguage || defaultLanguage
			: defaultLanguage;
	const normalizedLang = normalize(detectedLang);
	const matchedLanguage = supportedLanguages.find(
		(l) =>
			normalize(l.code) === normalizedLang ||
			normalize(l.short) === normalizedLang,
	)?.code;

	return matchedLanguage || defaultLanguage;
};
