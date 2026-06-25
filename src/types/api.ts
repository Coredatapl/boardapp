export type TypedHeaders = RequestInit["headers"] & PreparedHeaders;

export type PreparedHeaders = Partial<{
	"Content-Type": string;
	Accept: string;
	Authorization: `Bearer ${string}`;
}>;

export type HTTPMethod =
	| "CONNECT"
	| "HEAD"
	| "OPTIONS"
	| "GET"
	| "POST"
	| "PUT"
	| "UPDATE"
	| "DELETE";
export type WithBody = Extract<
	HTTPMethod,
	"POST" | "PUT" | "UPDATE" | "DELETE"
>;
export type NoBody = Exclude<HTTPMethod, WithBody>;
export type MethodBodyCombination =
	| { method?: WithBody; body?: RequestInit["body"] }
	| { method?: NoBody; body?: undefined };
export type TypedRequestInit = RequestInit &
	MethodBodyCombination & { headers?: TypedHeaders };

export interface TypedResponse<T> extends Response {
	json(): Promise<T>;
}

export interface ApiResponse {
	success: boolean;
	result: any;
	status: number;
}

export interface ApiResult {
	success: boolean;
	result: any;
}

export interface ApiPayload {
	status: string;
	details: any;
}

export interface ApiError {
	code: number;
	message: string;
	description: string;
	payload: ApiPayload | null;
}
