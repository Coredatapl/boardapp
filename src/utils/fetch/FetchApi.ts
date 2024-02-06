export interface FetchOptions {
  method?: string;
  timeout?: number;
  cache?: RequestCache;
}

export default class FetchApi {
  private readonly timeout = 5000;

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
    }).catch(console.error);
    clearTimeout(id);

    return response;
  }
}
