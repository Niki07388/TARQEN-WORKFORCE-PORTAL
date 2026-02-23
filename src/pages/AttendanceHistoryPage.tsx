import React, { useState, useEffect } from 'react';
import { Calendar, Filter, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import api from '../services/api';
import { Attendance } from '../types';
import { cn } from '../utils';
import { motion } from 'motion/react';

const AttendanceHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/employee/attendance');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Attendance History</h1>
          <p className="text-slate-500 font-medium mt-1">Track your daily check-in and check-out records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-bold hover:bg-slate-50 transition-all">
            <Download size={18} className="text-indigo-600" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 text-sm font-bold hover:bg-indigo-700 transition-all">
            <Calendar size={18} />
            Date Range
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by date or status..."
            className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Check-In</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Check-Out</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Total Hours</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((record, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={record.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                  <td className="px-8 py-5 text-sm font-black tracking-tight">{record.date}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{record.check_in}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{record.check_out || '--:--'}</td>
                  <td className="px-8 py-5 text-sm font-black text-indigo-600 dark:text-indigo-400">8h 15m</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      record.status === 'Present' 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" 
                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                    )}>
                      {record.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 1-10 of {history.length} results</p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-xs font-bold transition-all" disabled>
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-black">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold">3</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
