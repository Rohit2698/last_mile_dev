import React from 'react';
import { Users, Wifi } from 'lucide-react';

interface StatsBarProps {
  onlineDriversCount: number;
  activeDriversCount: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ onlineDriversCount, activeDriversCount }) => {
  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Wifi size={16} />
            <span className="font-semibold">{onlineDriversCount}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Users size={16} />
            <span className="font-semibold">{activeDriversCount}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
        </div>
      </div>
    </div>
  );
};

export default StatsBar; 