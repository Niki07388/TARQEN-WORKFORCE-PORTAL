import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Briefcase, 
  Download, 
  Mail, 
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { cn, formatDuration, formatTime } from '../utils';

const EmployeeDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attendance' | 'sessions' | 'work'>('attendance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/employees/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!data) return <div>Employee not found</div>;

  const { employee, attendance, sessions, work } = data;

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/admin/monitoring')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Monitoring
      </button>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-indigo-500/30">
          {employee.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight">{employee.name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Mail size={16} />
              {employee.email}
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Shield size={16} />
              {employee.role}
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all">
          <Download size={18} />
          Export History
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
        <TabButton active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={<Calendar size={18} />} label="Attendance" />
        <TabButton active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} icon={<Clock size={18} />} label="Sessions" />
        <TabButton active={activeTab === 'work'} onClick={() => setActiveTab('work')} icon={<Briefcase size={18} />} label="Work Uploads" />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        {activeTab === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Check-In</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Check-Out</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendance.map((record: any) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="px-8 py-5 font-bold">{record.date}</td>
                    <td className="px-8 py-5 text-slate-600 dark:text-slate-400">{record.check_in}</td>
                    <td className="px-8 py-5 text-slate-600 dark:text-slate-400">{record.check_out || '--:--'}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                        record.status === 'Present' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                      )}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Work Uploaded</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map((session: any) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="px-8 py-5 font-bold">{new Date(session.start_time).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-mono text-indigo-600 dark:text-indigo-400">
                      {session.duration ? formatDuration(session.duration) : 'Active'}
                    </td>
                    <td className="px-8 py-5">
                      {session.work_uploaded ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <button className="text-indigo-600 hover:underline text-sm font-bold">View Log</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'work' && (
          <div className="p-8 space-y-6">
            {work.map((item: any) => (
              <div key={item.id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-black tracking-tight">{item.project_name}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Task ID: {item.task_id}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{item.description}</p>
                {item.repo_link && (
                  <a href={item.repo_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                    <ExternalLink size={16} />
                    View Repository
                  </a>
                )}
              </div>
            ))}
            {work.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium">No work uploads found for this employee.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
      active ? "bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
    )}
  >
    {icon}
    {label}
  </button>
);

export default EmployeeDetailView;
