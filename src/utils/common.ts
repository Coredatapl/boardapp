export const LightTheme = "light";
export const DarkTheme = "dark";

export const normalize = (text: string) => {
	if (!text) return "";
	return text.toLowerCase();
};

export const capitalise = (text: string) => {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const compare = (str1: string, str2: string): boolean => {
	if (!str1 || !str2) return false;
	return normalize(str1) === normalize(str2);
};

export async function checkPermission(
	name: PermissionName,
	onGranted?: () => void,
	onDenied?: () => void,
) {
	const permission = await navigator.permissions.query({
		name,
	});

	if (permission.state === "granted" && onGranted) {
		onGranted();
	} else if (permission.state === "denied" && onDenied) {
		onDenied();
	}

	permission.addEventListener("change", () => {
		checkPermission(name, onGranted, onDenied);
	});
}

export const autoResize = (el: HTMLElement) => {
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight}px`;
	const max = parseInt(getComputedStyle(el).maxHeight, 10);
	el.classList.toggle("overflow-y-auto", el.scrollHeight > max);
	el.classList.toggle("overflow-y-hidden", el.scrollHeight <= max);
};
