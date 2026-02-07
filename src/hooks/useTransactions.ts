import { useMemo, useEffect } from 'react';
import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/date';
import { useSupabaseData } from './useSupabaseData';

interface UseTransactionsProps {
  currentDate: Date;
  user: User | null;
  supabase: SupabaseClient;
  familyMemberIds: string[];
  authLoading: boolean;
}

export function useTransactions({ currentDate, user, supabase, familyMemberIds, authLoading }: UseTransactionsProps) {
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const lastDayOfMonth = getLastDayOfMonth(currentDate);

  const query = useMemo(() => {
    if (!user || familyMemberIds.length === 0 || authLoading) {
      return null;
    }
    return supabase
      .from('lancamentos')
      .select(
        `
        id,
        descricao,
        valor,
        data,
        tipo,
        user_id,
        categoria_id,
        categorias (
          id,
          nome
        ),
        profiles (
          nome_completo
        )
      `
      )
      .in('user_id', familyMemberIds)
      .gte('data', firstDayOfMonth)
      .lte('data', lastDayOfMonth)
      .order('data', { ascending: false });
  }, [user, familyMemberIds, authLoading, supabase, firstDayOfMonth, lastDayOfMonth]);

  const key = query ? `lancamentos-${firstDayOfMonth}-${lastDayOfMonth}` : null;

  const { data: transactions, isLoading, revalidate } = useSupabaseData<Lancamento>(key, query);

  useEffect(() => {
    if (authLoading || !query) return;

    const channel = supabase
      .channel('public:lancamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lancamentos' },
        () => {
          revalidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, supabase, query, revalidate]);

  const addTransaction = async (transaction: Omit<Lancamento, 'id' | 'created_at' | 'categorias' | 'profiles'>) => {
    const { error } = await supabase.from('lancamentos').insert(transaction);
    if (error) throw error;
    revalidate();
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from('lancamentos').delete().match({ id });
    if (error) throw error;
    revalidate();
  };

  return { transactions, loading: isLoading, deleteTransaction, addTransaction, revalidate };
}
