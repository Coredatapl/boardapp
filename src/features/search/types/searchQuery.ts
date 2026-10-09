import type { SearchModeType } from "./searchMode";

export interface SearchQuery {
	id: string;
	mode: SearchModeType;
	value: string;
	createdAt: number;
	context?: string | undefined;
	rules?: string | undefined;
}
