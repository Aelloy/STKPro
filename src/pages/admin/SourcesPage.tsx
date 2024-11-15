import { useState } from 'react';
import { useStore } from '../../store/useStore';

export function SourcesPage() {
  const { sources, addSource } = useStore();
  const [formData, setFormData] = useState({
    location: '',
    subCategories: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSource({
      location: formData.location,
      subCategories: formData.subCategories.filter(Boolean)
    });
    setFormData({ location: '', subCategories: [''] });
  };

  const handleAddSubCategory = () => {
    setFormData({
      ...formData,
      subCategories: [...formData.subCategories, '']
    });
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const newSubCategories = [...formData.subCategories];
    newSubCategories[index] = value;
    setFormData({
      ...formData,
      subCategories: newSubCategories
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Source Management</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Add New Source</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub-Categories</label>
              {formData.subCategories.map((subCategory, index) => (
                <div key={index} className="mt-2">
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={subCategory}
                    onChange={e => handleSubCategoryChange(index, e.target.value)}
                    placeholder={`Sub-category ${index + 1}`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubCategory}
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                + Add Sub-category
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Add Source
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Sources List</h2>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Sub-Categories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sources.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-200">{source.location}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        {source.subCategories.map((subCategory, index) => (
                          <span
                            key={index}
                            className="inline-flex rounded-full bg-gray-100 dark:bg-gray-700 px-2 text-xs font-semibold leading-5 text-gray-800 dark:text-gray-200"
                          >
                            {subCategory}
                          </span>
                        ))}
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