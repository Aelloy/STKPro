import { useNavigate, useParams } from 'react-router-dom';
import { VehicleForm } from '../components/VehicleForm';
import { useStore } from '../store/useStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { VehicleFormData } from '../types/inventory';
import { useEffect } from 'react';

export function EditVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { vehicles, updateVehicle, currentUser } = useStore();
  const vehicle = vehicles.find(v => v.id === id);

  useEffect(() => {
    if (!currentUser?.permissions.editVehicles) {
      navigate('/vehicles');
    }
  }, [currentUser, navigate]);

  if (!vehicle) {
    return null;
  }

  const handleSubmit = (data: VehicleFormData) => {
    if (id) {
      updateVehicle(id, data);
      navigate('/vehicles');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/vehicles')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Back to Vehicles
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Vehicle</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <VehicleForm onSubmit={handleSubmit} initialData={vehicle} />
        </div>
      </div>
    </div>
  );
}