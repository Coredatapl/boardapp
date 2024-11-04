import { FormEvent, useState } from 'react';
import Button from '../../common/Button';

interface AddShortcutFormProps {
  id: string;
  addShortcut: (url: string, name?: string) => void;
}

export default function AddShortcutForm({
  id,
  addShortcut,
}: AddShortcutFormProps) {
  const [urlInvalid, setUrlInvalid] = useState(false);

  function validateUrlInput(input: HTMLInputElement): boolean {
    const nameLength = input.value.length;

    setUrlInvalid(false);
    try {
      if (!nameLength) {
        setUrlInvalid(true);
        return false;
      }
      new URL(input.value);
      return true;
    } catch (e) {
      setUrlInvalid(true);
      return false;
    }
  }

  function submitShortcut(e: FormEvent) {
    e.preventDefault();
    const inputUrl = document.getElementById(
      `${id}UrlInput`
    ) as HTMLInputElement;
    const inputName = document.getElementById(
      `${id}NameInput`
    ) as HTMLInputElement;

    const urlValid = validateUrlInput(inputUrl);

    if (!urlValid) {
      return;
    }

    addShortcut(inputUrl.value, inputName.value);
    inputUrl.value = '';
    inputName.value = '';
  }

  function handleUrlInputChange(input: HTMLInputElement) {
    validateUrlInput(input);
  }

  return (
    <form className="space-y-6" action="#" onSubmit={submitShortcut}>
      <div>
        <label className="flex mb-2 text-sm font-medium text-gray-900 justify-between">
          Url{' '}
          {urlInvalid && (
            <span className="text-red-600">Invalid URL value</span>
          )}
        </label>
        <input
          id={`${id}UrlInput`}
          type="url"
          name="url"
          className={`block w-full p-2.5 text-sm text-gray-900 rounded-md outline-none border bg-gray-50 border-slate-300 ${
            urlInvalid ? 'app-input-invalid' : ''
          }`}
          placeholder="https://company.com"
          minLength={3}
          required
          onChange={(e) => handleUrlInputChange(e.target)}
        />
      </div>
      <div>
        <label className="flex mb-2 text-sm font-medium text-gray-900">
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
          style="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-700"
        />
      </div>
    </form>
  );
}
