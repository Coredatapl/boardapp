import Button from "@/components/ui/Button";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTranslate } from "@/hooks/useTranslate";
import { useModal } from "./hooks/useModal";

interface ModalFooterProps {
	confirmLabel?: string;
	confirmDisabled?: boolean;
	confirmImportant?: boolean;
	onConfirm?: () => void;
	cancelLabel?: string;
}

export default function ModalFooter({
	confirmLabel,
	confirmDisabled = false,
	confirmImportant = false,
	onConfirm,
	cancelLabel,
}: ModalFooterProps) {
	const { t } = useTranslate();
	const modal = useModal();
	confirmLabel = confirmLabel ?? t("common.confirmLabel");
	cancelLabel = cancelLabel ?? t("common.cancelLabel");

	function close() {
		modal.close();
	}

	function confirm() {
		if (onConfirm) {
			onConfirm();
		}
	}

	return (
		<div className="flex items-center justify-end gap-3 px-6 py-4 border-t dark:border-surface-dark-element border-surface-element">
			<Button label={cancelLabel} onClick={close} />
			<PrimaryButton
				label={confirmLabel}
				disabled={confirmDisabled}
				important={confirmImportant}
				onClick={confirm}
			/>
		</div>
	);
}
