import type { SearchAiMode, SearchVoiceMode } from "../utils/common";

export interface SearchMode {
	mode: SearchModeType | null;
	label: string;
	description: string;
}
export type SearchModeType = typeof SearchAiMode | typeof SearchVoiceMode;
