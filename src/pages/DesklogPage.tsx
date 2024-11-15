import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useSearchParams } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { DesklogEntry, DealStatus, DealType, VehicleType } from '../types/desklog';
import { format, startOfMonth } from 'date-fns';

const DEAL_STATUSES: DealStatus[] = ['Pending', 'Delivered', 'Cancelled', 'Unwound'];
const DEAL_TYPES: DealType[] = ['Retail', 'Lease', 'Fleet', 'Wholesale'];
const VEHICLE_TYPES: VehicleType[] = ['New', 'Used', 'Demo', 'Program'];

const initialFormData: Omit<DesklogEntry, 'id' | 'createdAt' | 'updatedAt'> = {
  dealStatus: 'Pending',
  dealType: 'Retail',
  vehicleType: 'New',
  rdr: '',
  dealNumber: '',
  date: new Date(),
  customer: {
    name: '',
    phone: '',
    email: ''
  },
  stockNumber: '',
  salesperson: '',
  salesManager: '',
  fiManager: '',
  frontGross: 0,
  backGross: 0,
  totalGross: 0,
  acv: 0,
  allowance: 0,
  delta: 0,
  notes: ''
};

export function DesklogPage() {
  const { currentUser, vehicles, desklogEntries, addDesklogEntry, updateDesklogEntry, deleteDesklogEntry, updateVehicleStatus } = useStore();
  const [searchParams] = useSearchParams();
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DesklogEntry | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  // Filter entries based on URL parameters
  let filteredEntries = [...desklogEntries];
  
  const status = searchParams.get('status');
  if (status) {
    filteredEntries = filteredEntries.filter(entry => entry.dealStatus === status);
  }

  const period = searchParams.get('period');
  if (period === 'month') {
    const startOfCurrentMonth = startOfMonth(new Date());
    filteredEntries = filteredEntries.filter(entry => 
      new Date(entry.date) >= startOfCurrentMonth
    );
  }

  // Get available vehicles (not sold)
  const availableVehicles = vehicles.filter(v => !v.status?.startsWith('Sold'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      await updateDesklogEntry(editingEntry.id, formData);
      setEditingEntry(null);
    } else {
      await addDesklogEntry(formData);
    }

    if (formData.dealStatus === 'Delivered') {
      await updateVehicleStatus(formData.stockNumber, `Sold - ${formData.dealType}`);
    }

    setFormData(initialFormData);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!currentUser?.permissions.deleteDeals) return;
    if (window.confirm('Are you sure you want to delete this deal?')) {
      await deleteDesklogEntry(id);
    }
  };

  const handleEdit = (entry: DesklogEntry) => {
    if (!currentUser?.permissions.editDeals) return;
    setEditingEntry(entry);
    setFormData({
      ...entry,
      date: new Date(entry.date)
    });
    setIsAdding(true);
  };

  if (!currentUser?.permissions.viewDeals) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400">You don't have permission to view deals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Desklog</h1>
        {!isAdding && currentUser?.permissions.editDeals && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Deal
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form implementation remains the same */}
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Deal #</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock #</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Total Gross</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        entry.dealStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : entry.dealStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {entry.dealStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-200">
                      {entry.dealNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.date), 'MM/dd/yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {entry.customer.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {entry.stockNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      ${entry.totalGross.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        {currentUser?.permissions.editDeals && (
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                        {currentUser?.permissions.deleteDeals && (
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}