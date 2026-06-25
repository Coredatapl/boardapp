import type { PropsWithChildren } from "react";

interface IconButtonProps {
	onClick: () => void;
}

export default function IconButton({
	onClick,
	children,
}: IconButtonProps & PropsWithChildren) {
	return (
		<button
			type="button"
			title="Notifications"
			onClick={onClick}
			className="relative flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer outline-none dark:hover:bg-white/10 hover:bg-black/8 transition-colors group"
		>
			{children}
		</button>
	);
}
