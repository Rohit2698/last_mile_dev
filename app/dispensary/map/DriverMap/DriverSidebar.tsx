import React from 'react';
import { DriverLocation } from '@/app/api/react-query/driverLocation';
import { Filter, X, MapPin, Car, Bike } from 'lucide-react';
import { STATUS_OPTIONS, VEHICLE_OPTIONS, getStatusColor } from './util';
import { DriverMapFilters } from './hook';

interface DriverSidebarProps {
  drivers: DriverLocation[];
  filters: DriverMapFilters;
  onFilterChange: (key: keyof DriverMapFilters, value: string) => void;
  onDriverSelect: (driver: DriverLocation) => void;
  onClose: () => void;
  onClearFilters: () => void;
}

const DriverSidebar: React.FC<DriverSidebarProps> = ({
  drivers,
  filters,
  onFilterChange,
  onDriverSelect,
  onClose,
  onClearFilters
}) => {
  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle':
      case 'bicycle':
        return <Bike size={16} />;
      case 'car':
        return <Car size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  return (
    <div className="absolute top-4 right-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Drivers ({drivers.length})</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.vehicleType}
          onChange={(e) => onFilterChange('vehicleType', e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {VEHICLE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="lastUpdated">Last Updated</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>

        <button
          onClick={onClearFilters}
          className="w-full p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
        >
          Clear Filters
        </button>
      </div>

      <div className="space-y-2">
        {drivers.map((driver: DriverLocation) => (
          <div
            key={driver.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4"
            style={{ borderLeftColor: getStatusColor(driver.status) }}
            onClick={() => onDriverSelect(driver)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              {driver.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{driver.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{driver.status}</p>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              {getVehicleIcon(driver.vehicleType)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverSidebar; 