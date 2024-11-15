import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { StockModal } from '../components/StockModal';
import { PurchaseChart } from '../components/PurchaseChart';
import { DashboardStats } from '../components/DashboardStats';

export function Dashboard() {
  const { vehicles, stockEntries, addStockEntry } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter out sold vehicles for recent vehicles list
  const availableVehicles = vehicles.filter(v => !v.status?.startsWith('Sold'));
  const recentVehicles = [...availableVehicles]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-4">
      {/* Stats */}
      <DashboardStats vehicles={vehicles} />

      {/* Purchase History Chart */}
      <div className="my-8">
        <PurchaseChart vehicles={availableVehicles} />
      </div>

      {/* Recent Vehicles */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Available Vehicles</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Purchase Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="whitespace-normal break-words">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </td>
                      <td>{format(new Date(vehicle.purchaseDate), 'MM/dd/yyyy')}</td>
                      <td>${vehicle.purchasePrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Stock Numbers</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Stock Number</th>
                    <th>Created Date</th>
                    <th>Device ID</th>
                  </tr>
                </thead>
                <tbody>
                  {stockEntries.slice(0, 5).map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.stockNumber}</td>
                      <td>{format(entry.createdAt, 'MM/dd/yyyy')}</td>
                      <td className="truncate max-w-[150px]">{entry.deviceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                Add New Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addStockEntry}
      />
    </div>
  );
}