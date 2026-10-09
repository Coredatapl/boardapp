import { useAppContext } from "@/app/AppContext";
import type { ButtonProps } from "./Button";

interface CloseButtonProps {
	size?: "small" | "base";
}

export default function CloseButton({
	label,
	onClick,
	size,
}: ButtonProps & CloseButtonProps) {
	const { isMobile } = useAppContext();

	return (
		<button
			className={`${isMobile ? "dark:bg-white/10 bg-black/8" : "dark:hover:bg-white/10 hover:bg-black/8"} ${size === "small" ? "w-5 h-5 rounded-lg" : "w-8 h-8 rounded-xl"} flex items-center justify-center cursor-pointer transition-colors`}
			type="button"
			onClick={onClick}
		>
			<svg
				className="w-4 h-4 dark:text-white/50 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<title>{label}</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	);
}
