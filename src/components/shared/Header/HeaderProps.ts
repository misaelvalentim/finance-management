export interface Profile {
  id: string;
  nome_completo: string;
  avatar_url: string;
  family_id: string;
}

export interface HeaderProps {
  profile: Profile | null;
  signOut: () => void;
  uploadAvatar: (file: File) => Promise<void>;
}
