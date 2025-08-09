import React, { createContext, useState, useCallback, useContext } from 'react';

interface ModalContextType {
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  isSettingsModalOpen: false,
  openSettingsModal: () => {},
  closeSettingsModal: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ isSettingsModalOpen, openSettingsModal, closeSettingsModal }}>
      {children}
    </ModalContext.Provider>
  );
};
