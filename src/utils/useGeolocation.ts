import { useGlobalState } from './useGlobalState';

interface GeolocationData {
  lat: number;
  lon: number;
}

export const useGeolocation = () => {
  const { globalState } = useGlobalState();
  const defaultLat = Number.parseFloat(
    process.env.REACT_APP_GLOC_DEFAULT_LAT as string
  );
  const defaultLon = Number.parseFloat(
    process.env.REACT_APP_GLOC_DEFAULT_LON as string
  );

  if (
    globalState.geolocationPermitted &&
    globalState.geolocationLat &&
    globalState.geolocationLon
  ) {
    return {
      lat: globalState.geolocationLat,
      lon: globalState.geolocationLon,
    } as GeolocationData;
  }
  return { lat: defaultLat, lon: defaultLon } as GeolocationData;
};
