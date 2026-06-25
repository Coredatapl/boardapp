import Modal from "@/components/ui/modal/Modal";
import ModalBody from "@/components/ui/modal/ModalBody";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import { useTranslate } from "@/hooks/useTranslate";
import { capitalise } from "@/utils/common";
import type { WeatherCombinedData } from "../types/weather";
import { defaultLowTemp, defaultMidTemp } from "../utils/temp";

interface WeatherModalProps {
	data: WeatherCombinedData;
}

export default function WeatherModal({ data }: WeatherModalProps) {
	const { t } = useTranslate();

	function getGradient() {
		if (data.temp < defaultLowTemp) {
			return "from-blue-100 to-indigo-100 dark:from-slate-700/30 dark:to-gray-700/30";
		}
		if (data.temp > defaultMidTemp) {
			return "from-amber-100 to-orange-200 dark:from-amber-600/20 dark:to-orange-700/20";
		}
		return "from-green-100 to-amber-100 dark:from-green-700/30 dark:to-amber-700/30";
	}

	return (
		<Modal>
			<ModalHeader title={`${data.city}, ${data.countryCode}`} />
			<ModalBody>
				<div className="relative w-full text-gray-800 dark:text-gray-100">
					<div
						className={`flex items-center justify-between mb-6 p-4 rounded-2xl bg-linear-to-r ${getGradient()}`}
					>
						<div>
							<div className="flex items-baseline">
								<span
									id="widget-temp"
									className="text-5xl font-bold tracking-tighter"
								>
									{data.temp}
								</span>
								<sup className="text-2xl font-semibold text-gray-500 ml-1">
									&deg;C
								</sup>
							</div>
							<div className="mt-1">
								<span
									id="widget-main"
									className="text-sm font-semibold capitalize block"
								>
									{data.label}
								</span>
								<span
									id="widget-desc"
									className="text-xs text-gray-400 dark:text-gray-400 block"
								>
									{capitalise(data.description)}
								</span>
							</div>
						</div>
						<div className="w-20 h-20 flex items-center justify-center bg-white dark:bg-surface-dark rounded-xl shadow-sm border dark:border-surface-dark-element border-surface-element">
							<a
								href={data.mapUrl}
								target="_blank"
								rel="noreferrer"
								title="Meteo Map"
							>
								<img
									id="widget-icon"
									src={`https://openweathermap.org/payload/api/media/file/${data.iconCode}.png`}
									alt="Icon"
									className="w-16 h-16 object-contain"
								/>
							</a>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 mb-4">
						<div className="bg-surface-item dark:bg-surface-dark-item p-3 rounded-xl flex flex-col justify-between">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.feelsLike")}
							</span>
							<span id="widget-feels" className="font-bold mt-1">
								{data.tempFeelsLike}{" "}
								<span className="text-sm text-gray-500">&deg;C</span>
							</span>
						</div>
						<div className="bg-surface-item dark:bg-surface-dark-item p-3 rounded-xl flex flex-col justify-between">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.windSpeed")}
							</span>
							<span id="widget-wind" className="font-bold mt-1">
								{data.windSpeed}{" "}
								<span className="text-sm text-gray-500">m/s</span>
							</span>
						</div>
						<div className="bg-surface-item dark:bg-surface-dark-item p-3 rounded-xl flex flex-col justify-between">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.humidity")}
							</span>
							<span id="widget-humidity" className="font-bold mt-1">
								{data.humidity}{" "}
								<span className="text-sm text-gray-500">&#37;</span>
							</span>
						</div>
						<div className="bg-surface-item dark:bg-surface-dark-item p-3 rounded-xl flex flex-col justify-between">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.pressure")}
							</span>
							<span id="widget-pressure" className="font-bold mt-1">
								{data.pressure}{" "}
								<span className="text-sm text-gray-500">hPa</span>
							</span>
						</div>
					</div>

					<div className="bg-surface-item dark:bg-surface-dark-item p-3 rounded-xl flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.minTemp")}
							</span>
							<span id="widget-min" className="font-bold text-blue-500 mt-0.5">
								{data.tempMin} <sup>&deg;C</sup>
							</span>
						</div>
						<div className="h-8 w-px bg-gray-300 dark:bg-white/10"></div>
						<div className="flex flex-col items-end">
							<span className="text-gray-400 dark:text-gray-400 font-medium text-xs">
								{t("weather.modal.maxTemp")}
							</span>
							<span id="widget-max" className="font-bold text-rose-500 mt-0.5">
								{data.tempMax} <sup>&deg;C</sup>
							</span>
						</div>
					</div>
				</div>
			</ModalBody>
		</Modal>
	);
}
