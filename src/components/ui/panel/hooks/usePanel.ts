import { useContext } from "react";
import type { PanelType } from "@/types/panel";
import { PanelContext } from "../PanelContext";

export function usePanel() {
	const context = useContext(PanelContext);
	if (context === null) {
		throw new Error("Panel context is available only within PanelProvider");
	}
	return {
		activePanel: context.activePanel,
		openPanel(panel: PanelType) {
			context.setActivePanel(panel);
		},
		closePanel() {
			context.setActivePanel(null);
		},
	};
}
