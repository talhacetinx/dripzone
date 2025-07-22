export const musicProviders = [
  {
    id: 'abbey-road-studios',
    name: 'Abbey Road Studios',
    title: 'Legendary Recording Studio',
    category: 'recording-studios',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: '/Untitled-1-min copy copy copy copy.png',
    rating: 4.9,
    reviewCount: 342,
    location: 'London, UK',
    yearsExperience: 92,
    startingPrice: 500,
    completedProjects: 15000,
    responseTime: '2 hours',
    specialties: ['Rock', 'Pop', 'Classical', 'Film Scoring'],
    verified: true,
    featured: true,
    bio: 'Abbey Road Studios is the most famous recording studio in the world, with a legacy spanning over 90 years. Home to countless legendary recordings from The Beatles to modern chart-toppers, we offer unparalleled acoustic excellence and cutting-edge technology.',
    notableClients: ['The Beatles', 'Pink Floyd', 'Adele', 'Radiohead', 'Kanye West'],
    portfolioImages: [
      '/Untitled-1-min copy copy copy copy.png',
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    packages: [
      {
        id: 'basic-session',
        name: 'Basic Session',
        description: 'Professional recording session with engineer',
        price: 500,
        deliveryTime: '1 day',
        revisions: 2,
        features: ['8-hour session', 'Professional engineer', 'Basic mixing', 'Raw files delivery']
      },
      {
        id: 'premium-session',
        name: 'Premium Session',
        description: 'Full production with mixing and mastering',
        price: 1200,
        deliveryTime: '3 days',
        revisions: 5,
        features: ['12-hour session', 'Senior engineer', 'Professional mixing', 'Mastering included', 'Stems delivery'],
        popular: true
      }
    ],
    portfolio: [
      {
        id: 'beatles-abbey',
        title: 'The Beatles - Abbey Road',
        description: 'Iconic album recording in Studio 2',
        client: 'The Beatles',
        duration: '6 months',
        outcome: 'Multi-platinum album, cultural landmark',
        image: '/Untitled-1-min copy copy copy copy.png'
      }
    ],
    reviews: [
      {
        id: 'review-1',
        userName: 'Marcus Johnson',
        userAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Absolutely incredible experience. The acoustics are unmatched and the engineers are world-class.',
        serviceUsed: 'Premium Session'
      }
    ]
  },
  // MUSIC PRODUCERS
  {
    id: 'max-martin',
    name: 'Max Martin',
    title: 'Pop Music Producer & Songwriter',
    category: 'producers',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 428,
    location: 'Stockholm, Sweden',
    yearsExperience: 28,
    startingPrice: 50000,
    completedProjects: 350,
    responseTime: '1 week',
    specialties: ['Pop', 'Dance-Pop', 'Electropop', 'Teen Pop'],
    verified: true,
    featured: true,
    bio: 'Max Martin is one of the most successful music producers and songwriters of all time, with 25 Billboard Hot 100 number-one singles.',
    notableClients: ['Taylor Swift', 'The Weeknd', 'Ariana Grande', 'Britney Spears'],
    portfolioImages: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    packages: [
      {
        id: 'full-production',
        name: 'Full Production',
        description: 'Complete song production from concept to master',
        price: 50000,
        deliveryTime: '4 weeks',
        revisions: 5,
        features: ['Songwriting', 'Full production', 'Mixing & mastering', 'Vocal coaching'],
        popular: true
      }
    ],
    portfolio: [
      {
        id: 'taylor-1989',
        title: 'Taylor Swift - 1989',
        description: 'Grammy-winning pop transformation album',
        client: 'Taylor Swift',
        duration: '8 months',
        outcome: 'Grammy Album of the Year',
        image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    reviews: [
      {
        id: 'review-4',
        userName: 'Emma Rodriguez',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50',
        rating: 5,
        date: '2 months ago',
        comment: 'Working with Max was a dream come true. His ability to craft perfect pop melodies is unmatched.',
        serviceUsed: 'Full Production'
      }
    ]
  },
  // ALBUM COVER ARTISTS
  {
    id: 'storm-thorgerson',
    name: 'Storm Thorgerson Studio',
    title: 'Legendary Album Art Designer',
    category: 'album-cover-artists',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 156,
    location: 'London, UK',
    yearsExperience: 45,
    startingPrice: 8000,
    completedProjects: 280,
    responseTime: '2 days',
    specialties: ['Surreal Art', 'Conceptual Design', 'Photography', 'Digital Art'],
    verified: true,
    featured: true,
    bio: 'Storm Thorgerson Studio continues the legacy of the legendary designer behind Pink Floyd\'s iconic album covers.',
    notableClients: ['Pink Floyd', 'Led Zeppelin', 'The Mars Volta', 'Muse'],
    portfolioImages: [
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    packages: [
      {
        id: 'premium-package',
        name: 'Premium Package',
        description: 'Complete visual identity with multiple formats',
        price: 15000,
        deliveryTime: '6 weeks',
        revisions: 8,
        features: ['Album cover', 'Back cover', 'Vinyl design', 'Digital formats'],
        popular: true
      }
    ],
    portfolio: [
      {
        id: 'pink-floyd-dsotm',
        title: 'Pink Floyd - Dark Side of the Moon',
        description: 'Iconic prism design',
        client: 'Pink Floyd',
        duration: '3 months',
        outcome: 'Cultural icon, 45M+ copies sold',
        image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    reviews: [
      {
        id: 'review-7',
        userName: 'David Wilson',
        userAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50',
        rating: 5,
        date: '1 month ago',
        comment: 'Absolutely mind-blowing artwork. The conceptual depth perfectly captured our music\'s essence.',
        serviceUsed: 'Premium Package'
      }
    ]
  },
  // MUSIC VIDEO DIRECTORS
  {
    id: 'michel-gondry',
    name: 'Michel Gondry',
    title: 'Visionary Music Video Director',
    category: 'videographers',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 89,
    location: 'Paris, France',
    yearsExperience: 32,
    startingPrice: 75000,
    completedProjects: 120,
    responseTime: '1 week',
    specialties: ['Surreal Concepts', 'Practical Effects', 'Stop Motion', 'Creative Storytelling'],
    verified: true,
    featured: true,
    bio: 'Michel Gondry is a visionary director known for his innovative and surreal music videos.',
    notableClients: ['Björk', 'The White Stripes', 'Radiohead', 'Daft Punk'],
    portfolioImages: [
      'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    packages: [
      {
        id: 'premium-production',
        name: 'Premium Production',
        description: 'High-budget production with elaborate effects',
        price: 150000,
        deliveryTime: '8 weeks',
        revisions: 5,
        features: ['Complex concept', 'Advanced effects', 'Large crew', 'Multiple locations'],
        popular: true
      }
    ],
    portfolio: [
      {
        id: 'white-stripes-lego',
        title: 'The White Stripes - Fell in Love with a Girl',
        description: 'Innovative LEGO stop-motion music video',
        client: 'The White Stripes',
        duration: '8 weeks',
        outcome: 'MTV VMA winner, viral sensation',
        image: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    reviews: [
      {
        id: 'review-10',
        userName: 'Isabella Garcia',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50',
        rating: 5,
        date: '2 months ago',
        comment: 'Michel\'s creative vision transformed our song into a visual masterpiece.',
        serviceUsed: 'Premium Production'
      }
    ]
  }
];