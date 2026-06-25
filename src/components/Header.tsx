import type { PropsWithChildren } from "react";
import { useAppContext } from "@/app/AppContext";
import BrandLogo from "./ui/BrandLogo";
import IconButton from "./ui/IconButton";
import { usePanel } from "./ui/panel/hooks/usePanel";

export default function Header({ children }: PropsWithChildren) {
	const { isMobile, undoneTodos, unreadNotidications } = useAppContext();
	const { openPanel } = usePanel();

	return (
		<header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 animate-fade-in">
			{!isMobile && (
				<div className="flex items-center gap-2">
					<BrandLogo />
				</div>
			)}

			<div className="flex items-center gap-2">{children}</div>

			<div className="flex items-center gap-2">
				<IconButton onClick={() => openPanel("notifications")}>
					<svg
						className="w-5 h-5 dark:text-white/60 text-gray-500 group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<title>Notifications</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
					{unreadNotidications && (
						<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green rounded-full ring-2 dark:ring-surface-dark ring-gray-100"></span>
					)}
				</IconButton>

				<IconButton onClick={() => openPanel("todo")}>
					<svg
						className="w-5 h-5 dark:text-white/60 text-gray-500 group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<title>Todo</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{undoneTodos && (
						<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green rounded-full ring-2 dark:ring-surface-dark ring-gray-100"></span>
					)}
				</IconButton>

				<IconButton onClick={() => openPanel("settings")}>
					<svg
						className="w-5 h-5 dark:text-white/60 text-gray-500 group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<title>Settings</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</IconButton>
			</div>
		</header>
	);
}
