import { useState, useCallback, useMemo } from 'react';
import { DriverLocation } from '@/app/api/react-query/driverLocation';
import { 
  INITIAL_FILTERS, 
  INITIAL_SIDEBAR_STATE,
  filterDriversByStatus, 
  filterDriversByVehicleType, 
  sortDriversByRating, 
  sortDriversByLastUpdated,
  getActiveDriversCount,
  getOnlineDriversCount
} from './util';

export interface DriverMapFilters {
  status: string;
  vehicleType: string;
  sortBy: 'rating' | 'lastUpdated' | 'name';
}

export const useDriverMap = (drivers: DriverLocation[]) => {
  const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null);
  const [filters, setFilters] = useState<DriverMapFilters>({
    ...INITIAL_FILTERS,
    sortBy: 'lastUpdated'
  });
  const [showSidebar, setShowSidebar] = useState(INITIAL_SIDEBAR_STATE);

  const handleDriverSelect = useCallback((driver: DriverLocation | null) => {
    setSelectedDriver(driver);
  }, []);

  const handleFilterChange = useCallback((key: keyof DriverMapFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const applyFilters = useCallback((driversToFilter: DriverLocation[]) => {
    let filteredDrivers = [...driversToFilter];

    // Apply status filter
    if (filters.status !== 'all') {
      filteredDrivers = filterDriversByStatus(filteredDrivers, filters.status);
    }

    // Apply vehicle type filter
    if (filters.vehicleType !== 'all') {
      filteredDrivers = filterDriversByVehicleType(filteredDrivers, filters.vehicleType);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filteredDrivers = sortDriversByRating(filteredDrivers);
        break;
      case 'lastUpdated':
        filteredDrivers = sortDriversByLastUpdated(filteredDrivers);
        break;
      case 'name':
        filteredDrivers.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filteredDrivers;
  }, [filters]);

  const filteredDrivers = useMemo(() => {
    return applyFilters(drivers);
  }, [drivers, applyFilters]);

  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...INITIAL_FILTERS,
      sortBy: 'lastUpdated'
    });
  }, []);

  const activeDriversCount = useMemo(() => {
    return getActiveDriversCount(drivers);
  }, [drivers]);

  const onlineDriversCount = useMemo(() => {
    return getOnlineDriversCount(drivers);
  }, [drivers]);

  return {
    selectedDriver,
    filters,
    showSidebar,
    filteredDrivers,
    activeDriversCount,
    onlineDriversCount,
    handleDriverSelect,
    handleFilterChange,
    toggleSidebar,
    clearFilters
  };
}; 