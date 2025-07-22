'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ArtistDashboardContent } from './ArtistComponent/ArtistDashboardContent'

export const ArtistDashboard = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Lütfen giriş yapın</p>
      </div>
    )
  }

  return <ArtistDashboardContent user={session.user} />
}