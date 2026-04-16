const properties = [
  {
    id: "prop-1",
    title: "Oceanview Luxury Apartments",
    location: "Marina Bay, Dubai",
    city: "Dubai",
    type: "apartment",
    price: 85e4,
    originalPrice: 95e4,
    discountPercentage: 11,
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    currentBuyers: 8,
    requiredBuyers: 12,
    daysRemaining: 14,
    developer: "Emaar Properties",
    description: "Experience luxury living with breathtaking ocean views. These premium apartments feature modern design, high-end finishes, and world-class amenities.",
    amenities: ["Swimming Pool", "Gym", "Concierge", "Parking", "Security", "Beach Access"],
    featured: true
  },
  {
    id: "prop-2",
    title: "Green Valley Villas",
    location: "Palm Jumeirah, Dubai",
    city: "Dubai",
    type: "villa",
    price: 22e5,
    originalPrice: 25e5,
    discountPercentage: 12,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    currentBuyers: 5,
    requiredBuyers: 8,
    daysRemaining: 21,
    developer: "Nakheel",
    description: "Exclusive waterfront villas with private beach access. Perfect for families seeking luxury and privacy.",
    amenities: ["Private Pool", "Garden", "Smart Home", "Maid's Room", "Double Garage"],
    featured: true
  },
  {
    id: "prop-3",
    title: "Downtown Modern Flats",
    location: "Downtown, Abu Dhabi",
    city: "Abu Dhabi",
    type: "apartment",
    price: 52e4,
    originalPrice: 58e4,
    discountPercentage: 10,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    currentBuyers: 10,
    requiredBuyers: 15,
    daysRemaining: 7,
    developer: "Aldar Properties",
    description: "Contemporary apartments in the heart of Abu Dhabi. Walking distance to major attractions and business districts.",
    amenities: ["Gym", "Pool", "Parking", "Kids Play Area"],
    featured: false
  },
  {
    id: "prop-4",
    title: "Skyline Penthouse Collection",
    location: "Business Bay, Dubai",
    city: "Dubai",
    type: "penthouse",
    price: 35e5,
    originalPrice: 4e6,
    discountPercentage: 13,
    bedrooms: 4,
    bathrooms: 5,
    area: 5200,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    currentBuyers: 3,
    requiredBuyers: 5,
    daysRemaining: 30,
    developer: "DAMAC",
    description: "Ultra-luxury penthouses with panoramic city views. The pinnacle of sophisticated living.",
    amenities: ["Private Elevator", "Rooftop Terrace", "Wine Cellar", "Home Cinema", "Butler Service"],
    featured: true
  },
  {
    id: "prop-5",
    title: "Suburban Family Homes",
    location: "Arabian Ranches, Dubai",
    city: "Dubai",
    type: "house",
    price: 14e5,
    originalPrice: 155e4,
    discountPercentage: 10,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    currentBuyers: 7,
    requiredBuyers: 10,
    daysRemaining: 18,
    developer: "Emaar Properties",
    description: "Spacious family homes in a gated community. Excellent schools and community facilities nearby.",
    amenities: ["Garden", "Garage", "Community Pool", "Parks", "Sports Facilities"],
    featured: false
  },
  {
    id: "prop-6",
    title: "Waterfront Studios",
    location: "Al Reem Island, Abu Dhabi",
    city: "Abu Dhabi",
    type: "apartment",
    price: 28e4,
    originalPrice: 31e4,
    discountPercentage: 10,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop"
    ],
    currentBuyers: 12,
    requiredBuyers: 20,
    daysRemaining: 10,
    developer: "Aldar Properties",
    description: "Affordable waterfront living with stunning views. Ideal for young professionals and investors.",
    amenities: ["Pool", "Gym", "Retail", "Metro Access"],
    featured: false
  },
  {
    id: "prop-7",
    title: "Heritage District Townhouses",
    location: "Jumeirah, Dubai",
    city: "Dubai",
    type: "house",
    price: 185e4,
    originalPrice: 21e5,
    discountPercentage: 12,
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop"
    ],
    currentBuyers: 4,
    requiredBuyers: 6,
    daysRemaining: 25,
    developer: "Meraas",
    description: "Charming townhouses in one of Dubai's most prestigious neighborhoods. Blend of tradition and modernity.",
    amenities: ["Private Garden", "Rooftop", "Beach Access", "Community Center"],
    featured: false
  },
  {
    id: "prop-8",
    title: "Golf Course Residences",
    location: "Emirates Hills, Dubai",
    city: "Dubai",
    type: "villa",
    price: 45e5,
    originalPrice: 52e5,
    discountPercentage: 13,
    bedrooms: 6,
    bathrooms: 7,
    area: 8e3,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    currentBuyers: 2,
    requiredBuyers: 4,
    daysRemaining: 45,
    developer: "Emaar Properties",
    description: "Prestigious golf course villas with unmatched luxury and exclusivity.",
    amenities: ["Golf Course Access", "Private Pool", "Spa", "Staff Quarters", "Tennis Court"],
    featured: true
  },
  {
    id: "prop-9",
    title: "City Center Apartments",
    location: "DIFC, Dubai",
    city: "Dubai",
    type: "apartment",
    price: 98e4,
    originalPrice: 11e5,
    discountPercentage: 11,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop"
    ],
    currentBuyers: 9,
    requiredBuyers: 12,
    daysRemaining: 12,
    developer: "Omniyat",
    description: "Premium apartments in Dubai's financial heart. Walking distance to world-class dining and entertainment.",
    amenities: ["Concierge", "Valet Parking", "Infinity Pool", "Sky Lounge"],
    featured: false
  },
  {
    id: "prop-10",
    title: "Beachfront Residences",
    location: "JBR, Dubai",
    city: "Dubai",
    type: "apartment",
    price: 12e5,
    originalPrice: 135e4,
    discountPercentage: 11,
    bedrooms: 3,
    bathrooms: 3,
    area: 2e3,
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop"
    ],
    currentBuyers: 6,
    requiredBuyers: 10,
    daysRemaining: 20,
    developer: "Select Group",
    description: "Direct beach access apartments with resort-style amenities. Perfect for those who love the beach lifestyle.",
    amenities: ["Private Beach", "Multiple Pools", "Spa", "Kids Club", "Water Sports"],
    featured: false
  },
  {
    id: "prop-11",
    title: "Smart Living Condos",
    location: "Masdar City, Abu Dhabi",
    city: "Abu Dhabi",
    type: "apartment",
    price: 45e4,
    originalPrice: 5e5,
    discountPercentage: 10,
    bedrooms: 2,
    bathrooms: 1,
    area: 1e3,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ],
    currentBuyers: 15,
    requiredBuyers: 25,
    daysRemaining: 8,
    developer: "Masdar",
    description: "Eco-friendly apartments in the world's most sustainable city. Future-forward living.",
    amenities: ["Solar Power", "EV Charging", "Smart Home", "Green Spaces"],
    featured: false
  },
  {
    id: "prop-12",
    title: "Mountain View Chalets",
    location: "Ras Al Khaimah",
    city: "Ras Al Khaimah",
    type: "villa",
    price: 11e5,
    originalPrice: 125e4,
    discountPercentage: 12,
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    currentBuyers: 5,
    requiredBuyers: 8,
    daysRemaining: 35,
    developer: "RAK Properties",
    description: "Scenic mountain retreats perfect for weekend getaways or permanent residence.",
    amenities: ["Mountain Views", "Private Pool", "BBQ Area", "Hiking Trails"],
    featured: false
  }
];
const dealerships = [
  {
    id: "dealer-1",
    name: "Al Futtaim Toyota",
    brand: "Toyota",
    location: "Sheikh Zayed Road, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1562141961-b5d117428fbe?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1562141961-b5d117428fbe?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 342,
    currentBuyers: 18,
    requiredBuyers: 25,
    daysRemaining: 12,
    averageDiscount: 12,
    description: "The largest Toyota dealership in UAE offering the complete range of Toyota vehicles with exceptional after-sales service and genuine parts.",
    services: ["Test Drive", "Trade-In", "Financing", "Insurance", "Extended Warranty", "Service Center"],
    models: [
      {
        id: "tm-1",
        name: "Hilux",
        type: "pickup",
        price: 125e3,
        originalPrice: 142e3,
        discountPercentage: 12,
        image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop",
        specs: { engine: "2.8L Diesel", transmission: "6-Speed Auto", fuelType: "Diesel", mileage: "12 km/L", seating: 5 },
        features: ["4x4", "Towing Package", "Bed Liner", "Off-road Suspension"],
        colors: ["White", "Silver", "Black", "Red"]
      },
      {
        id: "tm-2",
        name: "Fortuner",
        type: "suv",
        price: 165e3,
        originalPrice: 188e3,
        discountPercentage: 12,
        image: "https://images.unsplash.com/photo-1625231334168-25da27594765?w=800&h=600&fit=crop",
        specs: { engine: "2.7L Petrol", transmission: "6-Speed Auto", fuelType: "Petrol", mileage: "10 km/L", seating: 7 },
        features: ["4x4", "7 Seats", "Leather Interior", "JBL Sound System"],
        colors: ["White", "Silver", "Black", "Bronze"]
      },
      {
        id: "tm-3",
        name: "Land Cruiser",
        type: "suv",
        price: 32e4,
        originalPrice: 365e3,
        discountPercentage: 12,
        image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&h=600&fit=crop",
        specs: { engine: "3.5L V6 Twin Turbo", transmission: "10-Speed Auto", fuelType: "Petrol", mileage: "8 km/L", seating: 7 },
        features: ["4x4", "Multi-Terrain Select", "Crawl Control", "Premium Sound"],
        colors: ["Pearl White", "Black", "Gray", "Army Green"]
      },
      {
        id: "tm-4",
        name: "Camry",
        type: "sedan",
        price: 95e3,
        originalPrice: 108e3,
        discountPercentage: 12,
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
        specs: { engine: "2.5L Hybrid", transmission: "CVT", fuelType: "Hybrid", mileage: "22 km/L", seating: 5 },
        features: ["Toyota Safety Sense", "JBL Audio", "Wireless CarPlay", "Heated Seats"],
        colors: ["White", "Silver", "Black", "Red", "Blue"]
      },
      {
        id: "tm-5",
        name: "Innova",
        type: "mpv",
        price: 115e3,
        originalPrice: 131e3,
        discountPercentage: 12,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
        specs: { engine: "2.7L Petrol", transmission: "6-Speed Auto", fuelType: "Petrol", mileage: "11 km/L", seating: 8 },
        features: ["8 Seats", "Sliding Doors", "Captain Seats", "Rear AC"],
        colors: ["White", "Silver", "Gray", "Bronze"]
      }
    ],
    featured: true
  },
  {
    id: "dealer-2",
    name: "AGMC BMW",
    brand: "BMW",
    location: "Sheikh Zayed Road, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 256,
    currentBuyers: 12,
    requiredBuyers: 15,
    daysRemaining: 18,
    averageDiscount: 11,
    description: "The official BMW dealer in Dubai offering the complete range of BMW vehicles, M Performance models, and certified pre-owned cars.",
    services: ["Test Drive", "BMW Finance", "Trade-In", "BMW Service", "BMW Accessories", "M Performance Parts"],
    models: [
      {
        id: "bm-1",
        name: "3 Series",
        type: "sedan",
        price: 185e3,
        originalPrice: 208e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Turbo", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "15 km/L", seating: 5 },
        features: ["M Sport Package", "Live Cockpit", "Parking Assistant", "Harman Kardon"],
        colors: ["Alpine White", "Black Sapphire", "Mineral Gray", "Portimao Blue"]
      },
      {
        id: "bm-2",
        name: "X5",
        type: "suv",
        price: 32e4,
        originalPrice: 36e4,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Turbo Inline-6", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "11 km/L", seating: 5 },
        features: ["xDrive", "Panoramic Roof", "Air Suspension", "Gesture Control"],
        colors: ["Alpine White", "Carbon Black", "Phytonic Blue", "Manhattan Green"]
      },
      {
        id: "bm-3",
        name: "X7",
        type: "suv",
        price: 45e4,
        originalPrice: 505e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Turbo Inline-6", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "9 km/L", seating: 7 },
        features: ["7 Seats", "Executive Lounge", "Sky Lounge LED", "Bowers & Wilkins"],
        colors: ["Mineral White", "Black Sapphire", "Sparkling Copper"]
      },
      {
        id: "bm-4",
        name: "5 Series",
        type: "sedan",
        price: 265e3,
        originalPrice: 298e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Turbo", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "14 km/L", seating: 5 },
        features: ["M Sport Pro", "Curved Display", "Highway Assistant", "Ambient Lighting"],
        colors: ["Alpine White", "Black Sapphire", "Skyscraper Gray", "Fire Red"]
      }
    ],
    featured: true
  },
  {
    id: "dealer-3",
    name: "Gargash Mercedes-Benz",
    brand: "Mercedes-Benz",
    location: "Al Quoz, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 298,
    currentBuyers: 14,
    requiredBuyers: 20,
    daysRemaining: 15,
    averageDiscount: 10,
    description: "The authorized Mercedes-Benz dealer in Dubai with the full range of luxury vehicles, AMG performance cars, and premium services.",
    services: ["Test Drive", "Mercedes Finance", "Trade-In", "Service Center", "AMG Performance Center"],
    models: [
      {
        id: "mb-1",
        name: "C-Class",
        type: "sedan",
        price: 195e3,
        originalPrice: 217e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Turbo", transmission: "9-Speed Auto", fuelType: "Petrol", mileage: "15 km/L", seating: 5 },
        features: ["MBUX", "AMG Line", "Burmester Sound", "360 Camera"],
        colors: ["Polar White", "Obsidian Black", "Selenite Gray", "Spectral Blue"]
      },
      {
        id: "mb-2",
        name: "E-Class",
        type: "sedan",
        price: 275e3,
        originalPrice: 306e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Turbo", transmission: "9-Speed Auto", fuelType: "Petrol", mileage: "13 km/L", seating: 5 },
        features: ["Executive Seat", "Superscreen", "Burmester 4D", "AIRMATIC"],
        colors: ["Polar White", "Obsidian Black", "High-Tech Silver", "Nautic Blue"]
      },
      {
        id: "mb-3",
        name: "GLE",
        type: "suv",
        price: 35e4,
        originalPrice: 389e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Inline-6 MHEV", transmission: "9-Speed Auto", fuelType: "Mild Hybrid", mileage: "10 km/L", seating: 5 },
        features: ["4MATIC", "E-Active Body Control", "Burmester Sound", "Head-Up Display"],
        colors: ["Polar White", "Obsidian Black", "Selenite Gray", "Emerald Green"]
      },
      {
        id: "mb-4",
        name: "GLS",
        type: "suv",
        price: 48e4,
        originalPrice: 533e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Inline-6 MHEV", transmission: "9-Speed Auto", fuelType: "Mild Hybrid", mileage: "9 km/L", seating: 7 },
        features: ["7 Seats", "Maybach Grade Interior", "E-Active Body", "Rear Entertainment"],
        colors: ["Diamond White", "Obsidian Black", "Selenite Gray"]
      }
    ],
    featured: true
  },
  {
    id: "dealer-4",
    name: "Al Nabooda Nissan",
    brand: "Nissan",
    location: "Deira, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 412,
    currentBuyers: 22,
    requiredBuyers: 30,
    daysRemaining: 10,
    averageDiscount: 13,
    description: "The leading Nissan dealer in UAE with a wide range of vehicles from compact cars to powerful SUVs and trucks.",
    services: ["Test Drive", "Nissan Finance", "Trade-In", "Service Center", "Genuine Parts"],
    models: [
      {
        id: "ns-1",
        name: "Patrol",
        type: "suv",
        price: 245e3,
        originalPrice: 282e3,
        discountPercentage: 13,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "5.6L V8", transmission: "7-Speed Auto", fuelType: "Petrol", mileage: "7 km/L", seating: 8 },
        features: ["4x4", "Hydraulic Body Motion Control", "Premium Audio", "Rear Entertainment"],
        colors: ["Pearl White", "Black", "Champagne", "Gray"]
      },
      {
        id: "ns-2",
        name: "X-Trail",
        type: "crossover",
        price: 115e3,
        originalPrice: 132e3,
        discountPercentage: 13,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
        specs: { engine: "2.5L Petrol", transmission: "CVT", fuelType: "Petrol", mileage: "13 km/L", seating: 7 },
        features: ["e-4ORCE AWD", "ProPILOT", "Around View Monitor", "Zero Gravity Seats"],
        colors: ["Pearl White", "Black", "Gray", "Orange"]
      },
      {
        id: "ns-3",
        name: "Altima",
        type: "sedan",
        price: 95e3,
        originalPrice: 109e3,
        discountPercentage: 13,
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop",
        specs: { engine: "2.5L Petrol", transmission: "CVT", fuelType: "Petrol", mileage: "16 km/L", seating: 5 },
        features: ["ProPILOT Assist", "Bose Audio", "Wireless CarPlay", "Remote Start"],
        colors: ["Pearl White", "Black", "Silver", "Red"]
      }
    ],
    featured: false
  },
  {
    id: "dealer-5",
    name: "Trading Enterprises Honda",
    brand: "Honda",
    location: "Al Qusais, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 378,
    currentBuyers: 16,
    requiredBuyers: 22,
    daysRemaining: 14,
    averageDiscount: 11,
    description: "The official Honda dealer in UAE offering reliable vehicles known for their quality, fuel efficiency, and advanced safety features.",
    services: ["Test Drive", "Honda Finance", "Trade-In", "Service Center", "Genuine Parts", "Body Shop"],
    models: [
      {
        id: "hd-1",
        name: "Accord",
        type: "sedan",
        price: 115e3,
        originalPrice: 129e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop",
        specs: { engine: "1.5L Turbo", transmission: "CVT", fuelType: "Petrol", mileage: "18 km/L", seating: 5 },
        features: ["Honda Sensing", "Wireless CarPlay", "Remote Start", "Sport Mode"],
        colors: ["Platinum White", "Crystal Black", "Lunar Silver", "Radiant Red"]
      },
      {
        id: "hd-2",
        name: "CR-V",
        type: "crossover",
        price: 135e3,
        originalPrice: 152e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
        specs: { engine: "1.5L Turbo", transmission: "CVT", fuelType: "Petrol", mileage: "14 km/L", seating: 5 },
        features: ["Honda Sensing", "Hands-Free Tailgate", "Panoramic Roof", "Wireless Charging"],
        colors: ["Platinum White", "Crystal Black", "Lunar Silver", "Urban Titanium"]
      },
      {
        id: "hd-3",
        name: "Pilot",
        type: "suv",
        price: 175e3,
        originalPrice: 197e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.5L V6", transmission: "10-Speed Auto", fuelType: "Petrol", mileage: "10 km/L", seating: 8 },
        features: ["i-VTM4 AWD", "8 Seats", "CabinWatch", "Rear Entertainment"],
        colors: ["Platinum White", "Crystal Black", "Sonic Gray", "Radiant Red"]
      },
      {
        id: "hd-4",
        name: "Civic",
        type: "sedan",
        price: 85e3,
        originalPrice: 95e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop",
        specs: { engine: "1.5L Turbo", transmission: "CVT", fuelType: "Petrol", mileage: "17 km/L", seating: 5 },
        features: ["Honda Sensing", "Bose Audio", "Wireless CarPlay", "Sunroof"],
        colors: ["Platinum White", "Crystal Black", "Meteorite Gray", "Rallye Red"]
      }
    ],
    featured: false
  },
  {
    id: "dealer-6",
    name: "Premier Motors Abu Dhabi",
    brand: "Porsche",
    location: "Yas Island, Abu Dhabi",
    city: "Abu Dhabi",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 156,
    currentBuyers: 6,
    requiredBuyers: 8,
    daysRemaining: 25,
    averageDiscount: 8,
    description: "The exclusive Porsche Centre in Abu Dhabi offering the complete range of sports cars and luxury SUVs with personalized service.",
    services: ["Test Drive", "Porsche Financial Services", "Trade-In", "Porsche Service", "Exclusive Manufaktur"],
    models: [
      {
        id: "pr-1",
        name: "Cayenne",
        type: "suv",
        price: 395e3,
        originalPrice: 43e4,
        discountPercentage: 8,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        specs: { engine: "3.0L V6 Turbo", transmission: "8-Speed Tiptronic", fuelType: "Petrol", mileage: "10 km/L", seating: 5 },
        features: ["Sport Chrono", "PASM", "Bose Sound", "Sport Design Package"],
        colors: ["White", "Black", "Gentian Blue", "Mahogany Metallic"]
      },
      {
        id: "pr-2",
        name: "Macan",
        type: "suv",
        price: 285e3,
        originalPrice: 31e4,
        discountPercentage: 8,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Turbo", transmission: "7-Speed PDK", fuelType: "Petrol", mileage: "11 km/L", seating: 5 },
        features: ["Sport Chrono", "PASM", "14-Way Seats", "Panoramic Roof"],
        colors: ["White", "Black", "Papaya Metallic", "Dolomite Silver"]
      },
      {
        id: "pr-3",
        name: "Panamera",
        type: "luxury",
        price: 485e3,
        originalPrice: 527e3,
        discountPercentage: 8,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        specs: { engine: "2.9L V6 Twin Turbo", transmission: "8-Speed PDK", fuelType: "Petrol", mileage: "9 km/L", seating: 4 },
        features: ["Sport Chrono", "Rear Axle Steering", "Burmester Sound", "Matrix LED"],
        colors: ["White", "Black", "Crayon", "Mamba Green"]
      }
    ],
    featured: true
  },
  {
    id: "dealer-7",
    name: "Al Tayer Land Rover",
    brand: "Land Rover",
    location: "Sheikh Zayed Road, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 234,
    currentBuyers: 9,
    requiredBuyers: 12,
    daysRemaining: 20,
    averageDiscount: 10,
    description: "The official Land Rover dealer offering the complete range of luxury SUVs known for their capability and refinement.",
    services: ["Test Drive", "Land Rover Finance", "Trade-In", "Service Center", "Accessories"],
    models: [
      {
        id: "lr-1",
        name: "Range Rover",
        type: "luxury",
        price: 55e4,
        originalPrice: 611e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Inline-6 MHEV", transmission: "8-Speed Auto", fuelType: "Mild Hybrid", mileage: "8 km/L", seating: 5 },
        features: ["Terrain Response", "Meridian Sound", "Executive Class Seats", "Air Suspension"],
        colors: ["Fuji White", "Santorini Black", "Charente Gray", "Carpathian Gray"]
      },
      {
        id: "lr-2",
        name: "Range Rover Sport",
        type: "suv",
        price: 42e4,
        originalPrice: 467e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Inline-6 MHEV", transmission: "8-Speed Auto", fuelType: "Mild Hybrid", mileage: "9 km/L", seating: 5 },
        features: ["Dynamic Response Pro", "Meridian Sound", "ClearSight Mirror", "Pixel LED"],
        colors: ["Fuji White", "Santorini Black", "Varesine Blue", "Giola Green"]
      },
      {
        id: "lr-3",
        name: "Defender",
        type: "suv",
        price: 295e3,
        originalPrice: 328e3,
        discountPercentage: 10,
        image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=600&fit=crop",
        specs: { engine: "3.0L Inline-6 MHEV", transmission: "8-Speed Auto", fuelType: "Mild Hybrid", mileage: "10 km/L", seating: 6 },
        features: ["Terrain Response 2", "Wade Sensing", "Meridian Sound", "ClearSight Ground View"],
        colors: ["Fuji White", "Santorini Black", "Pangea Green", "Gondwana Stone"]
      }
    ],
    featured: false
  },
  {
    id: "dealer-8",
    name: "Audi Abu Dhabi",
    brand: "Audi",
    location: "Mussafah, Abu Dhabi",
    city: "Abu Dhabi",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 189,
    currentBuyers: 10,
    requiredBuyers: 14,
    daysRemaining: 16,
    averageDiscount: 11,
    description: "The official Audi dealer in Abu Dhabi offering the complete range of vehicles with Vorsprung durch Technik.",
    services: ["Test Drive", "Audi Finance", "Trade-In", "Service Center", "Audi Sport"],
    models: [
      {
        id: "au-1",
        name: "Q7",
        type: "suv",
        price: 285e3,
        originalPrice: 32e4,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "3.0L V6 TFSI", transmission: "8-Speed Tiptronic", fuelType: "Petrol", mileage: "12 km/L", seating: 7 },
        features: ["quattro", "Virtual Cockpit", "Matrix LED", "Bang & Olufsen"],
        colors: ["Glacier White", "Mythos Black", "Navarra Blue", "Samurai Gray"]
      },
      {
        id: "au-2",
        name: "A6",
        type: "sedan",
        price: 225e3,
        originalPrice: 253e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "2.0L TFSI", transmission: "7-Speed S tronic", fuelType: "Petrol", mileage: "14 km/L", seating: 5 },
        features: ["quattro", "MMI Touch", "S line", "Bang & Olufsen"],
        colors: ["Glacier White", "Mythos Black", "Floret Silver", "Firmament Blue"]
      },
      {
        id: "au-3",
        name: "Q5",
        type: "crossover",
        price: 215e3,
        originalPrice: 242e3,
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "2.0L TFSI", transmission: "7-Speed S tronic", fuelType: "Petrol", mileage: "13 km/L", seating: 5 },
        features: ["quattro", "Virtual Cockpit Plus", "Matrix LED", "Panoramic Roof"],
        colors: ["Glacier White", "Mythos Black", "Navarra Blue", "Manhattan Gray"]
      }
    ],
    featured: false
  },
  {
    id: "dealer-9",
    name: "Hyundai UAE",
    brand: "Hyundai",
    location: "Al Quoz, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 523,
    currentBuyers: 28,
    requiredBuyers: 35,
    daysRemaining: 8,
    averageDiscount: 14,
    description: "The official Hyundai dealer offering excellent value vehicles with advanced features and comprehensive warranty.",
    services: ["Test Drive", "Hyundai Finance", "Trade-In", "Service Center", "5-Year Warranty"],
    models: [
      {
        id: "hy-1",
        name: "Tucson",
        type: "crossover",
        price: 95e3,
        originalPrice: 11e4,
        discountPercentage: 14,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
        specs: { engine: "2.0L Petrol", transmission: "6-Speed Auto", fuelType: "Petrol", mileage: "14 km/L", seating: 5 },
        features: ["SmartSense", "Panoramic Roof", "Wireless CarPlay", "Ventilated Seats"],
        colors: ["Polar White", "Phantom Black", "Amazon Gray", "Teal"]
      },
      {
        id: "hy-2",
        name: "Santa Fe",
        type: "suv",
        price: 135e3,
        originalPrice: 157e3,
        discountPercentage: 14,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop",
        specs: { engine: "2.5L Turbo", transmission: "8-Speed DCT", fuelType: "Petrol", mileage: "11 km/L", seating: 7 },
        features: ["HTRAC AWD", "7 Seats", "Remote Smart Parking", "Harman Kardon"],
        colors: ["Polar White", "Abyss Black", "Shimmering Silver", "Lagoon Blue"]
      },
      {
        id: "hy-3",
        name: "Sonata",
        type: "sedan",
        price: 85e3,
        originalPrice: 99e3,
        discountPercentage: 14,
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop",
        specs: { engine: "2.5L Petrol", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "15 km/L", seating: 5 },
        features: ["SmartSense", "Bose Audio", "Digital Key", "Remote Start"],
        colors: ["Polar White", "Phantom Black", "Shimmering Silver", "Flame Red"]
      }
    ],
    featured: false
  },
  {
    id: "dealer-10",
    name: "Lexus Dubai",
    brand: "Lexus",
    location: "Sheikh Zayed Road, Dubai",
    city: "Dubai",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 267,
    currentBuyers: 11,
    requiredBuyers: 15,
    daysRemaining: 19,
    averageDiscount: 9,
    description: "Experience amazing with Lexus - the luxury division of Toyota offering unparalleled craftsmanship and reliability.",
    services: ["Test Drive", "Lexus Financial Services", "Trade-In", "Lexus Service", "Lexus Enform"],
    models: [
      {
        id: "lx-1",
        name: "LX 600",
        type: "luxury",
        price: 42e4,
        originalPrice: 462e3,
        discountPercentage: 9,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "3.5L V6 Twin Turbo", transmission: "10-Speed Auto", fuelType: "Petrol", mileage: "8 km/L", seating: 7 },
        features: ["Crawl Control", "Multi-Terrain Select", "Mark Levinson Audio", "Executive Package"],
        colors: ["Sonic White", "Black", "Nori Green", "Incognito"]
      },
      {
        id: "lx-2",
        name: "RX 350",
        type: "crossover",
        price: 245e3,
        originalPrice: 269e3,
        discountPercentage: 9,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "2.4L Turbo", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "12 km/L", seating: 5 },
        features: ["Lexus Safety System+", "Mark Levinson Audio", "Panoramic Roof", "Head-Up Display"],
        colors: ["Sonic White", "Caviar", "Atomic Silver", "Nori Green"]
      },
      {
        id: "lx-3",
        name: "ES 350",
        type: "sedan",
        price: 195e3,
        originalPrice: 214e3,
        discountPercentage: 9,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        specs: { engine: "3.5L V6", transmission: "8-Speed Auto", fuelType: "Petrol", mileage: "13 km/L", seating: 5 },
        features: ["Lexus Safety System+", "Mark Levinson Audio", "F SPORT Handling", "Premium Interior"],
        colors: ["Sonic White", "Caviar", "Atomic Silver", "Matador Red"]
      }
    ],
    featured: false
  }
];
const testimonials = [
  {
    id: "test-1",
    name: "Ahmed Al Maktoum",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    role: "Property Buyer",
    content: "Saved over AED 100,000 on my dream apartment in Marina. The group buying concept is brilliant and the process was seamless.",
    savings: 105e3,
    type: "property"
  },
  {
    id: "test-2",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    role: "Car Buyer",
    content: "Bought my Fortuner from the Toyota group deal. Amazing discount and met great people in the buying group who are now friends!",
    savings: 23e3,
    type: "car"
  },
  {
    id: "test-3",
    name: "Mohammed Rahman",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    role: "Property Investor",
    content: "As an investor, the bulk discount significantly improved my ROI. Already joined three buying groups and looking for more.",
    savings: 45e4,
    type: "property"
  },
  {
    id: "test-4",
    name: "Lisa Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    role: "First-time Buyer",
    content: "The support team guided me through my first property purchase. Felt safe knowing I was buying with a group.",
    savings: 67e3,
    type: "property"
  }
];
const buyingGroups = [
  {
    id: "group-1",
    name: "Marina Luxury Group",
    type: "property",
    itemId: "prop-1",
    members: 8,
    maxMembers: 12,
    status: "open",
    createdAt: "2024-01-15"
  },
  {
    id: "group-2",
    name: "Toyota Family Buyers",
    type: "dealership",
    itemId: "dealer-1",
    members: 18,
    maxMembers: 25,
    status: "open",
    createdAt: "2024-01-20"
  },
  {
    id: "group-3",
    name: "BMW Enthusiasts Dubai",
    type: "dealership",
    itemId: "dealer-2",
    members: 12,
    maxMembers: 15,
    status: "open",
    createdAt: "2024-01-22"
  }
];
function formatPrice(price) {
  return `AED ${price.toLocaleString()}`;
}
function formatNumber(num) {
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(0)}K`;
  }
  return num.toLocaleString();
}
const stats = {
  totalUsers: 12500,
  totalSavings: 45e6,
  activeGroups: 342,
  completedDeals: 1250,
  averageSavings: 15
};
const faqs = [
  {
    question: "How does group buying work?",
    answer: "Group buying allows multiple buyers to pool together to negotiate better prices. You join a buying group for a property or dealership, and once the group reaches the target size, we negotiate bulk discounts with developers or dealers. Each member still owns their purchase individually."
  },
  {
    question: "Do I own 100% of what I buy?",
    answer: "Yes, absolutely! Unlike fractional ownership, you own 100% of your property or car. Group buying is only about getting better prices through collective bargaining power - ownership is completely individual."
  },
  {
    question: "What's the typical discount I can expect?",
    answer: "Discounts vary based on the group size and the seller, but typically range from 5% to 20%. Properties often see 8-15% savings, while cars can see 5-12% off the retail price."
  },
  {
    question: "How long does it take to complete a group purchase?",
    answer: "It depends on how quickly the group fills. Some popular groups fill within a few days, while others may take 2-4 weeks. Once filled, the negotiation and purchase process typically takes 2-6 weeks."
  },
  {
    question: "Is my money safe?",
    answer: "Yes. Your funds are held in escrow until the deal is finalized. If the group doesn't reach its target or the deal falls through, your money is fully refunded."
  },
  {
    question: "Can I choose any car model at a dealership?",
    answer: "Yes! When you join a dealership group, you can select any available model from that dealership. For example, at a Toyota dealership group, you might choose a Hilux while another member picks a Fortuner."
  }
];
export {
  buyingGroups,
  dealerships,
  faqs,
  formatNumber,
  formatPrice,
  properties,
  stats,
  testimonials
};
