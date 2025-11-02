import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "../../api/lib/prisma"
import ProfileClientPage from "./ProfileClient";

export async function generateMetadata({ params }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let isAdmin = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      
      isAdmin = payload.role === 'ADMIN';
    } catch (error) {
      isAdmin = false;
    }
  }

  let user = null;
  try {
    user = await prisma.user.findFirst({
      where: { user_name: params.user_name },
      include: {
        artistProfile: true,
        providerProfile: true,
      },
    });
  } catch (err) {
    // Fallback: return generic metadata instead of failing with a 404 at metadata stage
    return {
      title: `Profil | @${params.user_name}`,
      description: `Kullanıcı profili yüklenemiyor.`,
    };
  }

  if (!user || (!user.artistProfile && !user.providerProfile)) {
    if (!isAdmin) {
      return {
        title: "Profil Bulunamadı",
        description: "İstenen profil bulunamadı.",
      };
    }
  }

  const isProfilePending = user.userPending;
  
  if (isProfilePending && !isAdmin) {
    return {
      title: "Profil Onaylanmamış",
      description: "Bu profil henüz onaylanmamış.",
    };
  }

  const profile = user.artistProfile || user.providerProfile;
  const isArtist = Boolean(user.artistProfile);

  return {
    title: `${profile.title || profile.provider_title || user.name} | @${user.user_name}`,
    description: isArtist
      ? `${user.name}, ${profile.experience || 0} years of experience. Genres: ${profile.genres || 'Various'}`
      : `${user.name} offers professional services: ${profile.services?.join(', ') || 'Various services'}`,
  };
}

export default async function ProfilePage({ params }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  let isAdmin = false;
  let currentUser = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      isAdmin = payload.role === 'ADMIN';
      currentUser = payload;
    } catch (error) {
      isAdmin = false;
    }
  }

  let user = null;
  try {
    user = await prisma.user.findFirst({
      where: { user_name: params.user_name },
      include: {
        artistProfile: true,
        providerProfile: true,
      },
    });
  } catch (err) {
    // If DB/Prisma fails in production, surface a 500 with logs instead of returning 404 for every profile
    // Throw to produce a 500 and have the error logged in production platform
    throw new Error('DATABASE_FETCH_ERROR: ' + (err?.message || err));
  }

  if (!user || (!user.artistProfile && !user.providerProfile)) {
    if (!isAdmin) {
      notFound();
    }
  }

  const profile = user.artistProfile || user.providerProfile;
  const isProfilePending = user.userPending; 

  // Kullanıcı onaylanmamışsa (userPending: true) ve admin değilse erişim yok
  if (isProfilePending && !isAdmin) {
    notFound();
  }

  return <ProfileClientPage sessionUser={token} params={params} initialData={user} isAdmin={isAdmin} currentUser={currentUser} />;
}
