"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { Profile, HeaderProps } from '@/components/shared/Header/HeaderProps';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';


export type UseAuthReturn = HeaderProps & {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  router: AppRouterInstance;
  familyMemberIds: string[];
}

export function useAuth(): UseAuthReturn {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyMemberIds, setFamilyMemberIds] = useState<string[]>([]);

  const fetchSessionAndProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      // Call the RPC function to get profile and family members in one go
      const { data, error } = await supabase.rpc('get_initial_user_data');

      if (error) {
        console.error('Error fetching initial user data:', error);
        setProfile(null);
        setFamilyMemberIds(currentUser ? [currentUser.id] : []);
      } else if (data) {
        setProfile(data.profile);
        setFamilyMemberIds(data.familyMemberIds ?? [currentUser.id]);
      }
    } else {
      // Ensure state is cleared on logout
      setProfile(null);
      setFamilyMemberIds([]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      fetchSessionAndProfile();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          if (user?.id !== session?.user?.id) {
            fetchSessionAndProfile();
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setFamilyMemberIds([]);
          setUser(null);
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router, fetchSessionAndProfile, user]);

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
      
      setProfile(prevProfile => prevProfile ? { ...prevProfile, avatar_url: cacheBustedUrl } : null);

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return { supabase, user, profile, loading, signOut, uploadAvatar, router, familyMemberIds };
};