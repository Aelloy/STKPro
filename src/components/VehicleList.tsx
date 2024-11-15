import { format } from 'date-fns';
import { Vehicle } from '../types/inventory';
import { useStore } from '../store/useStore';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface VehicleListProps {
  vehicles: Vehicle[];
}

export function VehicleList({ vehicles }: VehicleListProps) {
  const { currentUser, deleteVehicle } = useStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
    }
  };

  const canEdit = currentUser?.permissions.editVehicles;
  const canDelete = currentUser?.permissions.deleteVehicles;

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock #</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Vehicle</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">VIN</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Purchase Date</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Buyer</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Source</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              {(canEdit || canDelete) && (
                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {vehicle.stockNumber}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-200">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{vehicle.vin}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(vehicle.purchaseDate), 'MM/dd/yyyy')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  ${vehicle.purchasePrice.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{vehicle.buyer}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {vehicle.source.location} - {vehicle.source.subCategory}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    vehicle.status?.startsWith('Sold')
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {vehicle.status || 'Available'}
                  </span>
                </td>
                {(canEdit || canDelete) && (
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <Link
                          to={`/vehicles/edit/${vehicle.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                      )}
                      {canDelete && !vehicle.status?.startsWith('Sold') && (
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}