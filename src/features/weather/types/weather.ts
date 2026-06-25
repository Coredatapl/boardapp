export interface MainData {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	humidity: number;
}
export interface WindData {
	speed: number;
}
export interface SysData {
	country: string;
}
export interface WeatherData {
	icon: string;
	main: string;
	description: string;
}
export interface WeatherResponse {
	main: MainData;
	wind: WindData;
	weather: WeatherData[];
	name: string;
	sys: SysData;
	cod?: number;
	message?: string;
}
export interface WeatherCombinedData {
	label: string;
	description: string;
	iconCode: string;
	temp: number;
	tempFeelsLike: number;
	tempMin: number;
	tempMax: number;
	pressure: number;
	humidity: number;
	windSpeed: number;
	mapUrl: string;
	city: string;
	countryCode: string;
}
