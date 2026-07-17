import { useEffect, useState } from "react";

export default function ProgressBar() {
	const [progress, setProgress] = useState(0);
	const maxProgress = 100;
	const updateTimeout = 300;
	let updateInterval: number | undefined;
	let current = 0;

	function update() {
		if (current >= maxProgress) {
			stop();
			return;
		}

		const increment = Math.floor(Math.random() * 14) + 2;
		current = Math.min(current + increment, maxProgress);
		setProgress(current);
	}

	function stop() {
		setProgress(100);
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	}

	useEffect(() => {
		setProgress(0);
		updateInterval = setInterval(update, updateTimeout);
		return () => stop();
	}, []);

	return (
		<div className="w-64 h-1.5 rounded-full bg-surface-element dark:bg-surface-dark-element overflow-hidden">
			<div
				id="progressBar"
				className="h-full rounded-full bg-linear-to-r from-accent via-accent-soft to-green transition-[width] duration-300 ease-out"
				style={{
					width: `${progress}%`,
				}}
			></div>
		</div>
	);
}
