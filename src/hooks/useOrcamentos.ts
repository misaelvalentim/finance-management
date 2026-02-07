import { useMemo, useEffect } from 'react';
import { Orcamento } from '@/components/features/OrcamentoModal/OrcamentoModalProps';
import { getFirstDayOfMonth, fromYYYYMMDD } from '@/utils/date';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { useSupabaseData } from './useSupabaseData';

interface UseOrcamentosProps {
  user: User | null;
  supabase: SupabaseClient;
  familyMemberIds: string[];
  authLoading: boolean;
}

export function useOrcamentos({ user, supabase, familyMemberIds, authLoading }: UseOrcamentosProps) {
  const query = useMemo(() => {
    if (!user || familyMemberIds.length === 0 || authLoading) {
      return null;
    }
    return supabase
      .from('orcamentos')
      .select('*')
      .in('user_id', familyMemberIds)
      .order('mes', { ascending: false });
  }, [user, familyMemberIds, authLoading, supabase]);

  const key = query ? `orcamentos-${familyMemberIds.join('-')}` : null;

  const { data: orcamentos, isLoading, revalidate } = useSupabaseData<Orcamento>(key, query);

  useEffect(() => {
    if (authLoading || !query) return;

    const channel = supabase
      .channel('public:orcamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orcamentos' },
        () => {
          revalidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, supabase, query, revalidate]);

  const addOrcamento = async (mes: string, limite: number) => {
    if (!user) throw new Error('User not found');

    const date = fromYYYYMMDD(mes);
    const firstDay = getFirstDayOfMonth(date);

    const { error } = await supabase
      .from('orcamentos')
      .insert({ mes: firstDay, limite, user_id: user.id });

    if (error) throw error;
    revalidate();
  };

  const deleteOrcamento = async (id: number) => {
    const { error } = await supabase.from('orcamentos').delete().match({ id });
    if (error) throw error;
    revalidate();
  };

  return { orcamentos, loading: isLoading, addOrcamento, deleteOrcamento, revalidate };
}