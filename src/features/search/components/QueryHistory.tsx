import type { Dispatch, SetStateAction } from "react";
import CloseButton from "@/components/ui/CloseButton";
import { useTranslate } from "@/hooks/useTranslate";
import type { SearchQuery } from "../types/searchQuery";
import ClearButton from "./ClearButton";

interface QueryHistoryProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	queries: SearchQuery[];
	restore: (query: SearchQuery) => void;
	clear: () => void;
}

export default function QueryHistory({
	isOpen,
	setIsOpen,
	queries,
	restore,
	clear,
}: QueryHistoryProps) {
	const { t } = useTranslate();

	return (
		<div
			className={`${isOpen ? "" : "hidden"} mb-3 pt-2 border-t dark:border-white/8 border-gray-300 dark:bg-surface-dark bg-white`}
		>
			<div className="flex items-center justify-between px-3 pt-1 pb-2">
				<h2 className="text-sm font-medium text-gray-600 dark:text-white/70">
					{t("searchbar.toolHistoryLabel")}
				</h2>
				<div className="flex flex-row">
					<ClearButton onClick={clear} disabled={queries.length === 0} />
					<CloseButton size="small" onClick={() => setIsOpen(false)} />
				</div>
			</div>
			<ul id="historyList" className="max-h-56 overflow-y-auto">
				{queries.length <= 0 && (
					<li className="px-3 py-1 text-sm text-gray-400">
						{t("searchbar.toolHistoryNoDota")}
					</li>
				)}
				{queries.length > 0 &&
					queries.map((query) => (
						<li key={query.id} className="px-3 py-1">
							<button
								type="button"
								title="Restore query"
								onClick={() => restore(query)}
								className="flex w-full items-center justify-between gap-2 px-2 py-2 rounded-xl cursor-pointer text-left text-sm text-gray-700 hover:bg-surface dark:hover:bg-black/30 focus:outline-none focus-visible:bg-gray-100"
							>
								<span className="truncate">{query.value}</span>
								<span className="shrink-0 text-xs uppercase text-gray-400">
									{query.mode}
								</span>
							</button>
						</li>
					))}
			</ul>
		</div>
	);
}
