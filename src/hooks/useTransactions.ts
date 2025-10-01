import { useState, useEffect, useCallback, useRef } from 'react';
import { Lancamento } from '@/types';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface UseTransactionsProps {
  currentDate: Date;
  user: User | null;
  supabase: SupabaseClient;
  getFamilyMemberIds: () => Promise<string[]>;
}

export function useTransactions({ currentDate, user, supabase, getFamilyMemberIds }: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    };

    if (isInitialLoad.current) {
      setLoading(true);
    }

    const familyMemberIds = await getFamilyMemberIds();
    if (familyMemberIds.length === 0) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]; 

    const { data, error } = await supabase
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

    if (error) {
      console.log('Error fetching transactions:', error);
      setTransactions([]);
    } else {
      setTransactions(data as unknown as Lancamento[]);
    }
    
    if (isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [currentDate, supabase, user, getFamilyMemberIds]);

  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel('public:lancamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lancamentos' },
        (_payload) => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchTransactions]);

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from('lancamentos').delete().match({ id });
    if (error) {
      console.error('Error deleting transaction:', error);
    } else {
      fetchTransactions();
    }
  };

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchTransactions();
  };

  return { transactions, loading, deleteTransaction, refetch: fetchTransactions, revalidate };
}