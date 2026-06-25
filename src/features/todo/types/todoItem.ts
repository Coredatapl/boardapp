import type { Entity } from "@/types/entity";

export interface TodoItem extends Entity {
	label: string;
	done: boolean;
}
