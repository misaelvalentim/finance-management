import { useAuth } from '@/hooks/useAuth';

export function useUserProfile() {
  const { profile, loading, signOut, uploadAvatar } = useAuth();

  return { profile, loading, handleLogout: signOut, uploadAvatar };
}