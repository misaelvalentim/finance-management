"use client";

import { Profile } from '@/types';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AvatarProps {
  profile: Profile | null;
}

export default function Avatar({ profile }: AvatarProps) {
  const { uploadAvatar } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setUploading(true);
    await uploadAvatar(event.target.files[0]);
    setUploading(false);
  }
  
  return (
    <div className="relative group">
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <Image
          src={profile?.avatar_url || 'https://placehold.co/40x40/png'}
          alt="User Avatar"
          width={56}
          height={56}
          className="rounded-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-bold">edit</span>
        </div>
      </label>
      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && 
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      }
    </div>
  );
}