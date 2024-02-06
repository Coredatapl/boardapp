import { Dispatch, SetStateAction, createContext } from 'react';

export enum ModalTypeEnum {
  confirm = 'confirm',
  prompt = 'prompt',
}

export interface ModalStateData {
  type: ModalTypeEnum;
  prompt: string;
  showModal: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const defaultModalState = {
  type: ModalTypeEnum.prompt,
  prompt: '',
  showModal: false,
  onConfirm: () => {},
};

export const ModalStateContext = createContext({
  modalState: {} as ModalStateData,
  setModalState: {} as Dispatch<SetStateAction<ModalStateData>>,
});
