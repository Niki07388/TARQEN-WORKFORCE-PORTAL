import React, { useState } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cn } from '../utils';

const WorkUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    taskId: '',
    description: '',
    repoLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 100) {
      setError('Description must be at least 100 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const statusRes = await api.get('/employee/status');
      const sessionId = statusRes.data.activeSession?.id;
      
      if (!sessionId) {
        setError('No active session found. Please start a session before uploading work.');
        return;
      }

      await api.post('/employee/work-upload', {
        ...formData,
        sessionId
      });
      setSuccess(true);
      setFormData({ projectName: '', taskId: '', description: '', repoLink: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload work.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="w-24 h-24 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight mb-4">Work Uploaded! 🚀</h2>
        <p className="text-slate-500 mb-10 max-w-md font-medium text-lg">
          Your progress has been recorded successfully. Great job staying productive!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setSuccess(false)}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all"
          >
            Upload More
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-10 py-4 rounded-2xl font-black border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all group mb-4"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black tracking-tight">Submit Progress</h1>
          <p className="text-slate-500 font-medium mt-1">Document your achievements for the current session.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <ShieldCheck className="text-indigo-600" size={24} />
          <div className="text-left">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Compliance</p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Verified Submission</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 border border-rose-100 dark:border-rose-800/50"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  placeholder="e.g. Tarqen Portal"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Task ID</label>
                <input 
                  type="text" 
                  required
                  value={formData.taskId}
                  onChange={(e) => setFormData({...formData, taskId: e.target.value})}
                  placeholder="e.g. T-1024"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Work Description</label>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  formData.description.length < 100 ? "text-slate-400" : "text-emerald-500"
                )}>
                  {formData.description.length} / 100 min
                </span>
              </div>
              <textarea 
                required
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what you've accomplished in this session. Be specific about your contributions..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Repository Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="url" 
                    value={formData.repoLink}
                    onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
                    placeholder="https://github.com/..."
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Supporting Files</label>
                <div className="relative">
                  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="file" 
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all file:mr-4 file:py-0 file:px-0 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-transparent file:text-indigo-600 hover:file:text-indigo-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FileText size={22} />
                    Submit Work Progress
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <Zap className="text-amber-400 mb-4" size={32} fill="currentColor" />
              <h3 className="text-xl font-black tracking-tight mb-2">Pro Tip</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                Detailed descriptions help the CTO understand your impact better. Mention specific features, bug fixes, or optimizations you worked on.
              </p>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Info size={16} />
              Submission Guidelines
            </h3>
            <ul className="space-y-4">
              <GuidelineItem text="Minimum 100 characters for description" />
              <GuidelineItem text="Include Task ID for tracking" />
              <GuidelineItem text="Link relevant repositories" />
              <GuidelineItem text="Upload screenshots if applicable" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuidelineItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
      <CheckCircle2 size={12} />
    </div>
    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{text}</span>
  </li>
);

export default WorkUploadPage;
