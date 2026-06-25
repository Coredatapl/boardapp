import type { SupportedLanguage } from "@/utils/i18n/translator";

export interface Language {
	code: SupportedLanguage;
	short: string;
	long: string;
}
