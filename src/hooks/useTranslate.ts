import { translator } from "@/utils/i18n/translator";

export function useTranslate(lang?: string) {
	if (lang) {
		translator.setLanguage(lang);
	}
	return {
		t: (key: string, params?: Record<string, any>) =>
			translator.translate(key, params),
	};
}
