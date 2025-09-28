import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/date';

export function useBalance(currentDate: Date) {
  const [limit, setLimit] = useState(0);
  const [used, setUsed] = useState(0);
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const { supabase, user, loading: authLoading } = useAuth();
  const isInitialLoad = useRef(true);

  const fetchBalance = useCallback(async () => {
    if (!user) return;

    if (isInitialLoad.current) {
      setLoading(true);
    }

    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const lastDayOfMonth = getLastDayOfMonth(currentDate);

    const { data: orcamentoData, error: orcamentoError } = await supabase
      .from('orcamentos')
      .select('limite')
      .eq('user_id', user.id)
      .gte('mes', firstDayOfMonth)
      .lte('mes', lastDayOfMonth);

    if (orcamentoError) {
      console.error('Error fetching budget:', orcamentoError);
      setLimit(0);
    } else {
      setLimit(orcamentoData && orcamentoData.length > 0 ? orcamentoData[0].limite : 0);
    }

    const { data: lancamentosData, error: lancamentosError } = await supabase
      .from('lancamentos')
      .select('valor, tipo')
      .eq('user_id', user.id)
      .gte('data', firstDayOfMonth)
      .lte('data', lastDayOfMonth);

    if (lancamentosError) {
      console.error('Error fetching transactions:', lancamentosError);
      setUsed(0);
      setIncome(0);
    } else {
      const totalUsed = lancamentosData
        .filter((t) => t.tipo === 'expense')
        .reduce((acc, cur) => acc + cur.valor, 0);
      setUsed(totalUsed);

      const totalIncome = lancamentosData
        .filter((t) => t.tipo === 'income')
        .reduce((acc, cur) => acc + cur.valor, 0);
      setIncome(totalIncome);
    }

    if (isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [currentDate, supabase, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchBalance();
    }
  }, [authLoading, fetchBalance]);

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchBalance();
  }

  const available = limit - used;
  const progress = limit > 0 ? (used / limit) * 100 : 0;

  return { loading, available, progress, used, limit, income, revalidate };
}