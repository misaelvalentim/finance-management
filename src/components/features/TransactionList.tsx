"use client";

import { useTransactions } from '@/hooks/useTransactions';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  currentDate: Date;
  onTransactionDelete: () => void; // This will now just trigger a re-render of parent components
}

const TransactionList = ({ currentDate, onTransactionDelete }: TransactionListProps) => {
  const { transactions, loading, deleteTransaction } = useTransactions(currentDate);

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    onTransactionDelete(); // Notify parent to re-render other components like Balance
  };

  if (loading) {
    return <p>Atualizando transacções...</p>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase">Lançamentos</h2>
        <span className="bg-gray-300 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {transactions.length}
        </span>
      </div>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={() => handleDelete(transaction.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
