import { type PropsWithChildren, useEffect, useRef } from "react";

interface ModalDialogProps {
	isOpen: boolean;
}

export default function ModalDialog({
	isOpen,
	children,
}: ModalDialogProps & PropsWithChildren) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;

		if (!dialog) {
			return;
		}
		if (isOpen) {
			dialog.classList.remove("pointer-events-none");
			requestAnimationFrame(() => {
				dialog.classList.remove("scale-85", "opacity-0");
				dialog.classList.add("scale-100", "opacity-100");
			});
		} else {
			requestAnimationFrame(() => {
				dialog.classList.remove("scale-100", "opacity-100");
				dialog.classList.add("scale-85", "opacity-0");
			});
			setTimeout(() => {
				dialog.classList.add("pointer-events-none");
			}, 300);
		}
	}, [isOpen]);

	return (
		<div
			ref={dialogRef}
			className="relative w-full max-w-md dark:bg-surface-dark-container bg-surface-container rounded-2xl shadow-2xl border dark:border-surface-dark-element border-surface-element overflow-hidden scale-85 opacity-0 transition-all duration-300 ease-out pointer-events-none"
		>
			{children}
		</div>
	);
}
