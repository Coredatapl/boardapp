import Button from './Button';
import { useModal } from '../../utils/useModal';
import { ModalTypeEnum } from '../../utils/ModalContext';

export default function Modal() {
  const { modalState, setModalState } = useModal();
  const { type, prompt, showModal, onConfirm, onCancel, onRender } = modalState;

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

  function renderHeader() {
    let message = '';
    switch (type) {
      case ModalTypeEnum.confirm:
        message = 'Confirm Action';
        break;
      case ModalTypeEnum.addShortcut:
        message = 'Add new Shortcut';
        break;
      default:
        message = 'Hey!';
    }
    return (
      <h3 className="mb-4 text-xl font-medium text-gray-900">{message}</h3>
    );
  }

  if (!showModal) {
    return <></>;
  }

  return (
    <div className="absolute z-50 w-full h-full mx-auto p-4 inset-0 overflow-x-hidden overflow-y-auto flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="relative w-full h-full max-w-md md:h-auto">
        <div
          className={`${
            !showModal
              ? 'opacity-0 animate-slideup'
              : 'opacity-100 animate-slidedown'
          } bg-white/70 rounded-lg shadow-lg backdrop-blur-sm transition-opacity duration-100 ease-in`}
        >
          <div className="px-6 py-6 lg:px-8">
            {renderHeader()}
            <button
              type="button"
              className="absolute top-6 right-6 p-1 ml-auto rounded-md inline-flex items-center text-sm text-gray-500 bg-transparent hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 transition-all transform ease-in-out hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
            {type === ModalTypeEnum.confirm && (
              <form className="space-y-6" action="#">
                <div className="mb-2 text-sm font-medium text-gray-900">
                  {prompt}
                </div>
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
              </form>
            )}
            {type === ModalTypeEnum.prompt && (
              <form className="space-y-6" action="#">
                <div className="mb-2 text-sm font-medium text-gray-900">
                  {prompt}
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    title="Ok"
                    onClick={() => setShowModal(false)}
                    style="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-700"
                  />
                </div>
              </form>
            )}
            {type === ModalTypeEnum.addShortcut && onRender && onRender()}
          </div>
        </div>
      </div>
    </div>
  );
}
