import type { PropsWithChildren } from "react";

interface PanelProps {
	isActive: boolean;
}

export default function Panel({
	isActive,
	children,
}: PanelProps & PropsWithChildren) {
	return (
		<div
			className={`${isActive ? "" : "translate-x-full"} fixed z-50 top-0 right-0 h-full w-80 flex flex-col dark:bg-surface-dark-container bg-surface-container shadow-2xl transform transition-transform duration-300 border-l dark:border-surface-dark-element border-surface-element`}
		>
			{children}
		</div>
	);
}
