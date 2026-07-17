export async function loadTranslation(lang: string) {
	const common = await import(`./locales/${lang}/common.json`);
	const header = await import(`./locales/${lang}/header.json`);
	const weather = await import(`./locales/${lang}/weather.json`);
	const greeting = await import(`./locales/${lang}/greeting.json`);
	const searchbar = await import(`./locales/${lang}/searchbar.json`);
	const shortcuts = await import(`./locales/${lang}/shortcuts.json`);
	const notifications = await import(`./locales/${lang}/notifications.json`);
	const todo = await import(`./locales/${lang}/todo.json`);
	const settings = await import(`./locales/${lang}/settings.json`);
	const error = await import(`./locales/${lang}/error.json`);
	const auth = await import(`./locales/${lang}/auth.json`);
	const validation = await import(`./locales/${lang}/validation.json`);

	return {
		common,
		header,
		weather,
		greeting,
		searchbar,
		shortcuts,
		notifications,
		todo,
		settings,
		error,
		auth,
		validation,
	};
}
