import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLogger } from "@/hooks/useLogger";
import { useTranslate } from "@/hooks/useTranslate";
import { checkPermission, compare } from "@/utils/common";
import { SearchQueryMinLength } from "@/utils/validation";
import { useSpeech } from "../hooks/useSpeech";
import type { SearchModeType } from "../types/searchMode";
import { SearchAiMode, SearchVoiceMode } from "../utils/common";
import ModeSelector from "./ModeSelector";

export default function SearchBar() {
	const { settings, isMobile } = useAppContext();
	const { t } = useTranslate();
	const logger = useLogger("SearchBar");
	const speech = useSpeech(settings.lang);
	const searchUrl = `${import.meta.env.VITE_SEARCH_URL}`;
	const researchUrl = `${import.meta.env.VITE_RESEARCH_URL}`;
	const defaultPlaceholder = t("searchbar.defaultPlaceholder");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [focused, setFocused] = useState(false);
	const [voiceEnabled, setVoiceEnabled] = useState(false);
	const [voiceActionInProgress, setVoiceActionInProgress] = useState(false);
	const [searchMode, setSearchMode] = useState<SearchModeType | null>(null);
	const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
	const [actionLabel, setActionLabel] = useState(t("searchbar.actionSearch"));
	const queryMinLength = SearchQueryMinLength ?? 3;

	function startListening() {
		if (speech.isListening) return;
		speech.start();
		setActionLabel(t("searchbar.actionStop"));
		setPlaceholder(t("searchbar.listeningPlaceholder"));
	}

	function stopListening() {
		if (!speech.isListening) return;
		speech.stop();
		setActionLabel(t("searchbar.actionSend"));
		setPlaceholder(placeholder);
	}

	function search() {
		const url = searchMode === SearchAiMode ? researchUrl : searchUrl;
		const query = searchInputRef.current?.value.trim();

		if (!query || query.length < queryMinLength) {
			logger.log("Search query too short");
			return;
		}

		window.open(`${url}${encodeURIComponent(query)}`, "_self");
	}

	function actionHandler() {
		if (searchMode === SearchVoiceMode) {
			return voiceActionHandler();
		} else {
			search();
		}
	}

	function voiceActionHandler() {
		if (!voiceActionInProgress && !speech.isListening) {
			setVoiceActionInProgress(true);
			startListening();
		} else if (voiceActionInProgress && speech.isListening) {
			stopListening();
		} else if (voiceActionInProgress && !speech.isListening) {
			setVoiceActionInProgress(false);
			search();
			setPlaceholder(t("searchbar.voicePlaceholder"));
			setActionLabel(t("searchbar.actionTalk"));
		}
	}

	function keyDownHandler(e: KeyboardEvent) {
		if (compare(e.key, "Enter")) {
			search();
		}
	}

	useEffect(() => {
		if (searchMode === SearchAiMode) {
			setPlaceholder(t("searchbar.aiPlaceholder"));
			setActionLabel(t("searchbar.actionAsk"));
		} else if (searchMode === SearchVoiceMode) {
			setPlaceholder(t("searchbar.voicePlaceholder"));
			setActionLabel(t("searchbar.actionTalk"));
		} else {
			setPlaceholder(defaultPlaceholder);
			setActionLabel(t("searchbar.actionSearch"));
		}
	}, [searchMode]);

	useEffect(() => {
		if (!speech.isSupported || speech.isAvailableDevice === false) {
			logger.log("Speech Recognition feature is not supported");
			setVoiceEnabled(false);
			return;
		}

		void checkPermission(
			"microphone",
			() => {},
			() => setVoiceEnabled(false),
		);

		const input = searchInputRef.current;

		speech.setLanguage(settings.lang);
		speech.onError = (error) => {
			logger.log(error);
			// TODO: notify user => error modal
			setSearchMode(null);
			if (speech.isAvailableDevice === false) {
				setVoiceEnabled(false);
			}
		};
		speech.onResult = (result) => {
			if (!input) return;
			input.value = result;
			setPlaceholder(placeholder);
		};
		speech.onEnd = () => {
			setActionLabel(t("searchbar.actionSend"));
		};
		logger.log(`Speech Recognition (${settings.lang}) service is`, "ready");
		setVoiceEnabled(true);

		return () => {
			speech.onError = () => {};
			speech.onResult = () => {};
			speech.onEnd = () => {};
		};
	}, []);

	return (
		<div
			className={`group relative z-10 ${focused ? "lg:max-w-10/12" : "max-w-xl"} w-full transition-all duration-300 ease-in-out opacity-0 animate-slide-up delay-3 fill-mode-forwards`}
		>
			<div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-700 bg-fuchsia-800 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

			<div
				className={`relative flex ${isMobile ? "flex-col h-24" : ""} items-center dark:bg-surface-dark bg-surface border dark:border-white/8 border-gray-300 rounded-2xl custom-shadow`}
			>
				<svg
					className={`absolute left-4 ${isMobile ? "top-3" : "top-1/2 -translate-y-1/2"} w-4.5 h-4.5 dark:text-white/30 text-gray-400 pointer-events-none`}
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

				<input
					ref={searchInputRef}
					id="searchInput"
					name="searchInput"
					type="text"
					className="search-input w-full pl-11 pr-4 py-3 rounded-2xl border-none outline-none text-sm text-gray-700 dark:text-white/85 bg-white dark:bg-black/30 placeholder-gray-400 dark:placeholder-white/25 transition-all duration-200"
					placeholder={placeholder}
					onKeyDown={(e) => keyDownHandler(e)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					autoCapitalize="off"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					aria-autocomplete="both"
					aria-haspopup={false}
				/>

				<div
					className={`${isMobile ? "absolute left-1 bottom-0 pb-1 -translate-0.5" : "absolute right-3 top-1/2 -translate-y-1/2"}`}
				>
					<ModeSelector
						mode={searchMode}
						setMode={setSearchMode}
						voiceEnabled={voiceEnabled}
					/>
				</div>
				<div
					className={`${isMobile ? "absolute right-1 bottom-0 pb-1 -translate-0.5" : "hidden"} flex`}
				>
					<PrimaryButton label={actionLabel} onClick={actionHandler} />
				</div>
			</div>
		</div>
	);
}
