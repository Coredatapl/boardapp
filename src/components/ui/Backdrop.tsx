import { useEffect, useRef } from "react";
import { usePanel } from "./panel/hooks/usePanel";

export default function Backdrop() {
	const { activePanel, closePanel } = usePanel();
	const backdropRef = useRef<HTMLDivElement>(null);

	function onClickHandler() {
		closePanel();
	}

	useEffect(() => {
		const backdrop = backdropRef.current;
		if (!backdrop) {
			return;
		}

		if (activePanel !== null) {
			backdrop.classList.remove("hidden");
		} else {
			setTimeout(() => backdrop.classList.add("hidden"), 300);
		}
	}, [activePanel]);

	useEffect(() => {
		const backdrop = backdropRef.current;
		if (!backdrop) {
			return;
		}

		backdrop.addEventListener("click", onClickHandler);

		return () => {
			backdrop.removeEventListener("click", onClickHandler);
		};
	}, []);

	return (
		<div
			ref={backdropRef}
			className="fixed inset-0 bg-black/50 z-30 hidden backdrop-blur-sm"
		></div>
	);
}
