import type { PropsWithChildren } from "react";

export default function AppView({ children }: PropsWithChildren) {
	return (
		<div
			id="appView"
			className={`relative min-h-screen overflow-x-hidden dark:bg-surface-dark bg-surface transition-colors duration-300`}
		>
			{children}
		</div>
	);
}
