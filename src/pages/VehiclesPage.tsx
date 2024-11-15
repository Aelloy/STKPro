import { Link, useSearchParams } from 'react-router-dom';
import { VehicleList } from '../components/VehicleList';
import { useStore } from '../store/useStore';
import { PlusIcon } from '@heroicons/react/24/outline';

export function VehiclesPage() {
  const { vehicles } = useStore();
  const [searchParams] = useSearchParams();

  // Filter vehicles based on URL parameters
  let filteredVehicles = [...vehicles];
  
  const status = searchParams.get('status');
  if (status === 'available') {
    filteredVehicles = filteredVehicles.filter(v => !v.status?.startsWith('Sold'));
  }

  // Sort by price if specified
  const sort = searchParams.get('sort');
  if (sort === 'price') {
    filteredVehicles.sort((a, b) => b.purchasePrice - a.purchasePrice);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Vehicle Management</h1>
        <Link
          to="/vehicles/add"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Vehicle
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <VehicleList vehicles={filteredVehicles} />
        </div>
      </div>
    </div>
  );
}