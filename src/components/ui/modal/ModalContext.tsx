import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type ReactElement,
	useEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { compare } from "@/utils/common";

export const ModalContext = createContext<{
	isOpen: boolean;
	setIsOpen: Dispatch<boolean>;
	modal: ReactElement | null;
	setModal: Dispatch<ReactElement | null>;
} | null>(null);

export const ModalProvider = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const [modal, setModal] = useState<ReactElement | null>(null);

	function keyDownHandler(e: KeyboardEvent) {
		if (compare(e.key, "Escape")) {
			setIsOpen(false);
		}
	}

	useEffect(() => {
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
		<ModalContext.Provider
			value={{
				isOpen,
				setIsOpen,
				modal,
				setModal,
			}}
		>
			{children}
			{modal !== null ? createPortal(modal, document.body) : null}
		</ModalContext.Provider>
	);
};
