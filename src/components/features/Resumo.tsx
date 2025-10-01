"use client";

import { formatBRL } from '@/utils/currency';
import { Lancamento } from '@/types';

interface ResumoProps {
  transactions: Lancamento[];
}

const Resumo = ({ transactions }: ResumoProps) => {
  const summary = transactions.reduce((acc, transaction) => {
    const category = transaction.categorias?.nome || 'Outro';
    if (!acc[category]) {
      acc[category] = { income: 0, expense: 0 };
    }
    if (transaction.tipo === 'income') {
      acc[category].income += transaction.valor;
    } else {
      acc[category].expense += transaction.valor;
    }
    return acc;
  }, {} as { [key: string]: { income: number; expense: number } });

  return (
    <div className="space-y-2">
      {Object.entries(summary).map(([category, totals]) => (
        <div key={category} className="p-2 rounded-lg bg-gray-50">
            <p className="font-bold text-gray-700">{category}</p>
            {(totals.income > 0) && (<div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Receitas:</span>
                <span className="font-bold text-green">{formatBRL(totals.income)}</span>
            </div>)}
            {(totals.expense > 0) && (<div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Despesas:</span>
                <span className="font-bold text-red">{formatBRL(totals.expense)}</span>
            </div>)}
        </div>
      ))}
    </div>
  );
};

export default Resumo;
