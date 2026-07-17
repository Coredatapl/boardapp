import ItemDeleteButton from "@/components/ui/panel/ItemDeleteButton";
import { getTimeAgo } from "@/utils/time";
import type { TodoItem } from "../types/todoItem";

interface TodoListItemProps {
	item: TodoItem;
	toggleDone(id: string): void;
	deleteItem(id: string): void;
}

export default function TodoListItem({
	item,
	toggleDone,
	deleteItem,
}: TodoListItemProps) {
	return (
		<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl dark:hover:bg-surface-dark-hover hover:bg-surface-hover transition-colors group">
			<div
				role="button"
				tabIndex={0}
				onClick={() => toggleDone(item.id)}
				className={`w-5 h-5 shrink-0 rounded-full border-2 cursor-pointer ${
					item.done
						? "border-emerald-500 bg-emerald-500"
						: "dark:border-white/20 border-gray-300"
				} flex items-center justify-center`}
			>
				{item.done && (
					<svg
						className="w-3 h-3 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="3"
					>
						<title>Check</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
						/>
					</svg>
				)}
			</div>
			<div
				className={`flex-1 flex-col text-sm dark:text-white/70 text-gray-600 ${item.done ? "line-through opacity-40" : ""}`}
			>
				<div className="w-full">{item.label}</div>
				<div className="w-full text-xs dark:text-white/25 text-gray-400">
					{getTimeAgo(item.created)}
				</div>
			</div>
			<ItemDeleteButton onClick={() => deleteItem(item.id)} />
		</div>
	);
}
