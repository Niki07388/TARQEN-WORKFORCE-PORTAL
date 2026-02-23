import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Upload,
  LogOut,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Session } from '../types';
import { formatDuration, cn } from '../utils';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [recentWork, setRecentWork] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const [statusRes, workRes] = await Promise.all([
        api.get('/employee/status'),
        api.get('/employee/work-history')
      ]);
      setStatus(statusRes.data);
      setRecentWork(workRes.data.slice(0, 3));
      
      if (statusRes.data.activeSession) {
        const start = new Date(statusRes.data.activeSession.start_time).getTime();
        setTimer(Math.floor((Date.now() - start) / 1000));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    let interval: any;
    if (status?.activeSession) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status?.activeSession]);

  const handleCheckIn = async () => {
    await api.post('/employee/check-in');
    fetchStatus();
  };

  const handleCheckOut = async () => {
    await api.post('/employee/check-out');
    fetchStatus();
  };

  const handleStartSession = async () => {
    await api.post('/employee/session/start');
    fetchStatus();
  };

  const handleEndSession = async () => {
    await api.post('/employee/session/end');
    fetchStatus();
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  const isSessionLong = timer > 4 * 3600; // 4 hours

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest">
                Employee Portal
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-white/80">System Online</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-lg font-medium max-w-md">
              You've completed <span className="text-white font-black">85%</span> of your weekly goal. Keep up the great work!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Local Time</p>
              <p className="text-3xl font-black">{new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calendar size={32} />
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Warning Banners */}
      {isSessionLong && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/50 flex items-center gap-4 text-amber-700 dark:text-amber-400 shadow-lg shadow-amber-500/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="font-black text-lg tracking-tight">Long Session Detected</p>
            <p className="text-sm font-medium opacity-80">Your current session has been running for over 4 hours. Please consider taking a break or uploading your work.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Attendance Status</h3>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110",
                status.checkedIn 
                  ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              )}>
                <CheckCircle2 size={24} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-black tracking-tight">{status.checkedIn ? 'Checked In' : 'Not Checked In'}</p>
              <p className="text-slate-500 font-bold text-sm">
                {status.checkInTime ? `Started at ${status.checkInTime}` : 'Ready to start your day?'}
              </p>
            </div>

            {!status.checkedIn ? (
              <button 
                onClick={handleCheckIn}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Check In Now
              </button>
            ) : (
              <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <Zap size={16} fill="currentColor" />
                You are currently active
              </div>
            )}
          </div>
        </div>

        {/* Worked Hours Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Productivity</h3>
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={24} />
            </div>
          </div>
          
          <div className="space-y-1 mb-8">
            <p className="text-3xl font-black tracking-tight">6h 45m</p>
            <p className="text-slate-500 font-bold text-sm">Daily Goal: 8h 0m</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
              <span>Progress</span>
              <span className="text-indigo-600">84%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full shadow-sm"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Active Session Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group">
          <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-8">Session Timer</h3>
          {status.activeSession ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black font-mono tracking-tighter text-indigo-600 dark:text-indigo-400">
                  {formatTimer(timer)}
                </p>
                <button 
                  onClick={handleEndSession}
                  className="w-14 h-14 rounded-2xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  <Square size={24} fill="currentColor" />
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                <Clock size={16} className="text-indigo-600" />
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Started at {new Date(status.activeSession.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:rotate-12 transition-transform">
                <Play size={32} fill="currentColor" />
              </div>
              <button 
                disabled={!status.checkedIn}
                onClick={handleStartSession}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Start New Session
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Zap className="text-amber-500" size={24} fill="currentColor" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard 
              onClick={() => navigate('/upload')}
              icon={<Upload size={24} />}
              title="Upload Work"
              desc="Document progress"
              color="bg-purple-500"
            />
            <ActionCard 
              onClick={handleCheckOut}
              icon={<LogOut size={24} />}
              title="Check Out"
              desc="End your day"
              color="bg-red-500"
              disabled={!status.checkedIn}
            />
            <ActionCard 
              onClick={() => navigate('/attendance')}
              icon={<Calendar size={24} />}
              title="History"
              desc="View attendance"
              color="bg-emerald-500"
            />
            <ActionCard 
              onClick={() => {}}
              icon={<Star size={24} />}
              title="Achievements"
              desc="View rewards"
              color="bg-amber-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <History className="text-indigo-500" size={24} />
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            {recentWork.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentWork.map((work, idx) => (
                  <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Upload size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-sm truncate">{work.project_name}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {new Date(work.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <History size={32} />
                </div>
                <p className="text-slate-500 font-bold">No recent activity found</p>
                <p className="text-xs text-slate-400 mt-1">Your work uploads will appear here</p>
              </div>
            )}
            <button 
              onClick={() => navigate('/sessions')}
              className="w-full p-4 text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border-t border-slate-100 dark:border-slate-800"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ onClick, icon, title, desc, color, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none text-left transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 group",
    )}
  >
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg transition-transform group-hover:scale-110", color)}>
      {icon}
    </div>
    <h4 className="font-black tracking-tight text-lg">{title}</h4>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{desc}</p>
  </button>
);

export default EmployeeDashboard;
