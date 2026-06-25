import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useEffect,
	useState,
} from "react";
import type { PanelType } from "@/types/panel";
import { compare } from "@/utils/common";

export const PanelContext = createContext<{
	activePanel: PanelType | null;
	setActivePanel: Dispatch<SetStateAction<PanelType | null>>;
} | null>(null);

export const PanelProvider = ({ children }: PropsWithChildren) => {
	const [activePanel, setActivePanel] = useState<PanelType | null>(null);

	function keyDownHandler(e: KeyboardEvent) {
		if (compare(e.key, "Escape")) {
			setActivePanel(null);
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
		<PanelContext.Provider
			value={{
				activePanel,
				setActivePanel,
			}}
		>
			{children}
		</PanelContext.Provider>
	);
};
