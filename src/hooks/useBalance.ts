import { useState, useEffect } from 'react';
import { useTransactions } from './useTransactions';
import { useOrcamentos } from './useOrcamentos';
import { getMonthYear } from '@/utils/date';

export function useBalance(currentDate: Date) {
  const { transactions, loading: transactionsLoading, revalidate: revalidateTransactions } = useTransactions(currentDate);
  const { orcamentos, loading: orcamentosLoading, revalidate: revalidateOrcamentos } = useOrcamentos();

  const [limit, setLimit] = useState(0);
  const [used, setUsed] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const { month: currentMonth, year: currentYear } = getMonthYear(new Date(currentDate));

    const totalLimit = orcamentos
      .filter(o => {
        const orcamentoDate = new Date(o.mes + 'T00:00:00');
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

  const revalidate = () => {
    revalidateTransactions();
    revalidateOrcamentos();
  }

  const loading = transactionsLoading || orcamentosLoading;
  const available = limit - used;
  const progress = limit > 0 ? (used / limit) * 100 : 0;

  return { loading, available, progress, used, limit, income, revalidate };
}