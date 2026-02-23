import React, { useState } from 'react';
import { 
  FileDown, 
  Calendar, 
  BarChart, 
  PieChart, 
  Download,
  CheckCircle2,
  Zap,
  Clock,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';

const ReportsPage: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('daily');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">System Reports</h1>
          <p className="text-slate-500 font-medium mt-1">Generate and export workforce productivity data.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
          <Zap className="text-amber-500" size={20} fill="currentColor" />
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Real-time Analytics Enabled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ReportTypeCard 
          title="Daily Report" 
          description="Detailed attendance and session logs for today."
          icon={<Calendar size={24} />}
          active={reportType === 'daily'}
          onClick={() => setReportType('daily')}
          color="indigo"
        />
        <ReportTypeCard 
          title="Weekly Summary" 
          description="Aggregated productivity metrics for the current week."
          icon={<BarChart size={24} />}
          active={reportType === 'weekly'}
          onClick={() => setReportType('weekly')}
          color="emerald"
        />
        <ReportTypeCard 
          title="Monthly Analysis" 
          description="Long-term trends and employee performance overview."
          icon={<PieChart size={24} />}
          active={reportType === 'monthly'}
          onClick={() => setReportType('monthly')}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileText size={18} />
              </div>
              Report Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold" />
                  <input type="date" className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Export Format</label>
                <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold appearance-none">
                  <option>CSV (Spreadsheet)</option>
                  <option>PDF (Document)</option>
                  <option>JSON (Data)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
            >
              {generating ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FileDown size={22} />
              )}
              {generating ? 'Generating Report...' : 'Generate & Download Report'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock size={16} />
              Recent Reports
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {[
              { name: 'monthly_productivity_feb.csv', date: 'Feb 22, 2026', size: '2.4 MB' },
              { name: 'weekly_summary_w8.pdf', date: 'Feb 20, 2026', size: '1.1 MB' },
              { name: 'daily_logs_feb_19.csv', date: 'Feb 19, 2026', size: '0.8 MB' }
            ].map((report, idx) => (
              <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 transition-all">
                    <Download size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight truncate max-w-[150px]">{report.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.date} • {report.size}</p>
                  </div>
                </div>
                <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Get</button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center">
            <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">View All History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportTypeCard = ({ title, description, icon, active, onClick, color }: any) => {
  const colorClasses: any = {
    indigo: active ? "bg-indigo-600" : "bg-indigo-50 text-indigo-600",
    emerald: active ? "bg-emerald-600" : "bg-emerald-50 text-emerald-600",
    violet: active ? "bg-violet-600" : "bg-violet-50 text-violet-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all relative overflow-hidden group",
        active 
          ? `bg-${color}-50 dark:bg-${color}-900/20 border-${color}-600 dark:border-${color}-400 shadow-xl shadow-${color}-500/10` 
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:scale-110"
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
      
      {active && (
        <div className="absolute top-6 right-6">
          <CheckCircle2 className="text-indigo-600" size={20} />
        </div>
      )}
    </motion.div>
  );
};

export default ReportsPage;
