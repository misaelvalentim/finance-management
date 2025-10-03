import { Profile } from '@/components/shared/Header/HeaderProps';

export interface AvatarProps {
  profile: Profile | null;
  uploadAvatar: (file: File) => Promise<void>;
}
