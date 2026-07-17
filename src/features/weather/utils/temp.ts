import { compare } from "@/utils/common";
import type { TempUnit } from "../types/temp";

export const isCelsius = (temp: TempUnit): boolean => compare(temp, "celsius");

export const celsiusToFahrenheit = (temp: number) => (temp * 9) / 5 + 32;

export const fahrenheitToCelsius = (temp: number) => ((temp - 32) * 5) / 9;

export const defaultTempUnit: TempUnit = "celsius";
export const defaultLowTemp = isCelsius(defaultTempUnit)
	? 10
	: celsiusToFahrenheit(10);
export const defaultMidTemp = isCelsius(defaultTempUnit)
	? 20
	: celsiusToFahrenheit(20);
export const defaultHighTemp = isCelsius(defaultTempUnit)
	? 30
	: celsiusToFahrenheit(30);
export const defaultStrongWind = 5;
export const defaultLowPressure = 900;
