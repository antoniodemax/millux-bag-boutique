import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Home as LuHome,
  Package as LuPackage,
  Building as LuBuilding,
  Users as LuUsers,
  Box as LuBox,
  SquarePen as LuSquarePen,
  Settings as LuSettings,
  Receipt as LuReceipt,
  CreditCard as LuCreditCard,
  DollarSign as LuDollarSign,
  BarChart2 as LuBarChart2,
  PieChart as LuPieChart,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LuHome },
  { name: 'Inventory Levels', href: '/admin/inventory', icon: LuBox },
  { name: 'Stock Adjustments', href: '/admin/inventory/adjustments', icon: LuSquarePen },
  { name: 'Stock Movements', href: '/admin/inventory/movements', icon: LuBox },
  { name: 'Organizations', href: '/admin/organizations', icon: LuBuilding },
  { name: 'Branches', href: '/admin/branches', icon: LuBuilding },
  { name: 'Users', href: '/admin/users', icon: LuUsers },
  { name: 'Products', href: '/admin/products', icon: LuPackage },
  { name: 'Categories', href: '/admin/categories', icon: LuBox },
  { name: 'Units', href: '/admin/units', icon: LuPackage },
  { name: 'Registers', href: '/admin/registers', icon: LuReceipt },
  { name: 'Register Sessions', href: '/admin/registers/sessions', icon: LuCreditCard },
  { name: 'Sales', href: '/admin/sales', icon: LuDollarSign },
  { name: 'Payments', href: '/admin/payments', icon: LuCreditCard },
  { name: 'Sales Overview', href: '/admin/sales/overview', icon: LuBarChart2 },
  { name: 'Payment Methods', href: '/admin/payments/methods', icon: LuCreditCard },
  { name: 'Settings', href: '/admin/settings', icon: LuSettings },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // On tablet and below, we start collapsed to save space
      if (width < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      // On mobile, we close the sidebar by default, open via hamburger
      if (width < 640) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background/80 backdrop-blur border-r border-border/20 z-50 flex flex-col transition-transform duration-300
      {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      {typeof window !== 'undefined' && window.innerWidth < 640 && 'z-[999]'}"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-border/20">
        <div className="flex items-center space-x-2">
          <LuHome className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold text-primary">Admin</span>
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-border/20"
            aria-label="Toggle sidebar"
          >
            <LuUsers className="h-4 w-4 text-text-muted" />
          </button>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 text-text-sm font-medium rounded hover:bg-border/20
                  ${isActive ? 'bg-border/30 text-primary' : 'text-text-muted hover:text-primary'}
                  ${isCollapsed && !isActive ? 'justify-center px-2' : ''}
                `}
              >
                {isCollapsed && !isActive ? (
                  <item.icon className="h-4 w-4 text-primary" />
                ) : (
                  <>
                    <item.icon className="h-4 w-4 flex-shrink-0 text-{isActive ? 'primary' : 'text-muted'}" />
                    <span className={isCollapsed ? 'hidden' : 'block'}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-4 border-t border-border/20">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-between px-3 py-2 text-text-sm font-medium rounded hover:bg-border/20"
        >
          <span className="flex-1 text-left">Close Sidebar</span>
          <LuUsers className="h-4 w-4 text-text-muted" />
        </button>
      </div>
    </aside>
  );
};