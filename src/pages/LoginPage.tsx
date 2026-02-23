import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-600 text-white mb-6 shadow-2xl shadow-indigo-500/40"
          >
            <Zap size={36} fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Tarqen Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enterprise Workforce Intelligence</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-3 border border-rose-100 dark:border-rose-800/50"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-5 h-5">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-full h-full rounded-lg border-2 border-slate-200 dark:border-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                  <ShieldCheck className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Remember</span>
              </label>
              <a href="#" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-500 transition-colors">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={22} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2rem] border border-white dark:border-slate-800/50">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Demo Access</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">CTO</span>
              <span className="text-xs font-bold text-slate-500">cto@tarqen.com</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Staff</span>
              <span className="text-xs font-bold text-slate-500">employee@tarqen.com</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
