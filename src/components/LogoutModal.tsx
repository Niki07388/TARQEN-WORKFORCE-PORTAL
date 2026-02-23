import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, LogOut, Upload, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onUpload: () => void;
  hasActiveSession: boolean;
  hasUnuploadedWork: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onUpload,
  hasActiveSession,
  hasUnuploadedWork
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2">Wait! Before you go...</h3>
              
              <div className="space-y-3 mb-6">
                {hasActiveSession && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    You still have an <span className="font-bold text-indigo-600 dark:text-indigo-400">active session</span> running. Logging out will not automatically end it.
                  </p>
                )}
                {hasUnuploadedWork && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    You haven't <span className="font-bold text-amber-600">uploaded your work</span> for the current session. It's highly recommended to document your progress before leaving.
                  </p>
                )}
                {!hasActiveSession && !hasUnuploadedWork && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Are you sure you want to log out? You've completed all your tasks for now.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {(hasActiveSession || hasUnuploadedWork) && (
                  <button
                    onClick={onUpload}
                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Upload size={18} />
                    Upload Work Now
                  </button>
                )}
                <button
                  onClick={onConfirm}
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-bold py-3 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  Confirm Logout
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-slate-500 dark:text-slate-400 text-sm font-medium hover:underline py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
