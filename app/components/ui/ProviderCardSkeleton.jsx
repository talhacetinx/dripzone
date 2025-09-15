"use client"

export const ProviderCardSkeleton = () => {
  return (
    <div className="bg-black border border-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative h-40 sm:h-44 lg:h-48 bg-gray-800/50">
        {/* Service Type Badge Skeleton */}
        <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4">
          <div className="h-5 w-20 bg-gray-700/50 rounded-full"></div>
        </div>
        
        {/* Price Badge Skeleton */}
        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 right-2 sm:right-3 lg:right-4">
          <div className="h-5 w-16 bg-gray-700/50 rounded-full"></div>
        </div>

        {/* Verified Badge Skeleton */}
        <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
          <div className="h-5 w-5 bg-gray-700/50 rounded-full"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Provider Info Skeleton */}
        <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          {/* Avatar Skeleton */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700/50 rounded-full flex-shrink-0"></div>
          
          <div className="flex-1 min-w-0">
            {/* Name Skeleton */}
            <div className="h-5 bg-gray-700/50 rounded mb-2 w-3/4"></div>
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-700/50 rounded mb-2 w-1/2"></div>
            
            {/* Stats Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="h-3 bg-gray-700/50 rounded w-16"></div>
              <div className="h-3 bg-gray-700/50 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* Stats Box Skeleton */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg sm:rounded-xl">
          <div className="text-center">
            <div className="h-5 bg-gray-700/50 rounded mb-1 mx-auto w-6"></div>
            <div className="h-3 bg-gray-700/50 rounded w-8 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-5 bg-gray-700/50 rounded mb-1 mx-auto w-6"></div>
            <div className="h-3 bg-gray-700/50 rounded w-10 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-5 bg-gray-700/50 rounded mb-1 mx-auto w-8"></div>
            <div className="h-3 bg-gray-700/50 rounded w-8 mx-auto"></div>
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className="mb-3 sm:mb-4">
          <div className="h-3 bg-gray-700/50 rounded mb-1 w-full"></div>
          <div className="h-3 bg-gray-700/50 rounded w-4/5"></div>
        </div>

        {/* Specialties Skeleton */}
        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          <div className="h-6 bg-gray-700/50 rounded-full w-12"></div>
          <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700/50 rounded-full w-10"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-700/50 rounded-lg sm:rounded-xl"></div>
      </div>
    </div>
  );
};
