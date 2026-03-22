'use client';

import React from 'react';
import { useDriverLocations } from '@/app/api/react-query/driverLocation';
import { useDriverMap } from './hook';
import MapView from './MapView';
import StatsBar from './StatsBar';
import DriverSidebar from './DriverSidebar';
import LoadingOverlay from './LoadingOverlay';
import SidebarToggle from './SidebarToggle';

const DriverMap: React.FC = () => {
  const { data, isLoading } = useDriverLocations();
  const drivers = data?.drivers || [];

  const {
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
  } = useDriverMap(drivers);

  return (
    <div className="relative">
      <MapView
        drivers={filteredDrivers}
        selectedDriver={selectedDriver}
        onDriverSelect={handleDriverSelect}
      />

      <StatsBar
        onlineDriversCount={onlineDriversCount}
        activeDriversCount={activeDriversCount}
      />

      {showSidebar && (
        <DriverSidebar
          drivers={filteredDrivers}
          filters={filters}
          onFilterChange={handleFilterChange}
          onDriverSelect={handleDriverSelect}
          onClose={toggleSidebar}
          onClearFilters={clearFilters}
        />
      )}

      {!showSidebar && (
        <SidebarToggle onToggle={toggleSidebar} />
      )}

      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
};

export default DriverMap; 