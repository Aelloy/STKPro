import { Link } from 'react-router-dom';
import { format, startOfMonth } from 'date-fns';
import { Vehicle } from '../types/inventory';

interface DashboardStatsProps {
  vehicles: Vehicle[];
}

export function DashboardStats({ vehicles }: DashboardStatsProps) {
  const availableVehicles = vehicles.filter(v => !v.status?.startsWith('Sold'));
  const totalValue = availableVehicles.reduce((sum, vehicle) => sum + vehicle.purchasePrice, 0);
  const averagePrice = availableVehicles.length > 0 ? totalValue / availableVehicles.length : 0;

  const startOfCurrentMonth = startOfMonth(new Date());
  const soldThisMonth = vehicles.filter(v => 
    v.status?.startsWith('Sold') && 
    new Date(v.purchaseDate) >= startOfCurrentMonth
  ).length;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <Link 
        to="/vehicles?status=available" 
        className="stats shadow w-full hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="stat">
          <div className="stat-title">Available Vehicles</div>
          <div className="stat-value">{availableVehicles.length}</div>
          <div className="stat-desc">In inventory</div>
        </div>
      </Link>

      <Link 
        to="/vehicles?value=all" 
        className="stats shadow w-full hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="stat">
          <div className="stat-title">Total Value</div>
          <div className="stat-value text-lg sm:text-2xl lg:text-4xl">
            ${totalValue.toLocaleString()}
          </div>
          <div className="stat-desc">Inventory worth</div>
        </div>
      </Link>

      <Link 
        to="/vehicles?sort=price" 
        className="stats shadow w-full hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="stat">
          <div className="stat-title">Average Price</div>
          <div className="stat-value text-lg sm:text-2xl lg:text-4xl">
            ${averagePrice.toLocaleString()}
          </div>
          <div className="stat-desc">Per vehicle</div>
        </div>
      </Link>

      <Link 
        to="/desklog?status=Delivered&period=month" 
        className="stats shadow w-full hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="stat">
          <div className="stat-title">Sold This Month</div>
          <div className="stat-value">{soldThisMonth}</div>
          <div className="stat-desc">{format(startOfCurrentMonth, 'MMMM yyyy')}</div>
        </div>
      </Link>
    </div>
  );
}