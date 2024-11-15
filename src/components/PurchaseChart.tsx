import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  subDays,
  subWeeks,
  subMonths,
  format,
  isSameDay,
  isSameWeek,
  isSameMonth
} from 'date-fns';
import { Vehicle } from '../types/inventory';

type TimeRange = 'day' | 'week' | 'month';

interface PurchaseChartProps {
  vehicles: Vehicle[];
}

export function PurchaseChart({ vehicles }: PurchaseChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  const getChartData = () => {
    const now = new Date();
    let interval: Date[];
    let formatStr: string;
    let compareFunc: (date1: Date, date2: Date) => boolean;

    switch (timeRange) {
      case 'day':
        interval = eachDayOfInterval({ start: subDays(now, 7), end: now });
        formatStr = 'MMM d';
        compareFunc = isSameDay;
        break;
      case 'week':
        interval = eachWeekOfInterval({ start: subWeeks(now, 12), end: now });
        formatStr = 'MMM d';
        compareFunc = isSameWeek;
        break;
      case 'month':
        interval = eachMonthOfInterval({ start: subMonths(now, 12), end: now });
        formatStr = 'MMM yyyy';
        compareFunc = isSameMonth;
        break;
    }

    return interval.map(date => {
      const purchasedVehicles = vehicles.filter(vehicle => 
        compareFunc(new Date(vehicle.purchaseDate), date)
      );

      const lowPriceVehicles = purchasedVehicles.filter(v => v.purchasePrice < 20000);
      const midPriceVehicles = purchasedVehicles.filter(v => v.purchasePrice >= 20000 && v.purchasePrice < 40000);
      const highPriceVehicles = purchasedVehicles.filter(v => v.purchasePrice >= 40000);

      const lowPriceValue = lowPriceVehicles.reduce((sum, v) => sum + v.purchasePrice, 0);
      const midPriceValue = midPriceVehicles.reduce((sum, v) => sum + v.purchasePrice, 0);
      const highPriceValue = highPriceVehicles.reduce((sum, v) => sum + v.purchasePrice, 0);

      return {
        date: format(date, formatStr),
        lowPriceValue: lowPriceValue / 1000, // Convert to thousands
        midPriceValue: midPriceValue / 1000,
        highPriceValue: highPriceValue / 1000,
        lowPriceCount: lowPriceVehicles.length,
        midPriceCount: midPriceVehicles.length,
        highPriceCount: highPriceVehicles.length
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalValue = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      const totalVehicles = payload.reduce((sum: number, entry: any) => {
        const countKey = entry.dataKey.replace('Value', 'Count');
        return sum + (payload[0].payload[countKey] || 0);
      }, 0);

      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Total Vehicles: {totalVehicles}
          </p>
          <p className="text-blue-600 dark:text-blue-400 mb-2">
            Total Value: ${totalValue.toLocaleString()}k
          </p>
          <div className="space-y-1">
            <p className="text-emerald-600 dark:text-emerald-400">
              Under $20k: {payload[0]?.payload.lowPriceCount || 0} vehicles (${payload[0]?.value?.toLocaleString()}k)
            </p>
            <p className="text-yellow-600 dark:text-yellow-400">
              $20k - $40k: {payload[0]?.payload.midPriceCount || 0} vehicles (${payload[1]?.value?.toLocaleString()}k)
            </p>
            <p className="text-red-600 dark:text-red-400">
              Over $40k: {payload[0]?.payload.highPriceCount || 0} vehicles (${payload[2]?.value?.toLocaleString()}k)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Purchase History</h2>
        <div className="join">
          <button 
            className={`join-item btn btn-sm ${timeRange === 'day' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTimeRange('day')}
          >
            Day
          </button>
          <button 
            className={`join-item btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`join-item btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getChartData()}
            margin={{ 
              top: 20, 
              right: 30, 
              left: 40, 
              bottom: 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'currentColor' }}
              interval="preserveStartEnd"
              tickMargin={10}
              height={60}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: 'currentColor' }}
              label={{ 
                value: 'Value (thousands $)',
                angle: -90,
                position: 'insideLeft',
                fill: 'currentColor',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="lowPriceValue"
              name="Under $20k"
              stackId="a"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="midPriceValue"
              name="$20k - $40k"
              stackId="a"
              fill="#eab308"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="highPriceValue"
              name="Over $40k"
              stackId="a"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}