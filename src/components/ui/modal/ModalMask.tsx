import { useEffect, useRef } from "react";

interface ModalMaskProps {
	isOpen: boolean;
}

export default function ModalMask({ isOpen }: ModalMaskProps) {
	const maskRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mask = maskRef.current;

		if (!mask) {
			return;
		}
		if (isOpen) {
			mask.classList.remove("pointer-events-none");
			requestAnimationFrame(() => {
				mask.classList.remove("opacity-0");
				mask.classList.add("opacity-100");
			});
		} else {
			requestAnimationFrame(() => {
				mask.classList.remove("opacity-100");
				mask.classList.add("opacity-0");
			});

			setTimeout(() => {
				mask.classList.add("pointer-events-none");
			}, 300);
		}
	}, [isOpen]);

	return (
		<div
			ref={maskRef}
			className="absolute inset-0 bg-black/30 backdrop-blur-md opacity-0 transition-opacity duration-300 pointer-events-none"
		></div>
	);
}
