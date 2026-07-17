import { useModal } from "@/components/ui/modal/hooks/useModal";
import Modal from "@/components/ui/modal/Modal";
import ModalBody from "@/components/ui/modal/ModalBody";
import ModalFooter from "@/components/ui/modal/ModalFooter";
import { useTranslate } from "@/hooks/useTranslate";
import type { Shortcut } from "../types/shortcut";

interface DeleteModalProps {
	shortcut: Shortcut;
	deleteShortcut(id: string): void;
}

export default function DeleteModal({
	shortcut,
	deleteShortcut,
}: DeleteModalProps) {
	const modal = useModal();
	const { t } = useTranslate();

	function confirmDelete() {
		const tile = document.querySelector<HTMLDivElement>(
			`#shortcuts .shortcut-tile[data-id="${shortcut.id}"]`,
		);

		if (tile) {
			tile.classList.add("animate-tile-out", "pointer-events-none");
		}
		deleteHandler();
	}

	function deleteHandler() {
		modal.close();
		setTimeout(() => {
			deleteShortcut(shortcut.id);
		}, 600);
	}

	return (
		<Modal>
			<ModalBody>
				<div className="flex flex-col items-center text-center px-6 pt-7 pb-2 gap-3">
					<div className="w-16 h-16 rounded-2xl dark:bg-surface-dark bg-surface border dark:border-surface-dark-element border-surface-element flex items-center justify-center text-3xl overflow-hidden mb-1">
						{shortcut.favicon && (
							<img
								src={shortcut.favicon}
								className="w-10 h-10 object-contain rounded-lg"
								alt="Icon"
							/>
						)}
						{!shortcut.favicon && <span className="text-3xl">🔗</span>}
					</div>

					<div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
						<svg
							className="w-5 h-5 text-red-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<title>Delete</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</div>

					<h2 className="font-display text-lg dark:text-white text-gray-800 mt-1">
						{t("shortcuts.deleteModal.header")}
					</h2>

					<p className="text-sm dark:text-white/45 text-gray-500 leading-relaxed pb-1">
						<span
							id="deleteShortcutName"
							className="mr-1 dark:text-white/75 text-gray-700 font-medium"
						>
							{shortcut.name}
						</span>
						{t("shortcuts.deleteModal.hint")}
					</p>
				</div>
			</ModalBody>
			<ModalFooter
				confirmLabel={t("shortcuts.deleteModal.actionDelete")}
				onConfirm={confirmDelete}
				confirmImportant={true}
			/>
		</Modal>
	);
}
