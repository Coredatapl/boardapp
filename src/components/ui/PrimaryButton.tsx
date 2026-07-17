import type { ButtonProps } from "./Button";

interface PrimaryButtonProps {
	disabled?: boolean;
	important?: boolean;
	fullWidth?: boolean;
}

export default function PrimaryButton({
	label,
	disabled,
	important = false,
	fullWidth = false,
	onClick,
}: PrimaryButtonProps & ButtonProps) {
	const defaultStyle =
		"bg-accent hover:bg-indigo-400 hover:shadow-indigo-500/20";
	const importantStyle =
		"bg-red-500/70 hover:bg-red-500 hover:shadow-red-500/20";

	return (
		<button
			className={`${important ? importantStyle : defaultStyle} ${fullWidth ? "w-full" : ""} text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg cursor-pointer active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100`}
			type="button"
			disabled={disabled}
			onClick={onClick}
		>
			{label}
		</button>
	);
}
