import { type PropsWithChildren, useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import { useLogger } from "@/hooks/useLogger";

export default function AppView({ children }: PropsWithChildren) {
  const { isExtension, messageCallbacks } = useAppContext();
  const logger = useLogger();

  useEffect(() => {
    if (!isExtension) return;
    chrome.runtime.onMessage.addListener((message) => {
      const callbacks = messageCallbacks.get(message.action);
      if (callbacks) {
        logger.log(`Handling ${message.action} message`, "...");
        for (const callback of callbacks) {
          callback(message);
        }
      } else {
        logger.log(`No handler for ${message.action} message`);
      }
      return false;
    });
  }, [isExtension]);

  return (
    <div
      id="appView"
      className={`relative min-h-screen overflow-x-hidden dark:bg-surface-dark bg-surface transition-colors duration-300`}
    >
      {children}
    </div>
  );
}
