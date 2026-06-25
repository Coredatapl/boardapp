import CloseButton from "@/components/ui/CloseButton";

interface PanelHeaderProps {
	title: string;
	onClose?: () => void;
}

export default function PanelHeader({ title, onClose }: PanelHeaderProps) {
	function closeHandler() {
		if (onClose) {
			onClose();
		}
	}

	return (
		<div className="flex items-center justify-between p-5 border-b dark:border-surface-dark-element border-surface-element">
			<h2 className="font-display text-lg dark:text-white text-gray-800">
				{title}
			</h2>
			<CloseButton onClick={closeHandler} />
		</div>
	);
}
