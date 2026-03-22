import { DriverLocation } from '@/app/api/react-query/driverLocation';


export const INITIAL_FILTERS = {
  status: 'all',
  vehicleType: 'all'
} as const;

export const INITIAL_SIDEBAR_STATE = true;


export const MAP_CONFIG = {
  containerStyle: { width: '100%', height: '100vh' },
  center: { lat: 37.7749, lng: -122.4194 },
  zoom: 12,
  options: {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
  }
} as const;


export const STATUS_CONFIG = {
  online: {
    color: '#10B981',
    label: 'Online',
    description: 'Driver is available for deliveries'
  },
  offline: {
    color: '#6B7280',
    label: 'Offline',
    description: 'Driver is not available'
  },
  busy: {
    color: '#F59E0B',
    label: 'Busy',
    description: 'Driver is currently busy'
  },
  on_delivery: {
    color: '#3B82F6',
    label: 'On Delivery',
    description: 'Driver is currently on a delivery'
  }
} as const;


export const VEHICLE_CONFIG = {
  motorcycle: {
    label: 'Motorcycle',
    icon: 'bike'
  },
  car: {
    label: 'Car',
    icon: 'car'
  },
  bicycle: {
    label: 'Bicycle',
    icon: 'bike'
  }
} as const;


export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'busy', label: 'Busy' },
  { value: 'on_delivery', label: 'On Delivery' }
] as const;

export const VEHICLE_OPTIONS = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'car', label: 'Car' },
  { value: 'bicycle', label: 'Bicycle' }
] as const;


export const getStatusColor = (status: string): string => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#6B7280';
};

export const getStatusLabel = (status: string): string => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || 'Unknown';
};

export const getVehicleLabel = (vehicleType: string): string => {
  return VEHICLE_CONFIG[vehicleType as keyof typeof VEHICLE_CONFIG]?.label || 'Unknown';
};

export const formatLastUpdated = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const filterDriversByStatus = (drivers: DriverLocation[], status: string): DriverLocation[] => {
  if (!status || status === 'all') {
    return drivers;
  }
  return drivers.filter(driver => driver.status === status);
};

export const filterDriversByVehicleType = (drivers: DriverLocation[], vehicleType: string): DriverLocation[] => {
  if (!vehicleType || vehicleType === 'all') {
    return drivers;
  }
  return drivers.filter(driver => driver.vehicleType === vehicleType);
};

export const sortDriversByRating = (drivers: DriverLocation[]): DriverLocation[] => {
  return [...drivers].sort((a, b) => b.rating - a.rating);
};

export const sortDriversByLastUpdated = (drivers: DriverLocation[]): DriverLocation[] => {
  return [...drivers].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
};

export const getActiveDriversCount = (drivers: DriverLocation[]): number => {
  return drivers.filter(driver => driver.isActive).length;
};

export const getOnlineDriversCount = (drivers: DriverLocation[]): number => {
  return drivers.filter(driver => driver.status === 'online').length;
};

export const generateMarkerIcon = (driver: DriverLocation): string => {
  const statusColor = getStatusColor(driver.status);
  const initial = driver.name.charAt(0);
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${statusColor}" stroke="white" stroke-width="2"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `)}`;
}; 