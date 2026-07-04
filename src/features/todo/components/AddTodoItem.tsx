import { useRef, useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { capitalise } from "@/utils/common";
import {
	getStringSchema,
	TodoLabelMaxLength,
	TodoLabelMinLength,
	validate,
} from "@/utils/validation";
import type { TodoItem } from "../types/todoItem";
import AddButton from "./AddButton";

interface AddTodoItemProps {
	addItem(item: TodoItem): void;
}

export default function AddTodoItem({ addItem }: AddTodoItemProps) {
	const { t } = useTranslate();
	const [label, setLabel] = useState<string | null | undefined>(undefined);
	const labelInputRef = useRef<HTMLInputElement>(null);
	const labelMinLength = TodoLabelMinLength ?? 2;
	const labelMaxLength = TodoLabelMaxLength ?? 100;
	let updateLabelTimer: number | undefined;

	function validateLabel(value: string): string | null {
		const errors = validate(
			value,
			getStringSchema(labelMinLength, labelMaxLength),
		);
		return errors ? null : value;
	}

	function updateLabel(): string | null {
		if (!labelInputRef.current) return null;
		const inputValue = labelInputRef.current.value.trim();
		const validLabel = validateLabel(inputValue);

		setLabel(validLabel ? capitalise(validLabel) : null);

		return validLabel;
	}

	function resetLabel() {
		setLabel("");
		if (labelInputRef.current) {
			labelInputRef.current.value = "";
		}
	}

	function labelInputHandler() {
		clearTimeout(updateLabelTimer);
		updateLabelTimer = setTimeout(() => updateLabel(), 500);
	}

	function addHandler() {
		if (!label) return;

		const newItem: TodoItem = {
			id: `todo_${Date.now()}`,
			label,
			done: false,
			created: Date.now(),
		};

		addItem(newItem);
		resetLabel();
	}

	return (
		<div className="p-4 border-t dark:border-surface-dark-element border-surface-element">
			<div className="flex gap-2">
				<input
					ref={labelInputRef}
					type="text"
					placeholder={t("todo.addPlaceholder")}
					minLength={labelMinLength}
					maxLength={labelMaxLength}
					onInput={labelInputHandler}
					className={`flex-1 px-3 py-2 rounded-xl text-sm dark:bg-surface-dark bg-surface dark:text-white/80 text-gray-700 dark:placeholder-white/25 placeholder-gray-400 outline-none border ${label === null ? "border-rose-400" : "dark:border-surface-dark-element border-surface-element"} focus:border-accent transition-colors`}
				/>
				<AddButton onClick={addHandler} />
			</div>
		</div>
	);
}
