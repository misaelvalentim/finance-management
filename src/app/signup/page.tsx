"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import AppLogo from "@/../public/AppLogo.svg"

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { supabase, router } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('profiles').upsert({ 
          id: data.user.id,
          nome_completo: fullName,
          updated_at: new Date().toISOString(),
        });
        if (data.session) {
          router.push('/');
        } else {
          setSuccess(true);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
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
          <h1 className="text-xl font-bold text-gray-700">CRIAR CONTA</h1>
          <p className="text-gray-500 mt-1">Comece a organizar suas finanças agora mesmo.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="text"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
          {success && <p className="mt-4 text-center text-sm text-green-500">Conta criada com sucesso! Verifique seu e-mail para finalizar o cadastro.</p>}
          {error && <p className="mt-4 text-center text-sm text-red-500 font-bold">{error}</p>}
        </form>
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:underline">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
