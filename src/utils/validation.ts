import * as z from "zod/mini";
import { useTranslate } from "@/hooks/useTranslate";

export type ZodSchema = z.ZodMiniURL | z.ZodMiniString<string>;

export const SearchQueryMinLength = 3;
export const ShortcutUrlMinLength = 3;
export const ShortcutNameMinLength = 1;
export const ShortcutNameMaxLength = 10;
export const TodoLabelMinLength = 2;
export const TodoLabelMaxLength = 100;
export const DisplayNameMinLength = 3;
export const DisplayNameMaxLength = 20;
export const AuthEmailMinLength = 3;
export const AuthPasswordMinLength = 8;
export const AuthPasswordMaxLength = 32;

export const getUrlSchema = (minLength: number): z.ZodMiniURL => {
	const { t } = useTranslate();

	return z
		.url({
			protocol: /^https$/,
			hostname: z.regexes.domain,
			normalize: true,
			error: t("validation.url.invalid"),
		})
		.check(
			z.minLength(minLength, t("validation.url.minLength", { minLength })),
		);
};

export const getStringSchema = (
	minLength: number,
	maxLength: number,
): z.ZodMiniString<string> => {
	const { t } = useTranslate();
	return z
		.string()
		.check(
			z.minLength(minLength, t("validation.string.minLength", { minLength })),
			z.maxLength(maxLength, t("validation.string.maxLength", { maxLength })),
		);
};

export const getEmailSchema = (minLength: number) => {
	const { t } = useTranslate();
	return z
		.string()
		.check(
			z.minLength(minLength, t("validation.email.minLength", { minLength })),
			z.email(t("validation.email.invalid")),
		);
};

export const getPasswordSchema = (
	minLength: number,
	maxLength: number,
): z.ZodMiniString<string> => {
	const { t } = useTranslate();
	return z
		.string()
		.check(
			z.minLength(minLength, t("validation.password.minLength", { minLength })),
			z.maxLength(maxLength, t("validation.password.maxLength", { maxLength })),
			z.regex(/[A-Z]/, t("validation.password.uppercase")),
			z.regex(/[a-z]/, t("validation.password.lowercase")),
			z.regex(/[0-9]/, t("validation.password.digit")),
			z.regex(/[^A-Za-z0-9]/, t("validation.password.special")),
		);
};

/**
 * Validate value against schema and returns errors array or null if valid

 * @param value any Value to validate
 * @param schema ZodSchema Validation schema
 * @returns string[] | null 
 */
export const validate = (value: any, schema: ZodSchema): string[] | null => {
	const { t } = useTranslate();
	const result = schema.safeParse(value);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message);
		return errors.length ? errors : [t("validation.invalid")];
	}
	return null;
};

export const validatePasswords = (
	password: string,
	passwordConfirm: string,
): string[] | null => {
	const { t } = useTranslate();
	const passwordPair = z
		.object({
			password: z.string(),
			passwordConfirm: z.string(),
		})
		.check(
			z.refine((data) => data.password === data.passwordConfirm, {
				error: t("validation.password.confirmInvalid"),
				path: ["confirm"],
			}),
		);
	const result = z.safeParse(passwordPair, { password, passwordConfirm });
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message);
		return errors.length ? errors : [t("validation.invalid")];
	}
	return null;
};

export const isValidUrl = (str: string) => {
	let s = str.trim();

	if (!s.includes(".")) return false;
	if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

	try {
		const url = new URL(s);
		return url.href;
	} catch {
		return false;
	}
};
