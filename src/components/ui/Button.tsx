export interface ButtonProps {
	label?: string;
	icon?: string;
	onClick?: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
	return (
		<button
			className="px-4 py-2 rounded-xl text-sm dark:text-white/50 text-gray-500 cursor-pointer dark:hover:bg-white/8 hover:bg-surface-hover transition-colors"
			type="button"
			onClick={onClick}
		>
			{label}
		</button>
	);
}
