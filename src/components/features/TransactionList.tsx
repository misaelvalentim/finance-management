"use client";

import TransactionItem from './TransactionItem';
import { Lancamento } from '@/types';
import { formatFriendlyDate } from '@/utils/date';

interface TransactionListProps {
  transactions: Lancamento[];
  onDelete: (id: number) => void;
}

const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.data.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Lancamento[]>);

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(groupedTransactions).map(([date, transactionsOnDate]) => (
        <div key={date}>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
            {formatFriendlyDate(date)}
          </h3>
          <div className="space-y-2">
            {transactionsOnDate.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={() => onDelete(transaction.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
