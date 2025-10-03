import { useState, useEffect } from 'react';
import { getMonthYear, fromYYYYMMDD } from '@/utils/date';
import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';
import { Orcamento } from '@/components/features/OrcamentoModal/OrcamentoModalProps';

interface UseBalanceProps {
  currentDate: Date;
  transactions: Lancamento[];
  orcamentos: Orcamento[];
}

export function useBalance({ currentDate, transactions, orcamentos }: UseBalanceProps) {
  const [limit, setLimit] = useState(0);
  const [used, setUsed] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const { month: currentMonth, year: currentYear } = getMonthYear(currentDate);

    const totalLimit = orcamentos
      .filter(o => {
        const orcamentoDate = fromYYYYMMDD(o.mes);
        const { month: orcamentoMonth, year: orcamentoYear } = getMonthYear(orcamentoDate);
        return orcamentoMonth === currentMonth && orcamentoYear === currentYear;
      })
      .reduce((acc, cur) => acc + cur.limite, 0);
    setLimit(totalLimit);

    const totalUsed = transactions
      .filter((t) => t.tipo === 'expense')
      .reduce((acc, cur) => acc + cur.valor, 0);
    setUsed(totalUsed);

    const totalIncome = transactions
      .filter((t) => t.tipo === 'income')
      .reduce((acc, cur) => acc + cur.valor, 0);
    setIncome(totalIncome);

  }, [transactions, orcamentos, currentDate]);

  const available = limit - used;
  const progress = limit > 0 ? (used / limit) * 100 : 0;

  return { available, progress, used, limit, income };
}