import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { useAppContext } from "@/app/AppContext";
import CloseButton from "@/components/ui/CloseButton";
import { useTranslate } from "@/hooks/useTranslate";
import { autoResize } from "@/utils/common";
import ClearButton from "./ClearButton";

interface ContextWindowProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	value: string | undefined;
	setValue: Dispatch<SetStateAction<string | undefined>>;
	onFocus: () => void;
}

export default function ContextWindow({
	isOpen,
	setIsOpen,
	value,
	setValue,
	onFocus,
}: ContextWindowProps) {
	const { isMobile } = useAppContext();
	const { t } = useTranslate();
	const contextInputRef = useRef<HTMLTextAreaElement>(null);
	const contextMinLength = 3;
	let inputTimer: number | undefined;

	function updateContext(element: HTMLTextAreaElement) {
		const value = element.value;

		if (value.length < contextMinLength) {
			if (value.length === 0) {
				setValue(undefined);
			}
			return;
		}

		setValue(value);
	}

	function clearContext() {
		if (contextInputRef.current) {
			contextInputRef.current.value = "";
			autoResize(contextInputRef.current);
		}
		setValue(undefined);
	}

	function handleInput(element: HTMLTextAreaElement) {
		clearTimeout(inputTimer);
		inputTimer = setTimeout(() => {
			updateContext(element);
		}, 500);
	}

	useEffect(() => {
		const inputElement = contextInputRef.current;

		if (!inputElement) {
			return;
		}

		inputElement.value = value ?? "";
	}, [value]);

	useEffect(() => {
		const inputElement = contextInputRef.current;

		if (!inputElement) {
			return;
		}

		inputElement.addEventListener("input", () => {
			autoResize(inputElement);
			handleInput(inputElement);
		});

		return () => {
			inputElement.removeEventListener("input", () => {
				autoResize(inputElement);
				handleInput(inputElement);
			});
		};
	}, []);

	return (
		<div
			className={`${isOpen ? "" : "hidden"} ${isMobile ? "px-2 pt-2 pb-2" : "px-3 pt-4 pb-3"} border-b dark:border-white/8 border-gray-300`}
		>
			<div className="mb-2 flex items-center justify-between">
				<label
					htmlFor="contextInput"
					className="text-sm font-medium text-gray-600 dark:text-white/70"
				>
					{t("searchbar.toolContextLabel")}
				</label>
				<div className="flex flex-row">
					<ClearButton onClick={clearContext} disabled={value === undefined} />
					<CloseButton size="small" onClick={() => setIsOpen(false)} />
				</div>
			</div>
			<textarea
				ref={contextInputRef}
				rows={2}
				placeholder={t("searchbar.toolContextPlaceholder")}
				onFocus={() => onFocus()}
				className="max-h-40 w-full px-3 py-2 resize-none rounded-xl text-sm text-gray-700 dark:text-white/85 bg-surface dark:bg-black/30 placeholder-gray-400 dark:placeholder-white/25 outline-none"
			></textarea>
		</div>
	);
}
