import { useContext } from 'react';
import { ModalStateContext } from './ModalContext';

export const useModal = () => {
  const context = useContext(ModalStateContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalStateContext');
  }
  return context;
};
