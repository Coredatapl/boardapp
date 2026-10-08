import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { useAppContext } from "@/app/AppContext";
import CloseButton from "@/components/ui/CloseButton";
import { useTranslate } from "@/hooks/useTranslate";
import { autoResize } from "@/utils/common";

interface ContextWindowProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	setValue: Dispatch<SetStateAction<string | undefined>>;
	setFocused: Dispatch<SetStateAction<boolean>>;
}

export default function ContextWindow({
	isOpen,
	setIsOpen,
	setValue,
	setFocused,
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
			className={`${isOpen ? "" : "hidden"} ${isMobile ? "px-2 pt-2 pb-2" : "px-5 pt-4 pb-3"} border-b dark:border-white/8 border-gray-300`}
		>
			<div className="mb-2 flex items-center justify-between">
				<label
					htmlFor="contextInput"
					className="text-sm font-medium text-gray-600 dark:text-white/70"
				>
					{t("searchbar.toolContextLabel")}
				</label>
				<CloseButton size="small" onClick={() => setIsOpen(false)} />
			</div>
			<textarea
				ref={contextInputRef}
				rows={2}
				placeholder={t("searchbar.toolContextPlaceholder")}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				className="max-h-40 w-full px-3 py-2 resize-none rounded-xl text-sm text-gray-700 dark:text-white/85 bg-surface dark:bg-black/30 placeholder-gray-400 dark:placeholder-white/25 outline-none"
			></textarea>
		</div>
	);
}
