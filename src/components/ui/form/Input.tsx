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
					className={`w-full px-3 py-2 rounded-xl text-sm dark:bg-surface-dark-container bg-surface-container dark:text-white/85 text-gray-700 dark:placeholder-white/25 placeholder-gray-400 outline-none transition-colors border focus:border-accent ${invalid ? "border-rose-400" : "dark:border-surface-dark-element border-surface-element"} ${style}`}
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
			</div>
		</div>
	);
}
