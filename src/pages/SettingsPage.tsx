import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Clock, 
  Timer, 
  AlertCircle,
  ShieldCheck,
  Bell,
  Zap,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { SystemSettings } from '../types';
import { motion } from 'motion/react';
import { cn } from '../utils';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    min_daily_hours: '8',
    max_session_duration: '4',
    late_threshold: '09:15',
    auto_checkout: '19:00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.post('/admin/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure global workforce policies and thresholds.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <Lock className="text-indigo-600" size={20} />
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Admin Only Access</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Attendance Policies */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Attendance Policies</h3>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Minimum Daily Hours</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={settings.min_daily_hours}
                        onChange={(e) => setSettings({...settings, min_daily_hours: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                      />
                    </div>
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Hrs</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium ml-1">Employees flagged if below this limit.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Late Threshold Time</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="time" 
                      value={settings.late_threshold}
                      onChange={(e) => setSettings({...settings, late_threshold: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium ml-1">Check-ins after this are marked 'Late'.</p>
                </div>
              </div>
            </div>

            {/* Session & Automation */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                  <Timer size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Session & Automation</h3>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Max Session Duration</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={settings.max_session_duration}
                        onChange={(e) => setSettings({...settings, max_session_duration: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                      />
                    </div>
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Hrs</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium ml-1">Alerts trigger if session exceeds this.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Auto-Checkout Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="time" 
                      value={settings.auto_checkout}
                      onChange={(e) => setSettings({...settings, auto_checkout: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium ml-1">System auto-checkout at this time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <Bell className="text-amber-400 mb-4" size={32} fill="currentColor" />
                <h3 className="text-xl font-black tracking-tight mb-2">Notifications</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                  System settings changes are logged and will notify all relevant employees upon their next login.
                </p>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/20">
              <Zap className="mb-4" size={32} fill="currentColor" />
              <h3 className="text-xl font-black tracking-tight mb-2">Auto-Save</h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed">
                Changes are applied instantly to the database but require a manual save to propagate to active sessions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 pt-4">
          {success && (
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-600 font-black uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <ShieldCheck size={18} />
              Settings saved successfully
            </motion.span>
          )}
          <button 
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-3 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
          >
            <Save size={22} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
