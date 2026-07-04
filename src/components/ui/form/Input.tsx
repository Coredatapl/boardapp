import type { ChangeEvent, HTMLInputTypeAttribute, RefObject } from "react";

interface InputProps {
	ref: RefObject<HTMLInputElement | null>;
	id: string;
	type: HTMLInputTypeAttribute;
	label: string;
	value?: string;
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	invalid?: boolean;
	error?: string;
	hint?: string;
	style?: string;
	onInput?: () => void;
	onChange?: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

export default function Input({
	ref,
	id,
	type,
	label,
	value,
	placeholder,
	minLength,
	maxLength,
	invalid,
	error,
	hint,
	style,
	onInput,
	onChange,
}: InputProps) {
	return (
		<div>
			<label
				className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 uppercase tracking-wider"
				htmlFor={id}
			>
				{label}
			</label>
			<div>
				<input
					className={`w-full px-3 py-2 rounded-xl text-sm dark:bg-surface-dark bg-surface dark:text-white/85 text-gray-700 dark:placeholder-white/25 placeholder-gray-400 outline-none transition-colors border ${invalid ? "border-rose-400 focus:border-rose-400" : "dark:border-surface-dark-element border-surface-element focus:border-accent"} ${style}`}
					ref={ref}
					id={id}
					type={type}
					value={value}
					placeholder={placeholder}
					minLength={minLength}
					maxLength={maxLength}
					onInput={onInput}
					onChange={onChange}
				/>
				{invalid && error && (
					<div className="p-1 text-xs text-rose-400">{error}</div>
				)}
				{!invalid && !error && hint && (
					<div className="p-1 text-xs dark:text-white/35 text-gray-400">
						<span className="text-accent font-semibold">Hint:</span> {hint}
					</div>
				)}
			</div>
		</div>
	);
}
