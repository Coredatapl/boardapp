import { FormEvent } from 'react';
import Button from '../../common/Button';

interface AddShortcutModalProps {
  id: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  addShortcut: (url: string, name?: string) => void;
}

export default function AddShortcutModal({
  id,
  showModal,
  setShowModal,
  addShortcut,
}: AddShortcutModalProps) {
  function submitShortcut(e: FormEvent) {
    e.preventDefault();
    const inputUrl = document.getElementById(
      `${id}UrlInput`
    ) as HTMLInputElement;
    const inputName = document.getElementById(
      `${id}NameInput`
    ) as HTMLInputElement;

    if (!inputUrl.value.length) {
      inputUrl.ariaInvalid = 'true';
      return;
    }

    addShortcut(inputUrl.value, inputName.value);
    inputUrl.value = '';
    inputName.value = '';
  }

  function hideModal() {
    setShowModal(false);
  }

  if (!showModal) {
    return <></>;
  }

  return (
    <>
      <div
        id={id}
        className="absolute z-40 w-full h-full mx-auto p-4 inset-0 overflow-x-hidden overflow-y-auto flex justify-center items-center bg-gray-600 bg-opacity-50"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <div className="relative bg-white/70 rounded-lg shadow-lg backdrop-blur-sm">
            <button
              type="button"
              className="absolute top-3 right-2.5 p-1.5 ml-auto rounded-md inline-flex items-center text-sm text-gray-900 bg-transparent hover:bg-white/80 hover:text-gray-900"
              onClick={hideModal}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5 transition-all transform ease-in-out hover:rotate-180"
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

            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                Add new Shortcut
              </h3>
              <form className="space-y-6" action="#" onSubmit={submitShortcut}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Url
                  </label>
                  <input
                    id={`${id}UrlInput`}
                    type="url"
                    name="url"
                    className="block w-full p-2.5 text-sm text-gray-900 rounded-md outline-none border bg-gray-50 border-slate-300 invalid:border-red-600 invalid:text-red-600"
                    placeholder="https://company.com"
                    minLength={3}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <input
                    id={`${id}NameInput`}
                    type="text"
                    name="name"
                    placeholder="Name of the shortcut"
                    className="block w-full p-2.5 text-sm text-gray-900 rounded-md outline-none border border-slate-300 bg-gray-50 invalid:border-red-600 invalid:text-red-600"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    title="Add Shortcut"
                    style="text-white bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-700"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
