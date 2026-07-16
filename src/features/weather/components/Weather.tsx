import { useEffect, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import { useModal } from "@/components/ui/modal/hooks/useModal";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { checkPermission } from "@/utils/common";
import { measure } from "@/utils/metrics";
import type { Cordinates, IpGeolocationData } from "../types/geolocation";
import type { WeatherCombinedData, WeatherResponse } from "../types/weather";
import {
  defaultHighTemp,
  defaultLowPressure,
  defaultLowTemp,
  defaultStrongWind,
} from "../utils/temp";
import { WeatherNotificationTrigger } from "../utils/trigger";
import WeatherModal from "./WeatherModal";
import { fetchByIP } from "../utils/geolocation";

export default function Weather() {
  const { isMobile, triggerNotification } = useAppContext();
  const { t } = useTranslate();
  const modal = useModal();
  const logger = useLogger("Weather");
  const storage = useStorage();
  const [geolocationPermitted, setGeolocationPermitted] = useState(false);
  const [cords, setCords] = useState<Cordinates | undefined>(
    storage.get<Cordinates>("location") ?? undefined,
  );
  const [city, setCity] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
  const [weatherData, setWeatherData] = useState<
    WeatherCombinedData | undefined
  >(undefined);
  const getWeatherTimeout = 1000 * 60 * 30;
  let obtainingLocation = false;
  let getWeatherInterval: number | undefined;

  function loadFromCache() {
    const cachedWeather = storage.get<WeatherCombinedData>("weather");

    if (cachedWeather) {
      setWeatherData(cachedWeather);
      weatherAlert(cachedWeather);
    }
    if (cachedWeather?.city) {
      setCity(cachedWeather.city);
    }
    if (cachedWeather?.countryCode) {
      setCountryCode(cachedWeather.countryCode);
    }
  }

  function openModal() {
    if (!weatherData) return;
    modal.open(<WeatherModal data={weatherData} />);
  }

  async function refreshData() {
    if (cords && weatherData) {
      return;
    }
    if (!cords) {
      getLocation();
    }
    if (!weatherData) {
      getWeather();
    }
  }

  async function getLocation() {
    if (navigator.geolocation) {
      await getGeolocation();
    } else {
      logger.log("Navigator geolocation not supported");
      getLocationByIP();
    }
  }

  async function getGeolocation() {
    if (cords) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      saveLocation(position.coords.latitude, position.coords.longitude);
      logger.log("Obtaining geolocation ...", "finished");
    }, errorHandler);

    await checkPermission(
      "geolocation",
      () => setGeolocationPermitted(true),
      () => setGeolocationPermitted(false),
    );

    if (!geolocationPermitted) {
      errorHandler({
        code: 1,
        message: "Navigator geolocation not permitted",
      });
    }
  }

  async function getLocationByIP() {
    if (cords || obtainingLocation) {
      return;
    }

    obtainingLocation = true;
    logger.log("Obtaining geolocation by IP", "...");
    try {
      const geoData: IpGeolocationData = await fetchByIP();

      if (geoData.latitude && geoData.longitude) {
        saveLocation(geoData.latitude, geoData.longitude);
      }
      if (geoData.city && !weatherData?.city.length) {
        setCity(geoData.city);
      }
      if (geoData.country_code && !weatherData?.countryCode.length) {
        setCountryCode(geoData.country_code);
      }
      obtainingLocation = false;
      logger.log("Obtaining geolocation by IP ...", "finished");
    } catch (error) {
      logger.log(`Geolocation by IP error: ${error}`);
      obtainingLocation = false;
    }
  }

  function errorHandler(error: Partial<GeolocationPositionError>) {
    logger.log(`Geolocation position error: ${error.message}`);
    measure("IPGeolocation", () => getLocationByIP());
  }

  function saveLocation(lat: number, lon: number) {
    const currentCords = { lat, lon };
    setCords(currentCords);
    storage.set("location", currentCords);
  }

  function roundTemp(temp: number): number {
    return Math.round(temp * 10) / 10;
  }

  function getWeather() {
    if (cords) {
      measure("WeatherFetch", () => fetchWeatherData(cords.lat, cords.lon));
    }
  }

  async function fetchWeatherData(lat: number, lon: number) {
    const exclude = "minutely,hourly,daily,alerts";
    const units = "metric";

    logger.log(`Obtaining current weather data`, "...");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${import.meta.env.VITE_OPEN_WEATHER_ID}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Fetch weather data failed with code ${response.status}`,
        );
      }

      const data: WeatherResponse = await response.json();

      if (data.cod !== 200 || !data.weather.length) {
        logger.log(
          `Fetch weather data failed. OpenWeatherMap error: ${data.message}`,
        );
        return;
      }
      const weather = data.weather[0];
      const main = data.main;
      const wind = data.wind;
      const mapUrl = `https://www.windy.com/${lat}/${lon}?temp,${lat},${lon},14,i:temp`;
      const currentData: WeatherCombinedData = {
        label: weather.main,
        description: weather.description,
        iconCode: weather.icon,
        temp: roundTemp(main.temp),
        tempFeelsLike: roundTemp(main.feels_like),
        tempMin: roundTemp(main.temp_min),
        tempMax: roundTemp(main.temp_max),
        pressure: main.pressure,
        humidity: main.humidity,
        windSpeed: wind.speed,
        mapUrl,
        city: city ?? data.name,
        countryCode: countryCode ?? data.sys.country,
      };

      setWeatherData(currentData);
      storage.set("weather", currentData, getWeatherTimeout);

      if (!city && data.name) {
        setCity(data.name);
      }
      if (!countryCode && data.sys.country) {
        setCountryCode(data.sys.country);
      }

      logger.log(`Obtaining current weather data ...`, "finished");
    } catch (error) {
      logger.log(`Fetch weather data error: ${error}`);
    }
  }

  function weatherAlert(weather: WeatherCombinedData) {
    let forecast = "";
    if (weather.temp < defaultLowTemp) {
      forecast += `${t("weather.forecastCold")}. `;
    } else if (
      weather.temp >= defaultHighTemp ||
      weather.tempMax >= defaultHighTemp
    ) {
      forecast += `${t("weather.forecastHot")}. `;
    }
    if (weather.windSpeed > defaultStrongWind) {
      forecast += `${t("weather.forecastWind")}. `;
    }
    if (weather.pressure < defaultLowPressure) {
      forecast += `${t("weather.forecastPressure")}. `;
    }
    if (!forecast.length) return;

    triggerNotification({
      label: t("weather.notificationLabel"),
      description: forecast.trim(),
      trigger: WeatherNotificationTrigger,
      triggerType: "weather",
    });
  }

  useEffect(() => {
    void refreshData();
  }, [cords, weatherData]);

  useEffect(() => {
    loadFromCache();
    getWeatherInterval = setInterval(() => {
      getWeather();
    }, getWeatherTimeout);

    return () => {
      if (getWeatherInterval) {
        clearInterval(getWeatherInterval);
      }
    };
  }, []);

  if (!weatherData) {
    return (
      <div className="flex items-center pl-2">
        <span className="text-xs dark:text-white/35 text-gray-400">
          {t("weather.loading")}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openModal}
      className="flex items-center pl-2 rounded-xl cursor-pointer outline-none dark:hover:bg-white/10 hover:bg-black/8 transition-colors group"
      title={t("weather.widgetHint")}
    >
      <h1
        className="text-sm dark:text-white/35 text-gray-400 group-hover:text-accent"
        data-testid="tempHeader"
      >
        {city} · {weatherData.temp}&deg;{""}
        {!isMobile && (
          <img
            className="inline w-8 h-8"
            src={`https://openweathermap.org/payload/api/media/file/${weatherData.iconCode}.png`}
            alt={""}
          />
        )}
      </h1>
    </button>
  );
}
