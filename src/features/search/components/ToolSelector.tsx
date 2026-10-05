import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useAppContext } from "@/app/AppContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslate } from "@/hooks/useTranslate";
import type { SearchTool } from "../types/searchTool";

interface ToolSelectorProps {
  setContextOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ToolSelector({ setContextOpen }: ToolSelectorProps) {
  const { isMobile } = useAppContext();
  const { t } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const tools: SearchTool[] = [
    {
      name: "context",
      label: t("searchbar.toolContextLabel"),
      openAction: () => setContextOpen(true),
    },
    {
      name: "history",
      label: t("searchbar.toolHistoryLabel"),
      openAction: () => {},
    },
  ];

  function handleToolOpen(tool: SearchTool) {
    tool.openAction();
    toggleOpen(false);
  }

  function toggleOpen(forcedOpenState?: boolean) {
    const open = forcedOpenState !== undefined ? forcedOpenState : !isOpen;
    setIsOpen(open);
  }

  useClickOutside([containerRef], () => {
    toggleOpen(false);
  });

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => toggleOpen()}
        aria-haspopup="true"
        aria-expanded="false"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus:outline-none"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Tools</title>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.2-.5-.5-2.2 2.2-2.8z" />
        </svg>
        {!isMobile ? t("searchbar.toolsLabel") : ""}
      </button>
      <ul
        className={`${isOpen ? "" : "hidden"} absolute left-0 z-20 w-36 mt-2 mb-2 p-1.5 rounded-xl border border-slate-200 bg-white shadow-lg`}
      >
        {tools.map((tool) => (
          <li key={tool.name}>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleToolOpen(tool)}
              data-tool={tool.name}
              className="w-full px-3 py-2 rounded-lg text-left text-sm cursor-pointer text-gray-400 dark:hover:text-white hover:text-gray-500 dark:hover:bg-neutral-700/80 hover:bg-surface-hover"
            >
              {tool.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
