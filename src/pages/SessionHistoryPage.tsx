import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, XCircle, ExternalLink, Search, Filter, Download } from 'lucide-react';
import api from '../services/api';
import { Session } from '../types';
import { formatDuration, formatTime, cn } from '../utils';
import { motion } from 'motion/react';

const SessionHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/employee/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
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
          <h1 className="text-4xl font-black tracking-tight">Session History</h1>
          <p className="text-slate-500 font-medium mt-1">Review your past work sessions and uploaded progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-bold hover:bg-slate-50 transition-all">
            <Download size={18} className="text-indigo-600" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search sessions..."
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
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Start Time</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">End Time</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Work Uploaded</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((session, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={session.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                  <td className="px-8 py-5 text-sm font-black tracking-tight">
                    {new Date(session.start_time).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{formatTime(session.start_time)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">
                    {session.end_time ? formatTime(session.end_time) : (
                      <span className="flex items-center gap-1.5 text-indigo-600 font-black">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-700 dark:text-slate-300">
                    {session.duration ? formatDuration(session.duration) : '--'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      {session.work_uploaded ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={12} /> Yes
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                          <XCircle size={12} /> No
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-600 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryPage;
