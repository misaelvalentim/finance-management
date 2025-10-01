"use client";

import TransactionItem from './TransactionItem';
import { Lancamento } from '@/types';

interface TransactionListProps {
  transactions: Lancamento[];
  onDelete: (id: number) => void;
}

const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  return (
    <div className="space-y-2 mt-4">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={() => onDelete(transaction.id)}
        />
      ))}
    </div>
  );
};

export default TransactionList;
