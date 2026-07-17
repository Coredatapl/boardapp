import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslate } from "@/hooks/useTranslate";
import type { SearchMode, SearchModeType } from "../types/searchMode";
import { SearchAiMode, SearchVoiceMode } from "../utils/common";

interface ModeSelectorProps {
	mode: SearchModeType | null;
	setMode: Dispatch<SetStateAction<SearchModeType | null>>;
	voiceEnabled: boolean;
}

export default function ModeSelector({
	mode,
	setMode,
	voiceEnabled,
}: ModeSelectorProps) {
	const { t } = useTranslate();
	const modes: SearchMode[] = [
		{
			mode: null,
			label: t("searchbar.searchModeLabel"),
			description: t("searchbar.searchModeDescription"),
		},
		{
			mode: SearchAiMode,
			label: t("searchbar.aiModeLabel"),
			description: t("searchbar.aiModeDescription"),
		},
		{
			mode: SearchVoiceMode,
			label: t("searchbar.voiceModeLabel"),
			description: t("searchbar.voiceModeDescription"),
		},
	];
	const containerRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [currentMode, setCurrentMode] = useState<SearchMode>(getMode(mode));

	function getMode(mode: SearchModeType | null): SearchMode {
		return modes.filter((m) => m.mode === mode)[0];
	}

	function toggleDropdown(forcedOpenState?: boolean) {
		const open = forcedOpenState !== undefined ? forcedOpenState : !isOpen;
		setIsOpen(open);
	}

	function changeMode(mode: SearchModeType | null) {
		setMode(mode);
		setCurrentMode(getMode(mode));
		toggleDropdown(false);
	}

	useClickOutside([containerRef], () => {
		toggleDropdown(false);
	});

	useEffect(() => {
		setCurrentMode(getMode(mode));
		toggleDropdown(false);
	}, [mode]);

	return (
		<div
			ref={containerRef}
			className="relative ml-1 shrink-0"
			id="toolDropdownContainer"
		>
			<button
				id="dropdownBtn"
				type="button"
				onClick={() => toggleDropdown()}
				title={currentMode.description}
				className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm font-medium cursor-pointer dark:bg-surface-dark-container bg-surface-container dark:hover:bg-surface-dark-hover hover:bg-surface-hover dark:text-white/30 text-gray-400 dark:hover:text-white/60 hover:text-gray-500 border dark:border-surface-dark border-surface-element transition-all duration-200 hover:shadow-lg"
			>
				<span>{currentMode.label}</span>
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
				className={`${isOpen ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 pointer-events-none"} absolute right-0 mt-2 w-36 dark:bg-surface-dark-container bg-surface-container border dark:border-surface-dark-container border-surface-element rounded-xl shadow-2xl dropdown-animate overflow-hidden`}
			>
				<div className="p-1">
					<button
						type="button"
						onClick={() => changeMode(null)}
						title={getMode(null).description}
						className="w-full flex items-center space-x-2.5 px-3 py-2 text-left text-sm cursor-pointer text-gray-400 dark:hover:text-white hover:text-gray-500 dark:hover:bg-neutral-700/80 hover:bg-surface-hover rounded-lg transition-colors duration-150"
					>
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<title>Search</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
						<span>{t("searchbar.searchModeLabel")}</span>
					</button>

					<button
						type="button"
						onClick={() => changeMode(SearchAiMode)}
						title={getMode(SearchAiMode).description}
						className="w-full flex items-center space-x-2.5 px-3 py-2 text-left text-sm cursor-pointer text-gray-400 dark:hover:text-white hover:text-gray-500 dark:hover:bg-purple-600/20 hover:bg-purple-600/10 rounded-lg transition-colors duration-150"
					>
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
						<span>{t("searchbar.aiModeLabel")}</span>
					</button>

					<button
						type="button"
						onClick={() => changeMode(SearchVoiceMode)}
						title={getMode(SearchVoiceMode).description}
						disabled={!voiceEnabled}
						className="w-full flex items-center space-x-2.5 px-3 py-2 text-left text-sm not-disabled:cursor-pointer text-gray-400 not-disabled:dark:hover:text-white not-disabled:hover:text-gray-500 not-disabled:dark:hover:bg-blue-600/20 not-disabled:hover:bg-blue-600/10 rounded-lg transition-colors duration-150"
					>
						<svg
							className="w-4 h-4 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Voice</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
							></path>
						</svg>
						<span>{t("searchbar.voiceModeLabel")}</span>
					</button>
				</div>
			</div>
		</div>
	);
}
