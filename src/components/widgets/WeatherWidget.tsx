import { useEffect, useState } from 'react';
import { ConfigService, ConfigKey } from '../../utils/ConfigService';
import { useGlobalState } from '../../hooks/useGlobalState';

interface MainData {
  temp: number;
}

interface WeatherData {
  icon: string;
}

interface WeatherResponse {
  main: MainData;
  name: string;
  weather: WeatherData[];
  cod?: number;
  message?: string;
}

export default function WeatherWidget() {
  const { globalState, setGlobalState } = useGlobalState();
  const [currentTemp, setCurrentTemp] = useState(0);
  const [currentCity, setCurrentCity] = useState('');
  const [currentIcon, setCurrentIcon] = useState('01d');
  const [mapUrl, setMapUrl] = useState('');
  const Config = ConfigService.getInstance();
  const apiKey = process.env.REACT_APP_OPEN_WEATHER_ID;

  let geolocationPermitted = true;
  let lat: number = Number.parseFloat(
    process.env.REACT_APP_GLOC_DEFAULT_LAT as string
  );
  let lon: number = Number.parseFloat(
    process.env.REACT_APP_GLOC_DEFAULT_LON as string
  );

  async function checkPermission() {
    const result = await navigator.permissions.query({ name: 'geolocation' });

    if (result.state === 'granted') {
      geolocationPermitted = true;
    } else if (result.state === 'denied') {
      geolocationPermitted = false;
    }

    setGlobalState((state) => ({
      ...state,
      [ConfigKey.geolocationPermitted]: geolocationPermitted,
    }));

    result.addEventListener('change', () => {
      checkPermission();
    });
  }

  async function getGeolocation() {
    await checkPermission();

    if (!geolocationPermitted) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      getWeather();

      setGlobalState((state) => ({
        ...state,
        [ConfigKey.geolocationLat]: lat,
        [ConfigKey.geolocationLon]: lon,
      }));
    }, errorHandler);
  }

  function errorHandler(error: GeolocationPositionError) {
    console.warn(
      `Geolocation Position error (${error.code}): ${error.message}`
    );
    if (lat && lon) {
      setMapUrl(
        `https://www.windy.com/${lat}/${lon}?temp,${lat},${lon},14,i:temp`
      );
      fetchWeatherData(lat, lon);
    } else {
      Config.set(ConfigKey.widgetWeatherActive, false);
    }
  }

  function getWeather() {
    if (!('geolocation' in navigator)) {
      Config.set(ConfigKey.widgetWeatherActive, false);
      return;
    }

    if (lat && lon) {
      setMapUrl(
        `https://www.windy.com/${lat}/${lon}?temp,${lat},${lon},14,i:temp`
      );
      fetchWeatherData(lat, lon);
    }
  }

  function fetchWeatherData(lat: number, lon: number) {
    const exclude = 'minutely,hourly,daily,alerts';
    const units = 'metric';

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apiKey}`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((data: WeatherResponse) => {
        if (data.cod !== 200) {
          console.error('OpenWeatherMap Error: ' + data.message);
          return;
        }
        if (data?.main && data?.name) {
          const temp = Math.floor(data.main.temp);
          setCurrentTemp(temp);
          setCurrentCity(data.name);
        }
        if (data.weather.length && data.weather[0].icon.length) {
          const icon = data.weather[0].icon;
          setCurrentIcon(icon);
        }
      })
      .catch(console.error);
  }

  useEffect(() => {
    getGeolocation();

    setInterval(() => {
      getWeather();
    }, 1000 * 60 * 60);
  }, []);

  if (
    !globalState.widgetWeatherActive ||
    !geolocationPermitted ||
    globalState.firstRun
  ) {
    return <></>;
  }
  return (
    <div className="absolute left-0 bottom-10 md:bottom-2 text-left">
      <a href={mapUrl}>
        <div className="container px-4 pb-2">
          <h1
            className="text-6xl text-shadow-xs shadow-gray-700"
            data-testid="tempHeader"
          >
            {currentTemp}&deg;{''}
            <img
              className="inline"
              width={50}
              height={50}
              // deepcode ignore DOMXSS: static link
              src={`https://openweathermap.org/img/w/${currentIcon}.png`}
              alt={''}
            />
          </h1>
          <h2
            className="text-2xl text-shadow-xs shadow-gray-700"
            data-testid="cityHeader"
          >
            {currentCity}
          </h2>
        </div>
      </a>
    </div>
  );
}
