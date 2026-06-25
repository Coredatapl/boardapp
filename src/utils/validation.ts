import * as z from "zod/mini";
import { useLogger } from "@/hooks/useLogger";

export type ZodSchema = z.ZodMiniURL | z.ZodMiniString<string>;

export const SearchQueryMinLength = 3;
export const ShortcutUrlMinLength = 3;
export const ShortcutNameMinLength = 1;
export const ShortcutNameMaxLength = 10;
export const TodoLabelMinLength = 2;
export const TodoLabelMaxLength = 100;
export const DisplayNameMinLength = 3;
export const DisplayNameMaxLength = 20;

export const getUrlSchema = (minLenght: number): z.ZodMiniURL =>
	z
		.url({
			protocol: /^https$/,
			hostname: z.regexes.domain,
			normalize: true,
			error: "Invalid URL",
		})
		.check(z.minLength(minLenght));

export const getStringSchema = (
	minLength: number,
	maxLength: number,
): z.ZodMiniString<string> =>
	z.string().check(z.minLength(minLength), z.maxLength(maxLength));

export const validate = (value: any, schema: ZodSchema): string | null => {
	const logger = useLogger("Validator");
	const result = schema.safeParse(value);
	if (!result.success) {
		const flattened = z.flattenError(result.error);
		logger.log(`Value ${value} is invalid`, flattened);
		return null;
	}
	return result.data;
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
