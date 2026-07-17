import { type ReactElement, useContext } from "react";
import { ModalContext } from "../ModalContext";

export function useModal() {
	const context = useContext(ModalContext);
	if (context === null) {
		throw new Error("Modal context is available only within ModalProvider");
	}
	return {
		isOpen: context.isOpen,
		open: (modal: ReactElement) => {
			context.setModal(modal);
			context.setIsOpen(true);
		},
		close: () => {
			context.setIsOpen(false);
			setTimeout(() => context.setModal(null), 1000);
		},
	};
}
