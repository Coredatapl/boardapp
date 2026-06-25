import { translator } from "./i18n/translator";

export const OneYearMs = 31536000000;

export const getTimeFormatted = (lang: string, timestamp?: number): string => {
	const date = timestamp ? new Date(timestamp) : new Date();

	return (
		date.toLocaleDateString(lang, {
			weekday: "long",
			month: "long",
			day: "numeric",
		}) +
		" · " +
		date.toLocaleTimeString(lang, {
			hour: "2-digit",
			minute: "2-digit",
		})
	);
};

export const getTimeAgo = (date: number | string): string => {
	if (typeof date === "string") {
		date = Date.parse(date);
	}
	const seconds = Math.floor((Date.now() - date) / 1000);

	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return translator.translate("common.yearsAgo", { years: interval });
	}

	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return translator.translate("common.monthsAgo", { months: interval });
	}

	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return translator.translate("common.daysAgo", { days: interval });
	}

	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return translator.translate("common.hoursAgo", { hours: interval });
	}

	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return translator.translate("common.minutesAgo", { minutes: interval });
	}

	if (seconds < 10) return translator.translate("common.now");

	return translator.translate("common.secondsAgo", { seconds });
};
