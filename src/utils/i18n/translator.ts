import { LoggerFactory } from "@/utils/logger";
import { compare } from "../common";
import { loadTranslation } from "./loader";
import type { Language } from "./types/language";

export type SupportedLanguage =
	| "en-US"
	| "de-DE"
	| "fr-FR"
	| "it-IT"
	| "es-ES"
	| "pl-PL";

const en: Language = {
	code: "en-US",
	short: "en",
	long: "English (United States)",
};
const de: Language = {
	code: "de-DE",
	short: "de",
	long: "Deutsch (Deutschland)",
};
const fr: Language = { code: "fr-FR", short: "fr", long: "Français (France)" };
const it: Language = { code: "it-IT", short: "it", long: "Italiano (Italia)" };
const es: Language = { code: "es-ES", short: "es", long: "Español (España)" };
const pl: Language = { code: "pl-PL", short: "pl", long: "Polski (Poland)" };

export const supportedLanguages = [en, de, fr, it, es, pl];

const enTranslation = await loadTranslation(en.short);
const deTranslation = await loadTranslation(de.short);
const frTranslation = await loadTranslation(fr.short);
const itTranslation = await loadTranslation(it.short);
const esTranslation = await loadTranslation(es.short);
const plTranslation = await loadTranslation(pl.short);

const logger = LoggerFactory("Translator");

type Translation = typeof enTranslation;

class Translator {
	language: Language = en;

	private languages: Language[] = supportedLanguages;
	private defaultLanguage: Language = en;
	private translations: { [code: string]: Translation } = {
		[en.code]: enTranslation,
		[de.code]: deTranslation,
		[fr.code]: frTranslation,
		[it.code]: itTranslation,
		[es.code]: esTranslation,
		[pl.code]: plTranslation,
	};
	private nsSeparator = ".";

	constructor(code?: string) {
		if (code) {
			const lang = this.getLanguage(code);
			this.language = lang ?? this.defaultLanguage;
		}
		setTimeout(
			() =>
				logger.log(`Translation (${this.language.code}) service is`, "ready"),
			500,
		);
	}

	setLanguage(code: string) {
		const lang = this.getLanguage(code);
		if (lang) {
			this.language = lang;
			logger.log(`Set language to ${code}`, "successfully");
		} else {
			logger.log(`Language ${code} is not supported`);
		}
	}

	translate(key: string, params?: Record<string, any>): string {
		const translation = this.translations[this.language.code];
		const props = this.parseKey(key);
		let translated = this.getTranslated(props, translation);

		if (!translated) {
			// fallback to default translation
			translated = this.getTranslated(
				props,
				this.translations[this.defaultLanguage.code],
			);
			logger.log(
				`Key "${key}" not recognized for ${this.language.code.toUpperCase()}. Fallback to default language ...`,
			);
		}
		if (translated && params) {
			translated = this.interpolate(translated, params);
		}

		// fallback to last prop
		return translated ?? props[props.length - 1];
	}

	private parseKey(key: string): string[] {
		if (!key.includes(this.nsSeparator)) return [key];
		return key.split(this.nsSeparator);
	}

	private interpolate(template: string, params: Record<string, any>): string {
		return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
			return key in params ? String(params[key]) : match;
		});
	}

	private getTranslated(
		props: string[],
		translation: Record<string, any>,
	): string | undefined {
		let current: any = translation;

		for (const prop of props) {
			current = current[prop];
			if (!current) {
				logger.log(
					`Property "${prop}" undefined in "${props.join(this.nsSeparator)}" key`,
				);
				return undefined;
			}
		}
		return current ?? undefined;
	}

	private getLanguage(code: string): Language | undefined {
		return this.languages.find((l) => compare(l.code, code));
	}
}

export const translator = new Translator();
