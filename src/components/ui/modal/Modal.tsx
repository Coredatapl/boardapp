import { type PropsWithChildren, useEffect, useRef } from "react";
import ModalDialog from "@/components/ui/modal/ModalDialog";
import ModalMask from "@/components/ui/modal/ModalMask";
import { useModal } from "./hooks/useModal";

export default function Modal({ children }: PropsWithChildren) {
	const modalRef = useRef<HTMLDivElement>(null);
	const modal = useModal();

	useEffect(() => {
		const modalElement = modalRef.current;

		if (!modalElement) {
			return;
		}
		if (modal.isOpen) {
			modalElement.classList.remove("pointer-events-none");
		} else {
			setTimeout(() => {
				modalElement.classList.add("pointer-events-none");
			}, 300);
		}
	}, [modal.isOpen]);

	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key !== "Escape") return;
			if (modal.isOpen) {
				modal.close();
			}
		}

		document.addEventListener("keydown", (e: KeyboardEvent) =>
			keyDownHandler(e),
		);

		return () => {
			document.removeEventListener("keydown", (e: KeyboardEvent) =>
				keyDownHandler(e),
			);
		};
	}, []);

	return (
		<div
			ref={modalRef}
			className="fixed inset-0 z-50 flex p-4 items-center justify-center pointer-events-none"
		>
			<ModalMask isOpen={modal.isOpen} />
			<ModalDialog isOpen={modal.isOpen}>{children}</ModalDialog>
		</div>
	);
}
