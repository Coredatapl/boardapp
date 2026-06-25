import type { ButtonProps } from "@/components/ui/Button";

export default function AddButton({ onClick }: ButtonProps) {
	function addHandler() {
		if (onClick) {
			onClick();
		}
	}

	return (
		<button
			type="button"
			onClick={addHandler}
			className="px-3 py-2 rounded-xl bg-accent hover:bg-indigo-400 hover:shadow-indigo-500/20 cursor-pointer transition-colors"
		>
			<svg
				className="w-4 h-4 text-white"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2.5"
			>
				<title>Add</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 4.5v15m7.5-7.5h-15"
				/>
			</svg>
		</button>
	);
}
