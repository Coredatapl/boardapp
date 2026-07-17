import { useTranslate } from "@/hooks/useTranslate";
import BrandLogo from "./ui/BrandLogo";
import ProgressBar from "./ui/ProgressBar";

export default function LoadingFallback() {
	const { t } = useTranslate();

	return (
		<div className="flex h-screen w-screen gap-8 px-6 items-center justify-center dark:bg-surface-dark bg-surface">
			<div className="flex flex-col items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
				<BrandLogo />
				<div>{t("common.loadingInfo")}</div>
				<ProgressBar />
			</div>
		</div>
	);
}
