import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import api from '../services/api';
import { cn } from '../utils';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const data = [
    { name: 'Mon', hours: 45 },
    { name: 'Tue', hours: 52 },
    { name: 'Wed', hours: 48 },
    { name: 'Thu', hours: 61 },
    { name: 'Fri', hours: 55 },
    { name: 'Sat', hours: 12 },
    { name: 'Sun', hours: 8 },
  ];

  const productivityData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Live System Overview</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">Real-time</button>
          <button className="px-4 py-2 rounded-xl text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Historical</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={<Users size={24} />} 
          trend="+2 this month"
          trendUp={true}
          color="bg-indigo-500"
        />
        <MetricCard 
          title="Present Today" 
          value={stats.presentToday} 
          icon={<ShieldCheck size={24} />} 
          trend="85% attendance"
          trendUp={true}
          color="bg-emerald-500"
        />
        <MetricCard 
          title="Absent Today" 
          value={stats.absentToday} 
          icon={<Activity size={24} />} 
          trend="15% absence"
          trendUp={false}
          color="bg-rose-500"
        />
        <MetricCard 
          title="Total Hours" 
          value={`${stats.totalHoursToday}h`} 
          icon={<Clock size={24} />} 
          trend="+12% vs yesterday"
          trendUp={true}
          color="bg-amber-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black tracking-tight">Work Hours Summary</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly aggregate data</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl">
              <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-xs font-bold">Week</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400">Month</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black tracking-tight">Productivity Trends</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly performance index</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
              <Zap size={14} fill="currentColor" />
              <span>+24% Growth</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-3xl font-black tracking-tight mb-4">System Health & Compliance</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              All employee monitoring services are operating normally. 98% of employees have completed their daily check-ins within the threshold.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-4xl font-black mb-1">99.9%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uptime</p>
            </div>
            <div className="w-px h-12 bg-slate-800 self-center"></div>
            <div className="text-center">
              <p className="text-4xl font-black mb-1">12ms</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Latency</p>
            </div>
            <div className="w-px h-12 bg-slate-800 self-center"></div>
            <div className="text-center">
              <p className="text-4xl font-black mb-1">0</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Incidents</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendUp, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group"
  >
    <div className="flex items-center justify-between mb-8">
      <div className={cn("w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110", color)}>
        {icon}
      </div>
      <div className={cn(
        "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full",
        trendUp ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
      )}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">{title}</p>
    <p className="text-4xl font-black mt-2 tracking-tight">{value}</p>
  </motion.div>
);

export default AdminDashboard;
