import { useEffect, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import BrandSymbol from "@/components/ui/BrandSymbol";
import { useTranslate } from "@/hooks/useTranslate";
import { capitalise } from "@/utils/common";
import { getTimeFormatted } from "@/utils/time";

export default function Greeting() {
	const { settings } = useAppContext();
	const [time, setTime] = useState("");
	const { t } = useTranslate();
	let updateTimeInterval: number | undefined;

	function updateTime() {
		const currentTime = getTimeFormatted(settings.lang);
		if (time === currentTime) {
			return;
		}
		setTime(currentTime);
	}

	useEffect(() => {
		if (time === "") {
			updateTime();
		}

		if (updateTimeInterval !== undefined) return;
		updateTimeInterval = setInterval(updateTime, 10000);

		return () => {
			if (updateTimeInterval) {
				clearInterval(updateTimeInterval);
			}
		};
	}, []);

	return (
		<div className="text-center opacity-0 animate-slide-up delay-1 fill-mode-forwards">
			<BrandSymbol />
			<h1 className="font-display text-lg dark:text-white text-gray-800 tracking-tight">
				{t("greeting.welcome", { name: settings.displayName })}
			</h1>
			<p className="text-sm dark:text-white/35 text-gray-400 mt-1 font-light">
				{capitalise(time)}
			</p>
		</div>
	);
}
