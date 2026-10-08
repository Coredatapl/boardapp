import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslate } from "@/hooks/useTranslate";
import type { SearchTool } from "../types/searchTool";

interface ToolSelectorProps {
	setContextOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ToolSelector({ setContextOpen }: ToolSelectorProps) {
	const { isMobile } = useAppContext();
	const { t } = useTranslate();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);
	const tools: SearchTool[] = [
		{
			name: "context",
			label: t("searchbar.toolContextLabel"),
			openAction: () => setContextOpen(true),
		},
		{
			name: "history",
			label: t("searchbar.toolHistoryLabel"),
			openAction: () => {},
		},
	];

	function handleToolOpen(tool: SearchTool) {
		tool.openAction();
		toggleOpen(false);
	}

	function toggleOpen(forcedOpenState?: boolean) {
		const open = forcedOpenState !== undefined ? forcedOpenState : !isOpen;
		setIsOpen(open);
	}

	useClickOutside([containerRef], () => {
		toggleOpen(false);
	});

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => toggleOpen()}
				aria-haspopup="true"
				aria-expanded="false"
				className={`flex items-center gap-1.5 space-x-1.5 ${isMobile ? "px-1.5" : "px-3"} py-1.5 rounded-xl text-sm font-medium cursor-pointer dark:bg-surface-dark-container bg-surface-container dark:hover:bg-surface-dark-hover hover:bg-surface-hover dark:text-white/30 text-slate-500 hover:text-accent border dark:border-surface-dark border-surface-element focus:outline-none transition`}
			>
				<svg
					className="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Tools</title>
					<path d="M3 6h4M13 6h8" />
					<circle cx="10" cy="6" r="2.5" />
					<path d="M3 12h10M19 12h2" />
					<circle cx="16" cy="12" r="2.5" />
					<path d="M3 18h2M11 18h10" />
					<circle cx="8" cy="18" r="2.5" />
				</svg>
				{!isMobile ? t("searchbar.toolsLabel") : ""}
			</button>
			<ul
				className={`${isOpen ? "" : "hidden"} absolute left-0 z-20 w-32 mt-2 mb-2 p-1 rounded-xl dark:bg-surface-dark-container bg-surface-container border dark:border-surface-dark-container border-surface-element shadow-lg`}
			>
				{tools.map((tool) => (
					<li key={tool.name}>
						<button
							type="button"
							role="menuitem"
							onClick={() => handleToolOpen(tool)}
							data-tool={tool.name}
							className="w-full px-3 py-2 rounded-lg text-left text-sm cursor-pointer text-gray-400 dark:hover:text-white hover:text-gray-500 dark:hover:bg-neutral-700/80 hover:bg-surface-hover"
						>
							{tool.label}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
