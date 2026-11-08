import React, { useCallback, useMemo, useRef, useState } from 'react';
import Toaster from '../components/UI/Toaster';
import { ToastContext } from './toast';
import type { Toast } from './toast';

const TOAST_DURATION = 4500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const close = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => close(id), TOAST_DURATION);
  }, [close]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onClose={close} />
    </ToastContext.Provider>
  );
};
