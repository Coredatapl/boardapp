import type { IpGeolocationData } from "../types/geolocation";

export const fetchByIP = async (): Promise<IpGeolocationData> => {
  const response = await fetch(`${import.meta.env.VITE_IP_API_URL}`);
  if (!response.ok) {
    throw new Error(`Fetch IP Api failed with code ${response.status}`);
  }

  const geoData: IpGeolocationData = await response.json();
  return geoData;
};
