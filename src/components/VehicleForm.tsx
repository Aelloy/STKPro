import { useState, useEffect } from 'react';
import { VehicleFormData } from '../types/inventory';
import { useStore } from '../store/useStore';

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
}

export function VehicleForm({ onSubmit, initialData }: VehicleFormProps) {
  const { users, sources, locations } = useStore();
  const [formData, setFormData] = useState<VehicleFormData>(() => initialData || {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    purchaseDate: new Date(),
    purchasePrice: 0,
    buyer: '',
    source: {
      location: '',
      subCategory: ''
    }
  });

  const [selectedSource, setSelectedSource] = useState(initialData?.source.location || '');
  const buyers = users.filter(user => user.role === 'buyer' || user.role === 'admin');
  const subCategories = sources.find(s => s.location === selectedSource)?.subCategories || [];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedSource(initialData.source.location);
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedSource) {
      setFormData(prev => ({
        ...prev,
        source: {
          ...prev.source,
          location: selectedSource,
          subCategory: prev.source.subCategory && subCategories.includes(prev.source.subCategory) 
            ? prev.source.subCategory 
            : ''
        }
      }));
    }
  }, [selectedSource, subCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        purchaseDate: new Date(),
        purchasePrice: 0,
        buyer: '',
        source: {
          location: '',
          subCategory: ''
        }
      });
      setSelectedSource('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.make}
            onChange={e => setFormData({...formData, make: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.model}
            onChange={e => setFormData({...formData, model: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.year}
            onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VIN</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.vin}
            onChange={e => setFormData({...formData, vin: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.purchaseDate instanceof Date 
              ? formData.purchaseDate.toISOString().split('T')[0]
              : new Date(formData.purchaseDate).toISOString().split('T')[0]
            }
            onChange={e => setFormData({...formData, purchaseDate: new Date(e.target.value)})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Price</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.purchasePrice}
            onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buyer</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.buyer}
            onChange={e => setFormData({...formData, buyer: e.target.value})}
            required
          >
            <option value="">Select a buyer</option>
            {buyers.map(buyer => (
              <option key={buyer.id} value={buyer.name}>
                {buyer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.source.location}
            onChange={e => {
              const selectedLocation = locations.find(loc => loc.name === e.target.value);
              if (selectedLocation) {
                setFormData({
                  ...formData,
                  source: {
                    ...formData.source,
                    location: selectedLocation.name
                  }
                });
              }
            }}
            required
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Location</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={selectedSource}
            onChange={e => setSelectedSource(e.target.value)}
            required
          >
            <option value="">Select a source</option>
            {sources.map(source => (
              <option key={source.id} value={source.location}>
                {source.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Sub-Category</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={formData.source.subCategory}
            onChange={e => setFormData({
              ...formData,
              source: { ...formData.source, subCategory: e.target.value }
            })}
            required
          >
            <option value="">Select a sub-category</option>
            {subCategories.map((subCategory, index) => (
              <option key={index} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {initialData ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}