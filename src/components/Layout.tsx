import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  History, 
  FileUp, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Sun,
  Moon,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils';
import LogoutModal from './LogoutModal';
import api from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (user?.role === 'Employee') {
        try {
          const res = await api.get('/employee/status');
          setStatus(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchStatus();
  }, [user]);

  const handleLogoutClick = () => {
    if (user?.role === 'Employee' && (status?.activeSession || !status?.checkOutTime)) {
      setIsLogoutModalOpen(true);
    } else {
      handleConfirmLogout();
    }
  };

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoToUpload = () => {
    setIsLogoutModalOpen(false);
    navigate('/upload');
  };

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Attendance', path: '/attendance', icon: Clock, color: 'text-emerald-500' },
    { name: 'Sessions', path: '/sessions', icon: History, color: 'text-amber-500' },
    { name: 'Work Upload', path: '/upload', icon: FileUp, color: 'text-purple-500' },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: BarChart3, color: 'text-indigo-500' },
    { name: 'Monitoring', path: '/admin/monitoring', icon: Users, color: 'text-pink-500' },
    { name: 'Reports', path: '/admin/reports', icon: FileUp, color: 'text-orange-500' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, color: 'text-slate-500' },
  ];

  const links = user?.role === 'CTO' ? adminLinks : employeeLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        onUpload={handleGoToUpload}
        hasActiveSession={!!status?.activeSession}
        hasUnuploadedWork={status?.activeSession && !status?.activeSession?.work_uploaded}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none",
          isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full px-3 py-4">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <BarChart3 size={24} />
              </div>
              <span className={cn("text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600", !isSidebarOpen && "hidden")}>
                TARQEN
              </span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center p-3 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                  location.pathname === link.path 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <link.icon size={22} className={cn(
                  "transition-colors duration-200",
                  location.pathname === link.path ? "text-indigo-600 dark:text-indigo-400" : cn("text-slate-400 group-hover:", link.color)
                )} />
                <span className={cn("ml-3 font-bold text-sm", !isSidebarOpen && "hidden")}>{link.name}</span>
                {location.pathname === link.path && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <div className={cn("p-4 mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50", !isSidebarOpen && "hidden")}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Support</p>
              <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Help Center</button>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full p-3 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group"
            >
              <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
              <span className={cn("ml-3 font-bold text-sm", !isSidebarOpen && "hidden")}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", isSidebarOpen ? "md:ml-64" : "md:ml-20")}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks, employees..."
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button 
                onClick={() => setIsDarkMode(false)}
                className={cn("p-2 rounded-xl transition-all", !isDarkMode ? "bg-white dark:bg-slate-700 shadow-sm text-amber-500" : "text-slate-400")}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => setIsDarkMode(true)}
                className={cn("p-2 rounded-xl transition-all", isDarkMode ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-400" : "text-slate-400")}
              >
                <Moon size={18} />
              </button>
            </div>

            <button className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 relative transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="flex items-center gap-4 pl-5 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black tracking-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
