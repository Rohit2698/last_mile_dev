import React from 'react';
import { Filter } from 'lucide-react';

interface SidebarToggleProps {
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 right-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
    >
      <Filter size={20} />
    </button>
  );
};

export default SidebarToggle; 