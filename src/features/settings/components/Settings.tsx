import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import FieldDescription from "@/components/ui/form/FieldDescription";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { usePanel } from "@/components/ui/panel/hooks/usePanel";
import Panel from "@/components/ui/panel/Panel";
import PanelBody from "@/components/ui/panel/PanelBody";
import PanelHeader from "@/components/ui/panel/PanelHeader";
import { useLogger } from "@/hooks/useLogger";
import { useStorage } from "@/hooks/useStorage";
import { useTranslate } from "@/hooks/useTranslate";
import type { AppSettings } from "@/types/settings";
import { capitalise, DarkTheme, LightTheme } from "@/utils/common";
import { supportedLanguages } from "@/utils/i18n/translator";
import { OneYearMs } from "@/utils/time";
import {
  DisplayNameMaxLength,
  DisplayNameMinLength,
  getStringSchema,
  validate,
} from "@/utils/validation";
import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";

const appVersion = (await import("../../../../package.json")).version;

export default function Settings() {
  const { settings, setSettings, editMode, setEditMode } = useAppContext();
  const { t } = useTranslate();
  const logger = useLogger("Settings");
  const storage = useStorage();
  const { activePanel, closePanel } = usePanel();
  const [themeLabel, setThemeLabel] = useState(
    t("settings.appearance.mode", { theme: capitalise(settings.theme) }),
  );
  const [themeSubLabel, setThemeSubLabel] = useState(
    t("settings.appearance.themeHint", { theme: settings.theme }),
  );
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState<string | null>(
    settings.displayName,
  );
  const nameMinLength = DisplayNameMinLength ?? 3;
  const nameMaxLength = DisplayNameMaxLength ?? 20;
  let updateNameTimer: number | undefined;

  function applyTheme(dark: boolean, save: boolean) {
    const newTheme = dark ? DarkTheme : LightTheme;
    const newSettings = { ...settings, theme: newTheme } as AppSettings;

    setSettings(newSettings);
    if (save) {
      saveSettings(newSettings);
    }
    document.body.classList.toggle("dark", dark);
  }

  function changeLang(lang: string) {
    const newSettings = { ...settings, lang } as AppSettings;
    setSettings(newSettings);
    saveSettings(newSettings);
    logger.log(`Language changed to ${lang}`, "successfully");
  }

  function validateName(value: string): string | null {
    const errors = validate(
      value,
      getStringSchema(nameMinLength, nameMaxLength),
    );
    return errors ? null : value;
  }

  function updateName() {
    if (!nameInputRef.current) return;
    const inputValue = nameInputRef.current.value.trim();
    const validName = validateName(inputValue);

    setDisplayName(validName);

    if (!validName) return;

    const newSettings = {
      ...settings,
      displayName: validName,
    } as AppSettings;
    setSettings(newSettings);
    saveSettings(newSettings);
  }

  function nameInputHandler() {
    clearTimeout(updateNameTimer);
    updateNameTimer = setTimeout(() => updateName(), 1000);
  }

  function toggleEditMode() {
    const isEditMode = !editMode;

    setEditMode(isEditMode);
    setTimeout(() => closePanel(), 300);
  }

  function langChangeHandler(lang: string) {
    changeLang(lang);
  }

  function saveSettings(settings: AppSettings) {
    storage.set("settings", settings, OneYearMs);
  }

  useEffect(() => {
    setThemeLabel(
      t("settings.appearance.mode", { theme: capitalise(settings.theme) }),
    );
    setThemeSubLabel(
      t("settings.appearance.themeHint", { theme: settings.theme }),
    );
  }, [settings.theme]);

  return (
    <Panel isActive={activePanel === "settings"}>
      <PanelHeader title={t("settings.header")} onClose={closePanel} />
      <PanelBody>
        <div>
          <p className="text-xs font-semibold dark:text-white/35 text-gray-400 uppercase tracking-widest mb-3">
            {t("settings.appearance.header")}
          </p>

          <div className="flex items-center justify-between py-3 px-4 rounded-2xl dark:bg-surface-dark-item bg-surface-item border dark:border-surface-dark-element border-surface-element">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl dark:bg-surface-dark-element bg-surface-element flex items-center justify-center shrink-0">
                <svg
                  className={`w-4 h-4 ${settings.theme === DarkTheme ? "text-accent" : "text-yellow"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Theme</title>
                  {settings.theme === DarkTheme && <MoonIcon />}
                  {settings.theme === LightTheme && <SunIcon />}
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium dark:text-white/85 text-gray-700">
                  {themeLabel}
                </p>
                <p className="text-xs dark:text-white/35 text-gray-400">
                  {themeSubLabel}
                </p>
              </div>
            </div>
            <div
              onClick={() => applyTheme(settings.theme !== DarkTheme, true)}
              role="switch"
              aria-checked={settings.theme === DarkTheme}
              tabIndex={0}
              className={`${settings.theme === DarkTheme ? "bg-green" : "bg-gray-300"} relative w-10 h-5 rounded-full cursor-pointer shrink-0 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2`}
            >
              <div
                className={`${settings.theme === DarkTheme ? "translate-x-4.5" : "translate-x-0"} absolute top-0.5 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)]`}
              ></div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold dark:text-white/35 text-gray-400 uppercase tracking-widest mb-3">
            {t("settings.profile.header")}
          </p>
          <div className="rounded-2xl dark:bg-surface-dark-item bg-surface-item border dark:border-surface-dark-element border-surface-element p-4 space-y-3">
            <div className="">
              <Select
                id="languageSelect"
                label={t("settings.profile.language")}
                options={supportedLanguages.reduce(
                  (options, lang) => {
                    options[lang.long] = lang.code;
                    return options;
                  },
                  {} as Record<string, string>,
                )}
                defaultValue={settings.lang}
                onChange={langChangeHandler}
              />
              <FieldDescription content={t("settings.profile.languageHint")} />
            </div>
            <div>
              <Input
                ref={nameInputRef}
                id="displayName"
                type="text"
                label={t("settings.profile.displayName")}
                value={displayName ?? undefined}
                placeholder={t("settings.profile.displayNamePlaceholder")}
                minLength={nameMinLength}
                maxLength={nameMaxLength}
                invalid={displayName === null}
                onInput={nameInputHandler}
                onChange={(e) => setDisplayName(e.target.value)}
                style="dark:text-white/85 dark:bg-surface-dark-container bg-surface-container"
              />
              <FieldDescription
                content={t("settings.profile.displayNameHint")}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold dark:text-white/35 text-gray-400 uppercase tracking-widest mb-3">
            {t("settings.shortcuts.header")}
          </p>
          <div className="rounded-2xl dark:bg-surface-dark-item bg-surface-item border dark:border-surface-dark-element border-surface-element overflow-hidden">
            <button
              type="button"
              onClick={toggleEditMode}
              className={`${editMode ? "rounded-xl bg-green/13" : ""} w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer dark:hover:bg-surface-dark-hover hover:bg-surface-hover transition-colors group`}
            >
              <div className="w-8 h-8 rounded-xl dark:bg-surface-dark-element bg-surface-element flex items-center justify-center shrink-0">
                <svg
                  className={`${editMode ? "text-green" : ""} w-4 h-4 dark:text-white/60 text-gray-500`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <title>Edit</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium dark:text-white/85 text-gray-700">
                  {t("settings.shortcuts.editLabel")}
                </p>
                <p className="text-xs dark:text-white/35 text-gray-400">
                  {editMode
                    ? t("settings.shortcuts.editingHint")
                    : t("settings.shortcuts.toEditHint")}
                </p>
              </div>
              <div
                className={`${editMode ? "bg-green" : "dark:bg-white/20 bg-gray-300"} w-2 h-2 rounded-full transition-colors`}
              ></div>
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold dark:text-white/35 text-gray-400 uppercase tracking-widest mb-3">
            {t("settings.about.header")}
          </p>
          <div className="rounded-2xl dark:bg-surface-dark-item bg-surface-item border dark:border-surface-dark-element border-surface-element px-4 py-3.5">
            <p className="text-sm dark:text-white/50 text-gray-500">
              Board App
              <span className="ml-1 dark:text-white/25 text-gray-400">
                v{appVersion}
              </span>
            </p>
            <p className="text-xs dark:text-white/25 text-gray-400 mt-0.5">
              {t("settings.about.developed")}{" "}
              <a
                className="font-bold text-gray-700 dark:text-white/85 hover:text-accent"
                href="https://coredata.pl"
                target="_blank"
                rel="noopener"
              >
                Coredata
              </a>
            </p>
          </div>
        </div>
      </PanelBody>
      <div className="p-4 text-center text-sm dark:text-white/25 text-gray-400 mt-0.5">
        {t("settings.saveHint")}
      </div>
    </Panel>
  );
}
