import { redirect } from 'next/navigation';
import { getAuthUser } from '../api/lib/auth';

export default async function RedirectPage() {
  const session = await getAuthUser();
  const role = session?.role;

  if (!session) {
    redirect('/login'); 
  }

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  if (role === 'PROVIDER') {
    redirect('/provider');
  }

  if (role === 'ARTIST') {
    redirect('/artist');
  }

  redirect('/dashboard');
}