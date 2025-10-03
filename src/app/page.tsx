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
import Accordion from '@/components/ui/Accordion';
import Resumo from '@/components/features/Resumo';
import { useData } from '@/contexts/DataContext';

export default function Home() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isOrcamentoModalOpen, setIsOrcamentoModalOpen] = useState(false);

  const {
    profile,
    signOut,
    uploadAvatar,
    currentDate,
    setCurrentDate,
    transactions,
    transactionsLoading,
    addTransaction,
    deleteTransaction,
    revalidateTransactions,
    categories,
    categoriesLoading,
    orcamentos,
    orcamentosLoading,
    addOrcamento,
    deleteOrcamento,
    revalidateOrcamentos,
    user
  } = useData();

  const handleDataChange = () => {
    setIsTransactionModalOpen(false);
    revalidateTransactions();
    revalidateOrcamentos();
  };

  const handleDeleteTransaction = async (id: number) => {
    await deleteTransaction(id);
  };

  const loading = transactionsLoading || categoriesLoading || orcamentosLoading;

  return (
    <main className="bg-gray-100 min-h-screen">
      <Header profile={profile} signOut={signOut} uploadAvatar={uploadAvatar} />
      <MonthSelector currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <div className="p-4">
        <Balance 
          currentDate={currentDate} 
          onOpenOrcamento={() => setIsOrcamentoModalOpen(true)}
          transactions={transactions}
          orcamentos={orcamentos}
          loading={loading}
        />
        <Accordion 
          title={
            <div className="flex justify-between w-full gap-2">
              <span>Lançamentos</span>
              <span className="bg-gray-300 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {transactions.length}
              </span>
            </div>
          } 
          defaultOpen={true}
        >
          {loading ? <p>Atualizando transacções...</p> : 
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          }
        </Accordion>
        <Accordion title="Resumo" defaultOpen={false}>
          {loading ? <p>Calculando resumo...</p> : <Resumo transactions={transactions} />}
        </Accordion>
      </div>
      <button
        onClick={() => setIsTransactionModalOpen(true)}
        className="fixed bottom-4 right-4 bg-magenta text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)}>
        <TransactionForm
          onSuccess={handleDataChange}
          onClose={() => setIsTransactionModalOpen(false)}
          categories={categories}
          currentDate={currentDate}
          addTransaction={addTransaction}
          user={user}
        />
      </Modal>
      <Slideover isOpen={isOrcamentoModalOpen} onClose={() => setIsOrcamentoModalOpen(false)}>
        <OrcamentoModal 
          onClose={() => setIsOrcamentoModalOpen(false)} 
          onSuccess={handleDataChange} 
          currentDate={currentDate}
          orcamentos={orcamentos}
          orcamentosLoading={orcamentosLoading}
          addOrcamento={addOrcamento}
          deleteOrcamento={deleteOrcamento}
        />
      </Slideover>
    </main>
  );
}