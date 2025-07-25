'use client'

import React, { useState } from 'react'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ArtistDashboardContent } from './ArtistComponent/ArtistDashboardContent'

export const ArtistDashboard = ({AuthUser}) => {

  if (!AuthUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Lütfen giriş yapın</p>
      </div>
    )
  }

  return <ArtistDashboardContent user={session.user} />
}