"use client";

import { useState } from 'react';
import Header from '@/components/shared/Header';
import MonthSelector from '@/components/shared/MonthSelector';
import Balance from '@/components/features/Balance';
import TransactionList from '@/components/features/TransactionList';
import Modal from '@/components/ui/Modal';
import Slideover from '@/components/ui/Slideover';
import TransactionForm from '@/components/features/TransactionForm';
import OrcamentoModal from '@/components/features/OrcamentoModal';

export default function Home() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isOrcamentoModalOpen, setIsOrcamentoModalOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDataChange = () => {
    setIsTransactionModalOpen(false);
    // We don't close the orcamento modal here, it has its own close button
    setKey(prevKey => prevKey + 1);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <Header />
      <MonthSelector currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <div className="p-4">
        <Balance key={key} currentDate={currentDate} onOpenOrcamento={() => setIsOrcamentoModalOpen(true)} />
        <TransactionList
          key={key + 1}
          currentDate={currentDate}
          onTransactionDelete={handleDataChange}
        />
      </div>
      <button
        onClick={() => setIsTransactionModalOpen(true)}
        className="fixed bottom-8 right-8 bg-magenta text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)}>
        <TransactionForm
          currentDate={currentDate}
          onSuccess={handleDataChange}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      </Modal>
      <Slideover isOpen={isOrcamentoModalOpen} onClose={() => setIsOrcamentoModalOpen(false)}>
        <OrcamentoModal 
          onClose={() => setIsOrcamentoModalOpen(false)} 
          onSuccess={handleDataChange} 
          currentDate={currentDate} 
        />
      </Slideover>
    </main>
  );
}