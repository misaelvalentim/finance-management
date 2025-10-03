"use client";

import { ReactNode, useEffect } from 'react';
import { SlideoverProps } from './SlideoverProps';

const Slideover = ({ isOpen, onClose, children }: SlideoverProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-y-0 right-0 w-full h-full bg-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Slideover;
