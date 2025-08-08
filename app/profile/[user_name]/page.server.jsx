import { notFound } from "next/navigation";
import prisma from "../../../api/lib/prisma";
import ProfileClientPage from "./ProfileClient";

export async function generateMetadata({ params }) {
  const user = await prisma.user.findFirst({
    where: { user_name: params.user_name },
    include: {
      artistProfile: true,
      providerProfile: true,
    },
  });

  if (!user || (!user.artistProfile && !user.providerProfile)) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
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
  // Server-side check for SEO and initial load
  const user = await prisma.user.findFirst({
    where: { user_name: params.user_name },
    include: {
      artistProfile: true,
      providerProfile: true,
    },
  });

  if (!user || (!user.artistProfile && !user.providerProfile)) {
    notFound();
  }

  return <ProfileClientPage params={params} initialData={user} />;
}
