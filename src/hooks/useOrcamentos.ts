import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Orcamento } from '@/types';
import { getFirstDayOfMonth } from '@/utils/date';

export function useOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, user, loading: authLoading } = useAuth();
  const isInitialLoad = useRef(true);

  const fetchOrcamentos = useCallback(async () => {
    if (!user) return;

    if (isInitialLoad.current) {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('user_id', user.id)
      .order('mes', { ascending: false });

    if (error) {
      console.error('Error fetching orcamentos:', error);
      setOrcamentos([]);
    } else {
      setOrcamentos(data);
    }

    if (isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrcamentos();
    }
  }, [authLoading, fetchOrcamentos]);

  const addOrcamento = async (mes: string, limite: number) => {
    if (!user) throw new Error('User not found');

    const date = new Date(mes + 'T00:00:00');
    const firstDay = getFirstDayOfMonth(date);

    const { error } = await supabase
      .from('orcamentos')
      .insert({ mes: firstDay, limite, user_id: user.id });

    if (error) throw error;
    await fetchOrcamentos(); // Refetch to update the list
  };

  const deleteOrcamento = async (id: number) => {
    const { error } = await supabase.from('orcamentos').delete().match({ id });
    if (error) throw error;
    await fetchOrcamentos(); // Refetch to update the list
  };

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchOrcamentos();
  };

  return { orcamentos, loading, addOrcamento, deleteOrcamento, revalidate };
}