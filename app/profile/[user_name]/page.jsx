import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "../../api/lib/prisma";
import ProfileClientPage from "./ProfileClient";
import PendingComponent from "../comp/PendingComponent"

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
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

  const user = await prisma.user.findFirst({
    where: { user_name: resolvedParams.user_name },
    include: {
      artistProfile: {
        select: {
          id: true,
          title: true,
          bio: true,
          avatarUrl: true,
          backgroundUrl: true,
          genres: true,
          experiences: true,
          experience: true,
          otherData: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      providerProfile: true,
    },
  });


  if (!user || (!user.artistProfile && !user.providerProfile)) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    };
  }

  if (user.userPending === true && !isAdmin) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    };
  }
  const profile = user.artistProfile || user.providerProfile;

  const profileIsPublic = profile?.otherData?.isPublic !== false; 
  if (!profileIsPublic && !isAdmin) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    };
  }
  const isArtist = Boolean(user.artistProfile);

  return {
    title: `${profile.title || profile.provider_title || user.name} | @${user.user_name}`,
    description: isArtist
      ? `${user.name}, ${profile.experience || 0} years of experience. Genres: ${profile.genres || 'Various'}`
      : `${user.name} offers professional services: ${profile.services?.join(', ') || 'Various services'}`,
  };
}

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let isAdmin = false;
  let currentUser = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      isAdmin = payload.role === 'ADMIN';
      currentUser = {
        id: payload.sub || payload.id || null,
        role: payload.role || null
      };
    } catch (error) {
      isAdmin = false;
      currentUser = null;
    }
  }
  const user = await prisma.user.findFirst({
    where: { user_name: resolvedParams.user_name },
    include: {
      artistProfile: {
        select: {
          id: true,
          title: true,
          bio: true,
          avatarUrl: true,
          backgroundUrl: true,
          genres: true,
          experiences: true,
          experience: true,
          otherData: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      providerProfile: true,
    },
  });

  if (user.isApproved !== true && !isAdmin) {
    return <PendingComponent />
  }

  const profile = user.artistProfile || user.providerProfile;
  const profileIsPublic = profile?.otherData?.isPublic !== false;
  if (!profileIsPublic && !isAdmin) {
    return <PendingComponent />
  }

  return <ProfileClientPage params={resolvedParams} initialData={user} isAdmin={isAdmin} currentUser={currentUser} />;
}