interface LinkButtonProps {
	label: string;
	onClick: () => void;
}

export default function LinkButton({ label, onClick }: LinkButtonProps) {
	return (
		<button
			type="button"
			title="Notifications"
			onClick={onClick}
			className="dark:text-white/50 text-gray-500 hover:text-accent cursor-pointer outline-none transition-colors"
		>
			{label}
		</button>
	);
}
