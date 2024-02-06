import Button from './Button';
import { useModal } from '../../utils/useModal';
import { ModalTypeEnum } from '../../utils/ModalContext';

import imgIconClose from '../../assets/img/icons/icon-close.svg';

export default function Modal() {
  const { modalState, setModalState } = useModal();
  const { type, prompt, showModal, onConfirm, onCancel } = modalState;

  function setShowModal(show: boolean) {
    setModalState((state) => ({
      ...state,
      showModal: show,
    }));
  }

  function handleConfirm() {
    onConfirm();
    setShowModal(false);
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
    setShowModal(false);
  }

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="absolute z-50 w-full h-full mx-auto p-4 inset-0 overflow-x-hidden overflow-y-auto flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="relative w-full h-full max-w-md md:h-auto">
        <div className="relative bg-white/70 rounded-lg shadow-lg backdrop-blur-sm">
          <button
            type="button"
            className="absolute top-3 right-2.5 p-1.5 ml-auto rounded-md inline-flex items-center text-sm text-gray-900 bg-transparent hover:bg-white/80 hover:text-gray-900"
            onClick={() => setShowModal(false)}
          >
            <img
              src={imgIconClose}
              alt="X"
              width={20}
              height={20}
              className="transition-all transform ease-in-out hover:rotate-180"
            />
            <span className="sr-only">Close</span>
          </button>

          <div className="px-6 py-6 lg:px-8">
            {type === ModalTypeEnum.confirm && (
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                Confirm Action
              </h3>
            )}
            <form className="space-y-6" action="#">
              <div className="mb-2 text-sm font-medium text-gray-900">
                {prompt}
              </div>
              {type === ModalTypeEnum.confirm && (
                <div className="flex justify-between">
                  <Button
                    type="button"
                    title="Confirm"
                    onClick={handleConfirm}
                    style="text-white bg-green-700 hover:bg-green-600 active:bg-green-600"
                  />
                  <Button
                    type="button"
                    title="Cancel"
                    onClick={handleCancel}
                    style="text-red-500 bg-gray-700 hover:bg-gray-600 active:bg-gray-600"
                  />
                </div>
              )}
              {type === ModalTypeEnum.prompt && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    title="Ok"
                    onClick={() => setShowModal(false)}
                    style="text-white bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-700"
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
