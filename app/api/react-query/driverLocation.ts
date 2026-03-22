import { useQuery } from '@tanstack/react-query';
import { faker } from '@faker-js/faker';

// Types
export interface DriverLocation {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'motorcycle' | 'car' | 'bicycle';
  vehicleNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline' | 'busy' | 'on_delivery';
  lastUpdated: string;
  rating: number;
  totalDeliveries: number;
  isActive: boolean;
}

export interface DriverLocationResponse {
  drivers: DriverLocation[];
  totalCount: number;
  lastUpdated: string;
}

// Dummy data generator
const generateDummyDrivers = (count: number = 10): DriverLocation[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    vehicleType: faker.helpers.arrayElement(['motorcycle', 'car', 'bicycle']),
    vehicleNumber: faker.vehicle.vin(),
    currentLocation: {
      lat: faker.location.latitude({ min: 37.7, max: 37.8 }),
      lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
    },
    status: faker.helpers.arrayElement(['online', 'offline', 'busy', 'on_delivery']),
    lastUpdated: faker.date.recent().toISOString(),
    rating: Number(faker.number.float({ min: 3.5, max: 5.0 }).toFixed(1)),
    totalDeliveries: faker.number.int({ min: 10, max: 500 }),
    isActive: faker.datatype.boolean(),
  }));
};

// API functions
const fetchDriverLocations = async (): Promise<DriverLocationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const drivers = generateDummyDrivers(15);
  
  return {
    drivers,
    totalCount: drivers.length,
    lastUpdated: new Date().toISOString(),
  };
};

// React Query hooks
export const useDriverLocations = () => {
  return useQuery({
    queryKey: ['driver-locations'],
    queryFn: fetchDriverLocations,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useDriverLocation = (driverId: string) => {
  return useQuery({
    queryKey: ['driver-location', driverId],
    queryFn: async () => {
      const response = await fetchDriverLocations();
      return response.drivers.find(driver => driver.id === driverId);
    },
    enabled: !!driverId,
    refetchInterval: 15000, // Refetch every 15 seconds for individual driver
  });
}; 