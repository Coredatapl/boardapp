import type { MouseEvent } from "react";
import { useAppContext } from "@/app/AppContext";
import { staticIcons } from "@/assets/static/icons";
import type { Shortcut } from "../types/shortcut";
import DeleteBadge from "./DeleteBadge";

interface ShortcutItemProps {
	shortcut: Shortcut;
	updateShortcut(id: string, params: Partial<Shortcut>): void;
	deleteShortcut(id: string): void;
}

export default function ShortcutItem({
	shortcut,
	updateShortcut,
	deleteShortcut,
}: ShortcutItemProps) {
	const { editMode } = useAppContext();

	function onClick(event: MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		if (editMode) return;

		updateShortcut(shortcut.id, { clicks: shortcut.clicks + 1 });

		window.open(shortcut.url, "_self");
	}

	return (
		<div
			className="shortcut-tile relative"
			data-id={shortcut.id}
			key={shortcut.id}
		>
			<DeleteBadge
				isActive={editMode}
				shortcut={shortcut}
				deleteShortcut={deleteShortcut}
			/>
			<a
				href={editMode ? undefined : shortcut.url}
				onClick={(e: MouseEvent<HTMLAnchorElement>) => onClick(e)}
				data-url={shortcut.url}
				className="shortcut flex flex-col items-center gap-2 group"
			>
				<div className="icon-wrap w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm dark:bg-surface-dark-container bg-surface-container border dark:border-surface-dark-element border-surface-element transition-all duration-200 group-hover:scale-105">
					{shortcut.favicon && (
						<img
							src={shortcut.favicon}
							alt={shortcut.name}
							className="w-8 h-8 object-contain"
						/>
					)}
					{!shortcut.favicon && staticIcons[shortcut.id]}
					{!shortcut.favicon && !staticIcons[shortcut.id] && (
						<span className="text-2xl">{shortcut.emoji || "🔗"}</span>
					)}
				</div>
				<span className="text-sm dark:text-white/50 text-gray-500 group-hover:dark:text-white/80 group-hover:text-gray-700 transition-colors">
					{shortcut.name}
				</span>
			</a>
		</div>
	);
}
