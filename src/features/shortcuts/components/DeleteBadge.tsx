import { useModal } from "@/components/ui/modal/hooks/useModal";
import type { Shortcut } from "../types/shortcut";
import DeleteModal from "./DeleteModal";

interface DeleteBadgeProps {
	isActive: boolean;
	shortcut: Shortcut;
	deleteShortcut(id: string): void;
}

export default function DeleteBadge({
	isActive,
	shortcut,
	deleteShortcut,
}: DeleteBadgeProps) {
	const modal = useModal();

	function openModal() {
		modal.open(
			<DeleteModal shortcut={shortcut} deleteShortcut={deleteShortcut} />,
		);
	}

	return (
		<button
			type="button"
			className={`delete-badge ${isActive ? "z-10 opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-0 pointer-events-none"} absolute -top-1.75 -right-1.75 w-5.5 h-5.5 bg-red-500 rounded-full flex items-center justify-center transition-[opacity,transform] duration-170 ease-in-out hover:scale-115 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.45)] border-2 dark:border-surface-dark-element border-surface-element`}
			aria-label={`Remove ${shortcut.name}`}
			onClick={openModal}
		>
			<svg width="9" height="9" viewBox="0 0 9 9" fill="none">
				<title>Remove</title>
				<path
					d="M1.5 1.5l6 6M7.5 1.5l-6 6"
					stroke="white"
					strokeWidth="1.8"
					strokeLinecap="round"
				/>
			</svg>
		</button>
	);
}
