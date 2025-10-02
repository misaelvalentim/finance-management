import { useState, useEffect, useCallback, useRef } from 'react';
import { Orcamento } from '@/types';
import { getFirstDayOfMonth } from '@/utils/date';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface UseOrcamentosProps {
  user: User | null;
  supabase: SupabaseClient;
  familyMemberIds: string[];
  authLoading: boolean;
}

export function useOrcamentos({ user, supabase, familyMemberIds, authLoading }: UseOrcamentosProps) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  const fetchOrcamentos = useCallback(async () => {
    if (!user || familyMemberIds.length === 0) {
      setOrcamentos([]);
      setLoading(false);
      return;
    }

    if (isInitialLoad.current) {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from('orcamentos')
      .select('*')
      .in('user_id', familyMemberIds)
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
  }, [supabase, user, familyMemberIds]);

  useEffect(() => {
    if (authLoading) return;
    fetchOrcamentos();

    const channel = supabase
      .channel('public:orcamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orcamentos' },
        (_payload) => {
          fetchOrcamentos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, supabase, fetchOrcamentos]);

  const addOrcamento = async (mes: string, limite: number) => {
    if (!user) throw new Error('User not found');

    const date = new Date(mes + 'T00:00:00');
    const firstDay = getFirstDayOfMonth(date);

    const { error } = await supabase
      .from('orcamentos')
      .insert({ mes: firstDay, limite, user_id: user.id });

    if (error) throw error;
  };

  const deleteOrcamento = async (id: number) => {
    const { error } = await supabase.from('orcamentos').delete().match({ id });
    if (error) throw error;
  };

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchOrcamentos();
  };

  return { orcamentos, loading, addOrcamento, deleteOrcamento, revalidate };
}