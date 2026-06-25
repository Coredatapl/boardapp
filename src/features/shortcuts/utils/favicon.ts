const faviconApiUrl = `${import.meta.env.VITE_FAVICON_API_URL}`;

export const getFaviconUrls = (url: string): string[] | null => {
	try {
		const origin = new URL(url).origin;
		return [
			`${origin}/favicon.ico`,
			`${origin}/favicon.png`,
			`${faviconApiUrl}${encodeURIComponent(origin)}`,
		];
	} catch {
		return null;
	}
};

export const tryFetchFavicon = async (
	url: string,
	timeout = 3000,
	onLoad?: (url: string) => void,
	onError?: () => void,
): Promise<boolean> =>
	new Promise((resolve) => {
		if (!url) return resolve(false);

		const img = new Image();

		const timer = setTimeout(() => {
			cleanup();
			resolve(false);
		}, timeout);

		const cleanup = () => {
			if (done) return;
			done = true;
			img.onload = img.onerror = null;
			clearTimeout(timer);
		};

		let done = false;

		img.onload = () => {
			cleanup();
			if (onLoad) {
				onLoad(url);
			}
			resolve(true);
		};

		img.onerror = () => {
			cleanup();
			if (onError) {
				onError();
			}
			resolve(false);
		};
		img.src = url;
	});
