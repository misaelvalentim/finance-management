"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import AppLogo from "@/../public/AppLogo.svg"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { supabase, router } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-12">
          <Image src={AppLogo} alt="App Logo" width={80} height={80} className="mx-auto mb-8" />
          <h1 className="text-xl font-bold text-gray-700">BOAS VINDAS!</h1>
          <p className="text-gray-500 mt-1">Pronto para organizar suas finanças? Acesse agora</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {message && <p className="mt-4 text-center text-sm text-red-500 font-bold">{message}</p>}
        </form>
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-gray-500 hover:underline">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
