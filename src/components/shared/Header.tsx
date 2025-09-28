"use client";

import { FaSignOutAlt } from 'react-icons/fa';
import Avatar from '@/components/features/Avatar';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { profile, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center">
        <Avatar profile={profile} />
        <div className="ml-3">
          <h1 className="text-lg font-bold uppercase">Olá, {profile?.nome_completo || '...'}!</h1>
          <p className="text-sm text-gray-500">Vamos organizar suas finanças?</p>
        </div>
      </div>
      <button onClick={signOut} className="text-gray-500">
        <FaSignOutAlt size={24} />
      </button>
    </header>
  );
};

export default Header;