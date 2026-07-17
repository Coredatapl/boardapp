const contexMenutHandler = (e) => {
	e.preventDefault();
};

const devToolsHandler = (e) => {
	if (
		e.keyCode === 123 ||
		(e.ctrlKey && e.shiftKey && e.keyCode === "I".charCodeAt(0))
	) {
		return false;
	}
};

const unloadHandler = (e) => {
	e.preventDefault();
	e.returnValue = "Are you sure you want to quit?";
};

const isDevOrStage = () => {
	const origin = window.location.origin;
	if (
		["https://coredata.local:5173", "https://coredata.local:4173"].includes(
			origin,
		)
	) {
		return true;
	}
	return false;
};

if (!isDevOrStage) {
	document.addEventListener("contextmenu", (e) => contexMenutHandler(e));
	document.onkeydown = (e) => devToolsHandler(e);

	window.addEventListener("beforeunload", unloadHandler);
}
