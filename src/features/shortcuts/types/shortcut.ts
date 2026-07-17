import type { Entity } from "@/types/entity";

export interface Shortcut extends Entity {
	name: string;
	url: string;
	favicon: string | null;
	emoji?: string;
	clicks: number;
}
