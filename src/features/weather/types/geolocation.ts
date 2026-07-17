export interface Cordinates {
	lat: number;
	lon: number;
}

export interface IpGeolocationData {
	country_name: string;
	country_code: string;
	region: string;
	city: string;
	postal: string;
	latitude: number;
	longitude: number;
	ip: string;
}

export interface ApiGeolocationData {
	ip: string;
	latitude: number;
	longitude: number;
	city: string;
	countryName: string;
	countryCode: string;
}
