import type { AiModeType, WebModeType } from "../utils/common";

export type SearchModeType = typeof WebModeType | typeof AiModeType;

export interface SearchMode {
	type: SearchModeType;
	label: string;
	description: string;
	placeHolder: string;
	actionLabel: string;
}
