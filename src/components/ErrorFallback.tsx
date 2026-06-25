import { useTranslate } from "@/hooks/useTranslate";
import Button from "./ui/Button";

interface ErrorFallbackProps {
	reset: (...args: unknown[]) => void;
	isExtension: boolean;
	contactEmail: string;
	error?: unknown;
}

export default function ErrorFallback({
	error,
	isExtension,
	contactEmail,
	reset,
}: ErrorFallbackProps) {
	const { t } = useTranslate();

	function getError(error: unknown): Error | undefined {
		if (!error || typeof error !== "object") return undefined;
		const isErrorObject = error instanceof Error;
		if (!isErrorObject) return undefined;
		return error as Error;
	}

	function renderErrorDetails() {
		const parsedError = getError(error);
		if (import.meta.env.VITE_APP_ENV === "prod" || !parsedError) return "";

		return (
			<>
				<div className="font-bold">{t("error.details")}</div>
				<div className="text-sm">
					{parsedError.name}: {parsedError.message}
				</div>
				{parsedError.stack && (
					<pre className="p-2 font-mono text-xs rounded-lg dark:bg-surface-dark bg-surface overflow-x-auto">
						{parsedError.stack}
					</pre>
				)}
			</>
		);
	}

	// TODO: bug report email body
	return (
		<div
			className="flex h-screen w-screen flex-col items-center justify-center dark:text-white text-gray-800 dark:bg-surface-dark bg-surface"
			role="alert"
		>
			<div className="max-w-11/12 md:max-w-8/12 m-2 p-4 md:p-6 text-left rounded-2xl shadow-2xl border dark:border-surface-dark-element border-surface-element dark:bg-surface-dark-container bg-surface-container">
				<h2 className="pt-6 pb-4 font-display text-xl text-error">
					{t("error.header")}
				</h2>
				<div className="py-5 space-y-4 dark:text-white/75 text-gray-700">
					<div className="">{t("error.info")}</div>
					<div className="font-bold">{t("error.suggestionHeader")}</div>
					<ul className="list-disc pl-6 space-y-1 text-sm">
						<li>
							{t(`error.suggestion.${isExtension ? "extension" : "web"}`)}
						</li>
						<li>{t("error.report", { email: contactEmail })}</li>
					</ul>
					{renderErrorDetails()}
				</div>
				<div className="flex gap-3 py-4 items-center justify-end">
					<Button
						label={t("error.reportLabel")}
						onClick={() =>
							window.location.assign(
								`mailto:${contactEmail}?subject=BoardApp%20Error%20Report`,
							)
						}
					/>
					{!isExtension && (
						<Button
							label={t("error.refreshLabel")}
							onClick={() => window.location.assign(window.location.origin)}
						/>
					)}
					{isExtension && (
						<Button label={t("error.tryAgainLabel")} onClick={reset} />
					)}
				</div>
			</div>
		</div>
	);
}
