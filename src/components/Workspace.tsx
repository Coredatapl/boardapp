import type { PropsWithChildren } from "react";

export default function Workspace({ children }: PropsWithChildren) {
	return (
		<main className="relative z-0 flex flex-col min-h-screen px-4 gap-10 items-center justify-center">
			{children}
		</main>
	);
}
