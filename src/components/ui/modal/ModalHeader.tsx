import CloseButton from "@/components/ui/CloseButton";
import { useModal } from "./hooks/useModal";

interface ModalHeaderProps {
	title: string;
	onClose?: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
	const modal = useModal();

	function close() {
		if (onClose) {
			onClose();
		}
		modal.close();
	}

	return (
		<div className="flex items-center justify-between px-6 pt-6 pb-4 border-b dark:border-surface-dark-element border-surface-element">
			<h2 className="font-display text-xl dark:text-white text-gray-800">
				{title}
			</h2>
			<CloseButton onClick={close} />
		</div>
	);
}
