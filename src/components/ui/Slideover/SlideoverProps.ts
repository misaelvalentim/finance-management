import { ReactNode } from 'react';

export interface SlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
