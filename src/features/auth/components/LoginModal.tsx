import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import imgCoredataIcon from "@/assets/img/coredata-icon-90.png";
import Input from "@/components/ui/form/Input";
import { useModal } from "@/components/ui/modal/hooks/useModal";
import Modal from "@/components/ui/modal/Modal";
import ModalBody from "@/components/ui/modal/ModalBody";
import ModalFooter from "@/components/ui/modal/ModalFooter";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import Spinner from "@/components/ui/Spinner";
import { useLogger } from "@/hooks/useLogger";
import { useTranslate } from "@/hooks/useTranslate";
import type { ApiResponse } from "@/types/api";
import { apiLogin } from "@/utils/api";
import {
  AuthEmailMinLength,
  getEmailSchema,
  getPasswordSchema,
  validate,
} from "@/utils/validation";
import {
  AuthPasswordMaxLength,
  AuthPasswordMinLength,
} from "../../../utils/validation";

export default function LoginModal() {
  const { isExtension, settings, registerMessageCallback } = useAppContext();
  const modal = useModal();
  const logger = useLogger("Auth");
  const { t } = useTranslate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [emailInputError, setEmailInputError] = useState<
    string | null | undefined
  >(undefined);
  const [password, setPassword] = useState<string | null | undefined>(
    undefined,
  );
  const [passwordInputError, setPasswordInputError] = useState<
    string | null | undefined
  >(undefined);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailMinLength = AuthEmailMinLength ?? 3;
  const passwordMinLength = AuthPasswordMinLength ?? 8;
  const passwordMaxLength = AuthPasswordMaxLength ?? 32;
  let updateEmailTimer: number | undefined;
  let updatePasswordTimer: number | undefined;

  function validateEmail(value: string): string | null {
    if (!value.length) return null;
    const errors = validate(value, getEmailSchema(emailMinLength));

    if (errors?.length) {
      setEmailInputError(errors[0]);
      return null;
    }
    return value;
  }

  function validatePassword(value: string): string | null {
    if (!value.length) return null;
    const errors = validate(
      value,
      getPasswordSchema(passwordMinLength, passwordMaxLength),
    );

    if (errors?.length) {
      setPasswordInputError(errors[0]);
      return null;
    }
    return value;
  }

  function updateEmail(inputValue: string): string | null {
    const validEmail = validateEmail(inputValue);
    setEmail(validEmail);
    return validEmail;
  }

  function emailInputHandler(event: ChangeEvent<HTMLInputElement>) {
    clearTimeout(updateEmailTimer);
    const value = event.target.value.trim();
    updateEmailTimer = setTimeout(() => updateEmail(value), 500);
  }

  function updatePassword(inputValue: string): string | null {
    const validName = validatePassword(inputValue);
    setPassword(validName);
    return validName;
  }

  function passwordInputHandler(event: ChangeEvent<HTMLInputElement>) {
    clearTimeout(updatePasswordTimer);
    const value = event.target.value.trim();
    updatePasswordTimer = setTimeout(() => updatePassword(value), 500);
  }

  async function loginAction() {
    if (!email || !password) {
      return;
    }

    setProcessing(true);

    try {
      await apiLogin(email, password);
    } catch (error: any) {
      setProcessing(false);
      onFailure(error.message);
    }
  }

  function onResponse(response: ApiResponse) {
    setProcessing(false);
    if (!response.success) {
      onFailure(response.result);
      return;
    }
    onSuccess();
  }

  function onFailure(reason: any) {
    const message = reason.status
      ? reason.status
      : reason
        ? reason
        : "Authentication failed";
    setError(message);
    logger.log(`Authentication failed. ${reason.status}`, { reason });
  }

  function onSuccess() {
    setError(null);
    logger.log("Authentication", "successfull");
    modal.close();
  }

  useEffect(() => {
    if (!isExtension) return;

    const emailInput = emailInputRef.current;

    if (emailInput) {
      setTimeout(() => emailInput.focus(), 200);
    }

    registerMessageCallback("authenticate_result", onResponse);
  }, []);

  return (
    <Modal>
      <ModalHeader title={t("auth.loginModal.header")} />
      <ModalBody>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl dark:bg-surface-dark bg-surface border dark:border-surface-dark-element border-surface-element flex items-center justify-center text-2xl shrink-0 overflow-hidden transition-all duration-200">
            <img
              src={imgCoredataIcon}
              alt="Favicon"
              className="w-10 h-10 object-contain rounded-lg"
            ></img>
          </div>
          <div>
            <p className="mb-2 text-md font-semibold text-accent">
              {t("auth.loginModal.title")}
            </p>
            <p className="mt-0.5 text-sm dark:text-white/35 text-gray-400">
              {t("auth.loginModal.description.part1")}
            </p>
            <p className="mt-0.5 text-sm dark:text-white/35 text-gray-400">
              {t("auth.loginModal.description.part2")}
              <a
                href="mailto:settings.contactEmail"
                className="dark:text-white/50 text-gray-500"
              >
                {settings.contactEmail}
              </a>
              . {t("auth.loginModal.description.part3")}{" "}
              <a
                href="https://coredata.pl/privacy"
                target="_blank"
                rel="noopener"
                className="dark:text-white/50 text-gray-500"
              >
                {t("auth.loginModal.description.policy")}
              </a>
              .
            </p>
          </div>
        </div>

        {processing && (
          <div className="flex min-w-10 justify-center items-center gap-4">
            <Spinner />
            <div className="mt-1">
              <p className="text-md font-medium dark:text-white text-gray-800">
                {t("auth.loginModal.processing")}
              </p>
            </div>
          </div>
        )}

        {!processing && error && (
          <div className="flex min-w-10 justify-center items-center gap-4">
            <div className="text-rose-400 text-center">
              <p className="text-md font-medium">
                {t("auth.loginModal.error")}
              </p>
              <p className="text-md font-medium">{error}</p>
            </div>
          </div>
        )}

        {!processing && !error && (
          <>
            <Input
              ref={emailInputRef}
              id="userEmail"
              type="email"
              label="Email"
              placeholder="User email address"
              minLength={emailMinLength}
              invalid={email === null}
              error={emailInputError ?? undefined}
              onChange={emailInputHandler}
            />
            <Input
              ref={passwordInputRef}
              id="userPassword"
              type="password"
              label={t("auth.loginModal.passwordLabel")}
              placeholder="User password"
              minLength={passwordMinLength}
              maxLength={passwordMaxLength}
              invalid={password === null}
              error={passwordInputError ?? undefined}
              hint={`${passwordMinLength}-${passwordMaxLength} long, min 1 uppercase, min 1 lowercase, min 1 digit, min 1 special character`}
              onChange={passwordInputHandler}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter
        confirmLabel={t("auth.loginModal.loginLabel")}
        cancelLabel={t("common.cancelLabel")}
        confirmDisabled={!email || !password || processing || error !== null}
        onConfirm={loginAction}
      />
    </Modal>
  );
}
