import ItemDeleteButton from "@/components/ui/panel/ItemDeleteButton";
import { getTimeAgo } from "@/utils/time";
import type { AppNotification } from "../types/notification";

interface NoticationItemProps {
	notification: AppNotification;
	readItem(id: string): void;
	deleteItem(id: string): void;
}

export default function NotificationItem({
	notification,
	readItem,
	deleteItem,
}: NoticationItemProps) {
	return (
		<div
			key={notification.id}
			role="button"
			tabIndex={0}
			className="flex items-center gap-3 px-3 py-2.5 rounded-xl dark:hover:bg-surface-dark-hover hover:bg-surface-hover transition-colors group"
			onMouseLeave={() => readItem(notification.id)}
			onFocus={() => readItem(notification.id)}
		>
			<div className="flex items-center justify-center shrink-0">
				<div
					className={`${notification.read ? "dark:bg-white/20 bg-gray-300" : "bg-green"} w-2 h-2 rounded-full transition-colors`}
				></div>
			</div>
			<div
				className={`flex-1 flex-col items-center gap-3 ${notification.read ? "opacity-70" : ""}`}
			>
				<p className="mb-1 text-xs font-semibold dark:text-white/35 text-gray-400 uppercase tracking-widest">
					{notification.label}
				</p>
				<p className="text-sm dark:text-white/70 text-gray-600">
					{notification.description}
				</p>
				<p className="text-xs dark:text-white/35 text-gray-400">
					{getTimeAgo(notification.created)}
				</p>
			</div>
			<ItemDeleteButton onClick={() => deleteItem(notification.id)} />
		</div>
	);
}
