import { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import { useModal } from "@/components/ui/modal/hooks/useModal";
import Modal from "@/components/ui/modal/Modal";
import ModalBody from "@/components/ui/modal/ModalBody";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLogger } from "@/hooks/useLogger";
import { useTranslate } from "@/hooks/useTranslate";
import { logout } from "@/utils/api";
import { capitalise } from "@/utils/common";

export default function AccountModal() {
  const { account, setAccount } = useAppContext();
  const modal = useModal();
  const logger = useLogger("Auth");
  const { t } = useTranslate();

  function logoutAction() {
    setAccount(undefined);
    logout("user_action");
    modal.close();
  }

  useEffect(() => {
    if (!account) {
      logger.log("User account undefined");
      modal.close();
    }
  }, [account]);

  if (!account) return;

  return (
    <Modal>
      <ModalHeader title={t("auth.accountModal.header")} />
      <ModalBody>
        <div id="view-profile" className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="p-1 rounded-full bg-linear-to-tr from-accent to-fuchsia-700">
              <svg
                className="w-20 h-20 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-full p-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Avatar</title>
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3
            className="text-xl font-semibold text-gray-900 dark:text-white"
            id="user-name"
          >
            {capitalise(account.username)}
          </h3>
          <p
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            id="user-email"
          >
            {account.email}
          </p>
          <p className="mt-6 text-sm">
            Associated with a{" "}
            <a
              href="https://coredata.pl"
              target="_blank"
              rel="noopener"
              className="font-semibold"
            >
              Coredata Services Server
            </a>{" "}
            account{account.createdAt.length ? ` on ${account.createdAt}` : ""}.
          </p>

          <div className="mt-6">
            <PrimaryButton
              label={t("auth.accountModal.logoutLabel")}
              disabled={!account}
              important={true}
              fullWidth={true}
              onClick={logoutAction}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
