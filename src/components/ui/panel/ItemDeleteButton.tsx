import { useAppContext } from "@/app/AppContext";

interface ItemDeleteButtonProps {
	onClick: () => void;
}

export default function ItemDeleteButton({ onClick }: ItemDeleteButtonProps) {
	const { isMobile } = useAppContext();

	return (
		<button
			type="button"
			onClick={onClick}
			className={`${isMobile ? "opacity-100 dark:bg-white/10 bg-black/8" : "opacity-0 group-hover:opacity-100 dark:hover:bg-white/10 hover:bg-black/8"} w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer transition-all`}
		>
			<svg
				className="w-3 h-3 dark:text-white/40 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<title>Delete</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>
	);
}
