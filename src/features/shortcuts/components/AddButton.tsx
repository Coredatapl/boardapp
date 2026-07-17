import { useModal } from "@/components/ui/modal/hooks/useModal";
import { useTranslate } from "@/hooks/useTranslate";
import type { Shortcut } from "../types/shortcut";
import AddModal from "./AddModal";

interface AddButtonProps {
	addShortcut(shortcut: Shortcut): void;
}

export default function AddButton({ addShortcut }: AddButtonProps) {
	const modal = useModal();
	const { t } = useTranslate();

	function openModal() {
		modal.open(<AddModal addShortcut={addShortcut} />);
	}

	return (
		<button
			id="addShortcut"
			className="shortcut flex flex-col items-center gap-2 cursor-pointer group"
			type="button"
			onClick={openModal}
		>
			<div className="icon-wrap w-14 h-14 rounded-2xl dark:bg-surface-dark-container bg-surface-container flex items-center justify-center shadow-sm border dark:border-surface-dark-element border-surface-element border-dashed group-hover:border-solid transition-all duration-200 group-hover:scale-105">
				<svg
					className="w-5 h-5 dark:text-white/25 text-gray-400 group-hover:text-accent transition-colors"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="2"
				>
					<title>Add shortcut</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			</div>
			<span className="text-sm dark:text-white/30 text-gray-400 group-hover:text-accent transition-colors">
				{t("shortcuts.addModal.buttonAdd")}
			</span>
		</button>
	);
}
