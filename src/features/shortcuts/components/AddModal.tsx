import { useEffect, useRef, useState } from "react";
import Input from "@/components/ui/form/Input";
import { useModal } from "@/components/ui/modal/hooks/useModal";
import Modal from "@/components/ui/modal/Modal";
import ModalBody from "@/components/ui/modal/ModalBody";
import ModalFooter from "@/components/ui/modal/ModalFooter";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import { useTranslate } from "@/hooks/useTranslate";
import { capitalise } from "@/utils/common";
import {
	getStringSchema,
	getUrlSchema,
	ShortcutNameMaxLength,
	ShortcutNameMinLength,
	ShortcutUrlMinLength,
	validate,
} from "@/utils/validation";
import type { Shortcut } from "../types/shortcut";
import { getFaviconUrls, tryFetchFavicon } from "../utils/favicon";

interface AddModalProps {
	addShortcut(shortcut: Shortcut): void;
}

export default function AddModal({ addShortcut }: AddModalProps) {
	const modal = useModal();
	const { t } = useTranslate();
	const urlInputRef = useRef<HTMLInputElement>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const [url, setUrl] = useState<string | null | undefined>(undefined);
	const [name, setName] = useState<string | null | undefined>(undefined);
	const [favicon, setFavicon] = useState<string | null>(null);
	const [faviconLoading, setFaviconLoading] = useState(false);
	const fetchFaviconTimeout = 3000;
	const urlMinLength = ShortcutUrlMinLength ?? 3;
	const nameMinLength = ShortcutNameMinLength ?? 1;
	const nameMaxLength = ShortcutNameMaxLength ?? 10;
	let updateUrlTimer: number | undefined;
	let updateNameTimer: number | undefined;
	let fetchFaviconTimer: number | undefined;

	function validateUrl(value: string): string | null {
		if (!value.length) return null;
		if (!/^https?:\/\//i.test(value)) {
			value = `https://${value}`;
		}
		return validate(value, getUrlSchema(urlMinLength));
	}

	function validateName(value: string): string | null {
		return validate(value, getStringSchema(nameMinLength, nameMaxLength));
	}

	function updateUrl(): string | null {
		if (!urlInputRef.current) return null;
		const inputValue = urlInputRef.current.value.trim();
		const validUrl = validateUrl(inputValue);

		setUrl(validUrl);

		if (!validUrl) {
			setFaviconFallback();
		}

		return validUrl;
	}

	function urlInputHandler() {
		clearTimeout(updateUrlTimer);
		updateUrlTimer = setTimeout(() => {
			clearTimeout(fetchFaviconTimer);
			const url = updateUrl();
			if (url) {
				fetchFaviconTimer = setTimeout(
					async () => fetchFavicon(url),
					fetchFaviconTimeout,
				);
			}
		}, 500);
	}

	function updateName(): string | null {
		if (!nameInputRef.current) return null;
		const inputValue = nameInputRef.current.value.trim();
		const validName = validateName(inputValue);

		setName(validName ? capitalise(validName) : null);

		return validName;
	}

	function nameInputHandler() {
		clearTimeout(updateNameTimer);
		updateNameTimer = setTimeout(() => updateName(), 500);
	}

	function saveShortcut() {
		if (!url || !name) {
			return;
		}
		const shortcut: Shortcut = {
			id: `custom_${Date.now()}`,
			name,
			url,
			favicon,
			emoji: "🔗",
			clicks: 0,
			created: Date.now(),
		};

		addShortcut(shortcut);
		modal.close();
	}

	function setFaviconSrc(src: string) {
		setFaviconLoading(false);
		setFavicon(src);
	}

	function setFaviconFallback() {
		setFaviconLoading(false);
		setFavicon(null);
	}

	async function fetchFavicon(url: string) {
		setFaviconLoading(true);

		const faviconUrls = getFaviconUrls(url);

		if (!faviconUrls) {
			setFaviconLoading(false);
			setFaviconFallback();
			return;
		}

		for (const faviconUrl of faviconUrls) {
			const fetchable = await tryFetchFavicon(
				faviconUrl,
				fetchFaviconTimeout,
				setFaviconSrc,
				setFaviconFallback,
			);
			if (fetchable) {
				break;
			}
		}
		setFaviconLoading(false);
	}

	useEffect(() => {
		const urlInput = urlInputRef.current;
		const nameInput = nameInputRef.current;

		if (urlInput) {
			urlInput.addEventListener("input", urlInputHandler);
			setTimeout(() => urlInput.focus(), 200);
		}
		if (nameInput) {
			nameInput.addEventListener("input", nameInputHandler);
		}

		return () => {
			urlInput?.removeEventListener("input", urlInputHandler);
			nameInput?.removeEventListener("input", nameInputHandler);
		};
	}, []);

	return (
		<Modal>
			<ModalHeader title={t("shortcuts.addModal.header")} />
			<ModalBody>
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 rounded-2xl dark:bg-surface-dark bg-surface border dark:border-surface-dark-element border-surface-element flex items-center justify-center text-2xl shrink-0 overflow-hidden transition-all duration-200">
						{faviconLoading && (
							<svg
								className="w-6 h-6 animate-spin dark:text-white/20 text-gray-300"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading ...</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="3"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
								></path>
							</svg>
						)}
						{!faviconLoading && !favicon && (
							<span className="text-3xl select-none">🔗</span>
						)}
						{!faviconLoading && favicon !== null && (
							<img
								src={favicon}
								alt="Favicon"
								className="w-10 h-10 object-contain rounded-lg"
								onError={setFaviconFallback}
							></img>
						)}
					</div>
					<div>
						<p className="text-md font-medium dark:text-white text-gray-800">
							{name ?? t("shortcuts.addModal.shortcutName")}
						</p>
						<p className="max-w-55 mt-0.5 text-sm truncate dark:text-white/35 text-gray-400">
							{url ?? "https://"}
						</p>
					</div>
				</div>

				<Input
					ref={urlInputRef}
					id="shortcutUrl"
					type="url"
					label="URL"
					placeholder="https://example.com"
					minLength={urlMinLength}
					invalid={url === null}
				/>
				<Input
					ref={nameInputRef}
					id="shortcutName"
					type="text"
					label={t("shortcuts.addModal.nameLabel")}
					placeholder="e.g. Netflix"
					maxLength={nameMaxLength}
					invalid={name === null}
				/>
			</ModalBody>
			<ModalFooter
				confirmLabel={t("shortcuts.addModal.actionAdd")}
				cancelLabel={t("common.cancelLabel")}
				confirmDisabled={!url || !name}
				onConfirm={saveShortcut}
			/>
		</Modal>
	);
}
