import { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import { useModal } from "@/components/ui/modal/hooks/useModal";
import { useLogger } from "@/hooks/useLogger";
import type { ApiResponse, ApiSessionExpiredResponse } from "@/types/api";
import AccountModal from "./AccountModal";
import AuthModal from "./AuthModal";

export default function Account() {
  const { isExtension, account, setAccount, registerMessageCallback } =
    useAppContext();
  const modal = useModal();
  const logger = useLogger("Auth");

  function openModal() {
    if (!account) {
      modal.open(<AuthModal />);
    } else {
      modal.open(<AccountModal />);
    }
  }

  function onAuthenticate(response: ApiResponse) {
    if (!response.success) {
      logger.log("Authenticate action failed", { result: response.result });
      return;
    }
    setAccount(response.result);
  }

  function onSessionExpired(response: ApiSessionExpiredResponse) {
    setAccount(undefined);
    modal.close();
    logger.log(`User logged out (Reason: ${response.reason}).`, "successfully");
  }

  useEffect(() => {
    if (!isExtension) return;
    registerMessageCallback("login_result", onAuthenticate);
    registerMessageCallback("session_expired", onSessionExpired);
  }, []);

  return (
    <button
      type="button"
      onClick={openModal}
      className="relative p-0.5 rounded-full cursor-pointer dark:hover:bg-white/10 hover:bg-black/8 dark:ring-surface-dark-element hover:ring-2 focus:outline-none focus:ring-accent transition-all active:scale-95"
    >
      <svg
        className="w-8 h-8 text-gray-400 dark:text-gray-300 hover:text-accent bg-gray-200 dark:bg-gray-800 rounded-full p-1 border border-gray-300 dark:border-gray-700"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Avatar</title>
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span
        className={`absolute top-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 dark:ring-surface-dark ring-gray-100 ${account ? "bg-green" : "bg-red-500"}`}
      ></span>
    </button>
  );
}
