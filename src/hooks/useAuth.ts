"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { HeaderProps } from '@/components/shared/Header/HeaderProps';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export type UseAuthReturn = HeaderProps & {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  router: AppRouterInstance;
  familyMemberIds: string[];
}

const fetcher = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.rpc('get_initial_user_data');
  if (error) {
    throw error;
  }
  return data;
};

export function useAuth(): UseAuthReturn {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: initialUserData, mutate } = useSWR(user ? 'initial_user_data' : null, () => fetcher(supabase));

  const profile = initialUserData?.profile ?? null;
  const familyMemberIds = initialUserData?.familyMemberIds ?? (user ? [user.id] : []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (event === 'SIGNED_IN') {
          mutate(); // Revalidate user data on sign in
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router, mutate]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) throw new Error('User not found');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const cacheBustedUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: cacheBustedUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      mutate(); // Revalidate user data after avatar upload

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return { supabase, user, profile, loading, signOut, uploadAvatar, router, familyMemberIds };
};
