
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Dog, 
  Users, 
  History, 
  CircleDollarSign, 
  Package, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Animais', icon: Dog, path: '/animals' },
    { name: 'Proprietários', icon: Users, path: '/owners' },
    { name: 'Financeiro', icon: CircleDollarSign, path: '/finance' },
    { name: 'Estoque', icon: Package, path: '/inventory' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-emerald-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Dog className="w-6 h-6" />
          <h1 className="font-bold text-lg">VetMaster Pro</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Dog className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-xl text-white">VetMaster</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive(item.path) 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.clinicName}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Quick Action Button (Floating on Mobile) */}
      <Link 
        to="/animals/new"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-700 transition-transform active:scale-90 z-30"
      >
        <PlusCircle size={28} />
      </Link>
    </div>
  );
};

export default Layout;
