export interface FetchOptions {
  headers?: HeadersInit;
  method?: string;
  timeout?: number;
  cache?: RequestCache;
  body?: BodyInit | null;
  credentials?: RequestCredentials;
}

export default class FetchApi {
  private readonly timeout = 5000;
  private static instance: FetchApi;

  private constructor() {}

  static getInstance(): FetchApi {
    if (!FetchApi.instance) {
      FetchApi.instance = new FetchApi();
    }

    return FetchApi.instance;
  }

  async fetch(resource: string, options: FetchOptions) {
    const { timeout } = options;
    const controller = new AbortController();
    const id = setTimeout(
      () => {
        controller.abort();
        console.warn('FetchApi request was aborted due to a timeout');
      },
      timeout ? timeout : this.timeout
    );
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      console.error('FetchApi request failed with code ' + response.status);
    }

    return response;
  }
}
