import { ArtistDashboard } from './ArtistDashboard';
import { ProviderDashboard } from './ProviderDashboard';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export function DashboardRouter({user}) {
  const sessionUser = user;

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Giriş yapılmamış</h2>
          <p className="text-gray-400">Lütfen giriş yapın</p>
        </div>
      </div>
    );
  }

  const isProvider = sessionUser.role === 'PROVIDER';
  const isArtist = sessionUser.role === 'ARTIST';

  return (
    <>
      <Header />
      {isProvider && <ProviderDashboard AuthUser={user} />}
      {isArtist && <ArtistDashboard AuthUser={user} />}
      {!isProvider && !isArtist && (
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Dashboard Mevcut Değil</h2>
            <p className="text-gray-400">Role: {sessionUser.role}</p>
            <p className="text-gray-500 text-sm mt-2">Bu role için dashboard bulunmuyor</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}