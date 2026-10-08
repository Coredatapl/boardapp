import type { ButtonProps } from "@/components/ui/Button";

export default function SendButton({ label, onClick, disabled }: ButtonProps) {
	function sendHandler() {
		if (onClick) {
			onClick();
		}
	}

	return (
		<button
			id="sendBtn"
			type="button"
			aria-label={label}
			className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer transition-colors bg-accent text-white hover:bg-indigo-400 hover:shadow-indigo-500/20 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
			disabled={disabled ?? true}
			onClick={sendHandler}
		>
			<svg
				className="h-3.5 w-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Send</title>
				<path d="M22 2L11 13" />
				<path d="M22 2l-7 20-4-9-9-4 20-7z" />
			</svg>
		</button>
	);
}
