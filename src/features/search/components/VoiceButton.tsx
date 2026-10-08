import type { ButtonProps } from "@/components/ui/Button";
import { useTranslate } from "@/hooks/useTranslate";

interface VoiceButtonProps {
  isListening: boolean;
}

export default function VoiceButton({
  label,
  onClick,
  disabled,
  isListening,
}: ButtonProps & VoiceButtonProps) {
  const { t } = useTranslate();

  function sendHandler() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      id="voiceBtn"
      type="button"
      aria-label={label}
      aria-pressed="false"
      disabled={disabled ?? true}
      onClick={sendHandler}
      title={t("searchbar.voiceModeDescription")}
      className={`flex h-8 w-8 items-center justify-center rounded-full cursor-pointer ${isListening ? "bg-red-500 hover:bg-red-700" : "dark:bg-surface-dark-container bg-surface-container dark:hover:bg-surface-dark-hover hover:bg-surface-hover"} dark:text-white/30 text-slate-500 hover:text-accent border dark:border-surface-dark border-surface-element transition focus:outline-none`}
    >
      <svg
        className={`h-3.5 w-3.5 ${isListening ? "text-white" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Voice</title>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
      </svg>
    </button>
  );
}
