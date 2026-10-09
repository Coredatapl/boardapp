import type { SearchMode } from "../types/searchMode";
import { AiModeType, WebModeType } from "./common";

export const modes: SearchMode[] = [
	{
		type: WebModeType,
		label: "searchbar.searchModeLabel",
		description: "searchbar.searchModeDescription",
		placeHolder: "searchbar.defaultPlaceholder",
		actionLabel: "searchbar.actionSearch",
	},
	{
		type: AiModeType,
		label: "searchbar.aiModeLabel",
		description: "searchbar.aiModeDescription",
		placeHolder: "searchbar.aiPlaceholder",
		actionLabel: "searchbar.actionAsk",
	},
];
