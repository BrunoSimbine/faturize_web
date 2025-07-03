'use client';

import { Loader2 } from 'lucide-react';

import { getToken } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {

  const router = useRouter();

  type Auth = {
    active: boolean;
  };

  useEffect(() => {
    const token = getToken() as Auth;
    if(token)
    {
      if (token.active) {
        router.replace('/dashboard');
      } else {
        router.replace('/company');
      }
    }else{
      router.replace('/login');
    }

  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
    </div>
  );
}