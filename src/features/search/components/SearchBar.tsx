import {
	type InputEvent,
	type KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useAppContext } from "@/app/AppContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { autoResize, checkPermission, compare } from "@/utils/common";
import { SearchQueryMinLength } from "@/utils/validation";
import { useSpeech } from "../hooks/useSpeech";
import type { SearchMode } from "../types/searchMode";
import type { SearchQuery } from "../types/searchQuery";
import { AiModeType, WebModeType } from "../utils/common";
import { modes } from "../utils/data";
import { QueryBuilder } from "../utils/queryBuilder";
import ClearButton from "./ClearButton";
import ContextWindow from "./ContextWindow";
import ModeSelector from "./ModeSelector";
import QueryHistory from "./QueryHistory";
import SendButton from "./SendButton";
import ToolSelector from "./ToolSelector";
import VoiceButton from "./VoiceButton";

// TODO: delay focus change + reset on click inside container
export default function SearchBar() {
	const { settings, isMobile } = useAppContext();
	const { t } = useTranslate();
	const logger = useLogger("SearchBar");
	const speech = useSpeech(settings.lang);
	const storage = useStorage();
	const searchUrl = `${import.meta.env.VITE_SEARCH_URL}`;
	const researchUrl = `${import.meta.env.VITE_RESEARCH_URL}`;
	const containerRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLTextAreaElement>(null);
	const [focused, setFocused] = useState(false);
	const [voiceEnabled, setVoiceEnabled] = useState(false);
	const [voiceActionInProgress, setVoiceActionInProgress] = useState(false);
	const defaultMode = modes.filter((m) => m.type === WebModeType)[0];
	const [searchMode, setSearchMode] = useState<SearchMode>(defaultMode);
	const defaultPlaceholder = t("searchbar.defaultPlaceholder");
	const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
	const [actionLabel, setActionLabel] = useState(t("searchbar.actionSearch"));
	const [contextOpen, setContextOpen] = useState(false);
	const [contextValue, setContextValue] = useState<string | undefined>(
		undefined,
	);
	const [historyOpen, setHistoryOpen] = useState(false);
	const [queryHistory, setQueryHistory] = useState<SearchQuery[]>(
		storage.get<SearchQuery[]>("query-history") ?? [],
	);
	const [sendDisabled, setSendDisabled] = useState(true);
	const queryMinLength = SearchQueryMinLength ?? 3;
	const historyMaxCount = 5;
	let blurTimer: number | undefined;

	function clearInput() {
		if (!searchInputRef.current) {
			return;
		}
		searchInputRef.current.value = "";
		setSendDisabled(true);
		autoResize(searchInputRef.current);
	}

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
		setPlaceholder(t(searchMode.placeHolder));
	}

	function updateHistory(value: string) {
		if (!settings.queryHistory) return;
		const id = `query-${performance.now().toFixed(0)}`;
		const query: SearchQuery = {
			id,
			mode: searchMode.type,
			value,
			createdAt: Date.now(),
			context: contextValue,
		};
		const history = [...queryHistory];

		if (history.length >= historyMaxCount) {
			history.shift();
		}
		setQueryHistory([...history, query]);
		storage.set("query-history", [...history, query]);
	}

	function deleteHistory() {
		setQueryHistory([]);
		storage.del("query-history");
	}

	function restoreQuery(query: SearchQuery) {
		if (!searchInputRef.current) {
			return;
		}
		const input = searchInputRef.current;

		if (query.value.length) {
			input.value = query.value;
			setSendDisabled(false);
			autoResize(searchInputRef.current);
		}
		if (query.context?.length) {
			setContextValue(query.context);
			setContextOpen(true);
		} else {
			setContextValue(undefined);
			setContextOpen(false);
		}
	}

	function send() {
		const url = searchMode.type === AiModeType ? researchUrl : searchUrl;
		const inputValue = searchInputRef.current?.value.trim();

		if (!inputValue || inputValue.length < queryMinLength) {
			logger.log("Search query too short");
			return;
		}
		updateHistory(inputValue);

		const query = QueryBuilder(inputValue, contextValue);

		window.open(`${url}${query}`, "_self");
	}

	function sendHandler() {
		send();
	}

	function voiceActionHandler() {
		if (!voiceActionInProgress && !speech.isListening) {
			setVoiceActionInProgress(true);
			startListening();
		} else if (voiceActionInProgress && speech.isListening) {
			stopListening();
			setVoiceActionInProgress(false);
		} else if (voiceActionInProgress && !speech.isListening) {
			setVoiceActionInProgress(false);
			setPlaceholder(t("searchbar.voicePlaceholder"));
			setActionLabel(t("searchbar.actionTalk"));
		}
	}

	function keyDownHandler(e: KeyboardEvent) {
		if (compare(e.key, "Enter") && e.shiftKey) {
			if (searchInputRef.current) {
				autoResize(searchInputRef.current);
			}
			return;
		}
		if (compare(e.key, "Enter") && !e.shiftKey) {
			send();
		}
	}

	function inputHandler(event: InputEvent<HTMLTextAreaElement>) {
		const value = event.currentTarget.value.trim();
		if (value.length) {
			setSendDisabled(false);
		} else {
			setSendDisabled(true);
			event.currentTarget.value = "";
		}
		autoResize(event.currentTarget);
	}

	function focusHandler() {
		setFocused(true);
	}

	function blurHandler() {
		clearTimeout(blurTimer);
		blurTimer = setTimeout(() => {
			setFocused(false);
		}, 500);
	}

	useClickOutside([containerRef], () => {
		blurHandler();
	});

	useEffect(() => {
		setPlaceholder(t(searchMode.placeHolder));
		setActionLabel(t(searchMode.actionLabel));

		if (searchMode.type === WebModeType) {
			setContextOpen(false);
			searchInputRef.current?.focus();
		}
	}, [searchMode]);

	useEffect(() => {
		if (!settings.queryHistory) {
			deleteHistory();
		}
	}, [settings.queryHistory]);

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
			if (speech.isAvailableDevice === false) {
				setVoiceEnabled(false);
			}
			setPlaceholder(t(searchMode.placeHolder));
			setVoiceActionInProgress(false);
		};
		speech.onResult = (result) => {
			if (!input) return;
			if (result.length) {
				input.value = result;
				setSendDisabled(false);
			}

			setPlaceholder(t(searchMode.placeHolder));
			setVoiceActionInProgress(false);
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
			className={`group relative z-10 ${focused ? "lg:max-w-8/12" : "max-w-xl"} w-full transition-all duration-300 ease-in-out opacity-0 animate-slide-up delay-3 fill-mode-forwards`}
		>
			<div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-700 bg-fuchsia-800 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

			<div
				ref={containerRef}
				className={`relative w-full items-center dark:bg-surface-dark bg-white border dark:border-white/8 border-gray-300 rounded-2xl custom-shadow`}
			>
				<ContextWindow
					isOpen={contextOpen}
					setIsOpen={setContextOpen}
					value={contextValue}
					setValue={setContextValue}
					onFocus={focusHandler}
				/>

				<div
					className={`flex items-start ${isMobile ? "gap-3 px-2 pt-2" : "gap-3 px-5 pt-4"}`}
				>
					<svg
						className={`mt-1 w-4.5 h-4.5 shrink-0 dark:text-white/30 text-gray-400 pointer-events-none`}
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
					<textarea
						ref={searchInputRef}
						className="max-h-60 w-full py-0.5 resize-none overflow-y-hidden text-sm leading-6 outline-none bg-transparent text-gray-700 dark:text-white/85 placeholder-gray-400 dark:placeholder-white/25"
						id="searchInput"
						name="searchInput"
						rows={1}
						placeholder={placeholder}
						onKeyDown={(e) => keyDownHandler(e)}
						onInput={(e) => inputHandler(e)}
						onFocus={() => focusHandler()}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						spellCheck={false}
						aria-label="Search query"
						aria-autocomplete="both"
						aria-haspopup={false}
					></textarea>
					<ClearButton onClick={clearInput} disabled={sendDisabled} />
				</div>

				{/* Toolbar */}
				<div
					className={`flex items-center justify-between ${isMobile ? "gap-1 px-2 pt-2 pb-2" : "gap-2 px-3 pt-3 pb-3"}`}
				>
					<div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
						<ToolSelector
							setContextOpen={setContextOpen}
							setHistoryOpen={setHistoryOpen}
						/>
						<ModeSelector mode={searchMode} setMode={setSearchMode} />
					</div>

					<div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
						<VoiceButton
							onClick={voiceActionHandler}
							disabled={!voiceEnabled}
							isListening={voiceActionInProgress}
						/>
						<SendButton
							label={actionLabel}
							onClick={sendHandler}
							disabled={sendDisabled}
						/>
					</div>
				</div>

				<QueryHistory
					isOpen={historyOpen}
					setIsOpen={setHistoryOpen}
					queries={queryHistory}
					restore={restoreQuery}
					clear={deleteHistory}
				/>
			</div>
		</div>
	);
}
