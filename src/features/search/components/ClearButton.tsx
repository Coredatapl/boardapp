import type { ButtonProps } from "@/components/ui/Button";
import { useTranslate } from "@/hooks/useTranslate";

export default function ClearButton({ label, onClick, disabled }: ButtonProps) {
	const { t } = useTranslate();

	function handleClick() {
		if (onClick) {
			onClick();
		}
	}

	return (
		<button
			type="button"
			onClick={() => handleClick()}
			disabled={disabled}
			className={`${disabled ? "hidden" : ""} px-2 py-1 rounded-md cursor-pointer text-xs dark:text-white/50 text-gray-400 dark:hover:bg-white/10 hover:bg-black/8 dark:hover:text-white hover:text-gray-500 focus:outline-none`}
		>
			{label ?? t("searchbar.clearButtonLabel")}
		</button>
	);
}
