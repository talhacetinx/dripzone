"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const session = await getSession();
      const role = session?.user?.role;

      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'PROVIDER') {
        router.push('/provider');
      } else if (role === 'ARTIST') {
        router.push('/artist');
      } else {
        router.push('/dashboard');
      }
    };

    checkSessionAndRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Yönlendiriliyorsunuz...</p>
    </div>
  );
}
