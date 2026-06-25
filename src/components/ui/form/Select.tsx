import { type ChangeEvent, useState } from "react";

interface SelectProps {
	id: string;
	label: string;
	options: { [key: string]: string };
	defaultValue?: string;
	invalid?: boolean;
	onChange?: (selected: string) => void;
}

export default function Select({
	id,
	label,
	options,
	defaultValue,
	invalid,
	onChange,
}: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(defaultValue ?? "");

	function toggleDropdown(forcedOpenState?: boolean) {
		const open = forcedOpenState !== undefined ? forcedOpenState : !isOpen;
		setIsOpen(open);
	}

	function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
		const value = e.target.value;
		setSelected(value);
		if (onChange) {
			onChange(value);
		}
	}

	function handleBlur() {
		setIsOpen(false);
	}

	return (
		<div>
			<label
				className="block text-xs font-medium dark:text-white/50 text-gray-500 mb-1.5 uppercase tracking-wider"
				htmlFor={id}
			>
				{label}
			</label>

			<div className="relative">
				<select
					id={id}
					name={id}
					value={selected}
					onClick={() => toggleDropdown()}
					onChange={handleSelect}
					onBlur={handleBlur}
					className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium dark:bg-surface-dark-container bg-surface-container dark:text-white/85 text-gray-700 border focus:border-accent ${invalid ? "border-rose-400" : "dark:border-surface-dark-element border-surface-element"} outline-none appearance-none cursor-pointer transition-colors`}
				>
					<option value="">- select option -</option>
					{Object.keys(options).map((label) => {
						const value = options[label];
						return (
							<option key={label} value={value}>
								{label}
							</option>
						);
					})}
				</select>

				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
					<svg
						id="arrowIcon"
						className={`${isOpen ? "rotate-180" : ""} w-3 h-3 transform transition-transform duration-200`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Arrow</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
							d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
			</div>
		</div>
	);
}
