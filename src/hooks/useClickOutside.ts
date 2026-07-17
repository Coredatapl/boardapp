import { type RefObject, useEffect } from "react";

export const useClickOutside = (
	refs: RefObject<HTMLElement | null>[],
	callback: () => void,
) => {
	const handleClick = (event: MouseEvent) => {
		for (const ref of refs) {
			if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
				return;
			}
		}
		callback();
	};

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	});
};
