"use client"

import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-black border border-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative h-40 sm:h-44 lg:h-48 bg-gray-800/50">
        {/* Badges Skeleton */}
        <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4">
          <div className="w-20 sm:w-24 h-5 sm:h-6 bg-gray-700/50 rounded-full"></div>
        </div>
        <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
          <div className="w-6 h-5 sm:h-6 bg-gray-700/50 rounded-full"></div>
        </div>
        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 right-2 sm:right-3 lg:right-4">
          <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-700/50 rounded-full"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Provider Info Skeleton */}
        <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="w-32 sm:w-40 h-5 sm:h-6 bg-gray-800/50 rounded mb-2"></div>
            <div className="w-24 sm:w-28 h-3 sm:h-4 bg-gray-700/50 rounded mb-2"></div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="w-20 sm:w-24 h-3 bg-gray-700/50 rounded"></div>
              <div className="w-16 sm:w-20 h-3 bg-gray-700/50 rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-900/30 rounded-lg sm:rounded-xl border border-gray-800/50">
          <div className="text-center">
            <div className="w-6 h-4 sm:h-5 bg-gray-700/50 rounded mb-0.5 sm:mb-1 mx-auto"></div>
            <div className="w-8 h-3 bg-gray-700/50 rounded mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="w-6 h-4 sm:h-5 bg-gray-700/50 rounded mb-0.5 sm:mb-1 mx-auto"></div>
            <div className="w-10 h-3 bg-gray-700/50 rounded mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="w-8 h-4 sm:h-5 bg-gray-700/50 rounded mb-0.5 sm:mb-1 mx-auto"></div>
            <div className="w-8 h-3 bg-gray-700/50 rounded mx-auto"></div>
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="w-full h-4 bg-gray-700/50 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-700/50 rounded"></div>
        </div>

        {/* Specialties Skeleton */}
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="w-16 h-6 bg-gray-700/50 rounded-full"></div>
          <div className="w-20 h-6 bg-gray-700/50 rounded-full"></div>
          <div className="w-12 h-6 bg-gray-700/50 rounded-full"></div>
        </div>

        {/* Action Button Skeleton */}
        <div className="w-full h-12 bg-gray-700/50 rounded-xl"></div>
      </div>
    </div>
  );
};
