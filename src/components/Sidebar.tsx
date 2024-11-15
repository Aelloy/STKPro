import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Desklog', href: '/desklog', icon: ClipboardDocumentListIcon, requirePermission: 'viewDeals' },
];

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Sources', href: '/admin/sources', icon: BuildingLibraryIcon },
  { name: 'Locations', href: '/admin/locations', icon: MapPinIcon },
];

export function Sidebar() {
  const location = useLocation();
  const { currentUser } = useStore();

  const isAdmin = currentUser?.role === 'admin';

  const filteredMainNavigation = mainNavigation.filter(item => 
    !item.requirePermission || currentUser?.permissions[item.requirePermission as keyof typeof currentUser.permissions]
  );

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <span className="text-white font-semibold text-lg">Vehicle Inventory</span>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredMainNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6',
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {isAdmin && (
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Administration</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={clsx(
                          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6',
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}

          {currentUser && (
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                  {currentUser.name[0].toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.role}</p>
                  </div>
                  {currentUser.role === 'admin' && (
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-500" aria-label="Admin" />
                  )}
                </div>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}