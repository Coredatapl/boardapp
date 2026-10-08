import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslate } from "@/hooks/useTranslate";
import type { SearchMode } from "../types/searchMode";
import { AiModeType } from "../utils/common";
import { modes } from "../utils/data";

interface ModeSelectorProps {
	mode: SearchMode;
	setMode: Dispatch<SetStateAction<SearchMode>>;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
	const { t } = useTranslate();
	const containerRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	function toggleDropdown(forcedOpenState?: boolean) {
		const open = forcedOpenState !== undefined ? forcedOpenState : !isOpen;
		setIsOpen(open);
	}

	function changeMode(newMode: SearchMode) {
		setMode(newMode);
		toggleDropdown(false);
	}

	useClickOutside([containerRef], () => {
		toggleDropdown(false);
	});

	return (
		<div
			ref={containerRef}
			className="relative shrink-0"
			id="toolDropdownContainer"
		>
			<button
				id="dropdownBtn"
				type="button"
				onClick={() => toggleDropdown()}
				title={t(mode.description)}
				className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-medium cursor-pointer dark:bg-surface-dark-container bg-surface-container dark:hover:bg-surface-dark-hover hover:bg-surface-hover dark:text-white/30 text-slate-500 hover:text-accent border dark:border-surface-dark border-surface-element transition"
			>
				<span>{t(mode.label)}</span>
				<svg
					id="arrowIcon"
					className={`${isOpen ? "rotate-180" : ""} w-3 h-3 transform transition-transform duration-200`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Arrow</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2.5"
						d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</button>

			<div
				id="dropdownMenu"
				className={`${isOpen ? "opacity-100 scale-100 z-20" : "opacity-0 scale-95 pointer-events-none"} absolute right-0 min-w-28 mt-2 p-1 dark:bg-surface-dark-container bg-surface-container border dark:border-surface-dark-container border-surface-element rounded-xl shadow-2xl dropdown-animate overflow-hidden`}
			>
				{modes.map((mode) => (
					<button
						key={mode.type}
						type="button"
						onClick={() => changeMode(mode)}
						title={t(mode.description)}
						className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left text-sm cursor-pointer text-gray-400 dark:hover:text-white hover:text-gray-500 ${mode.type === AiModeType ? "dark:hover:bg-purple-600/20 hover:bg-purple-600/10" : "dark:hover:bg-neutral-700/80 hover:bg-surface-hover"} rounded-lg transition-colors duration-150`}
					>
						{mode.type === AiModeType ? (
							<svg
								className="w-4 h-4 text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>AI</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
						) : (
							<svg
								className="w-4 h-4 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>{t(mode.label)}</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								/>
							</svg>
						)}
						<span>{t(mode.label)}</span>
					</button>
				))}
			</div>
		</div>
	);
}
