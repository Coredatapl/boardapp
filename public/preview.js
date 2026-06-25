document.addEventListener("DOMContentLoaded", () => {
	const progressBar = document.getElementById("previewProgressBar");
	const progressInfo = document.getElementById("previewProgressInfo");
	let progress = 0;

	const interval = setInterval(() => {
		progress += Math.floor(Math.random() * 15) + 5; // Losowy krok postępu

		if (progress >= 100) {
			progress = 100;
			clearInterval(interval);
			progressInfo.textContent = "Waiting for all components to load ...";
		}

		progressBar.style.width = `${progress}%`;
	}, 300);

	return () => {
		if (interval) {
			clearInterval(interval);
		}
	};
});
