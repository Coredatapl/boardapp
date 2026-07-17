export const smallScreenBreakpoint = 768;

export const isSmallScreen = () => {
	return window?.matchMedia(`(max-width: ${smallScreenBreakpoint}px)`).matches;
};

export const detectMobileDevice = () => {
	const isTouchDevice =
		navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
	const hasTouchSupport = "ontouchstart" in window;
	if (isTouchDevice || hasTouchSupport) {
		return true;
	}
	return isSmallScreen();
};
