import React from 'react';
import { X, Bell, CheckCheck, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppNotification, Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  lang: Language;
  onMarkAllRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  lang,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="notification-modal-card"
        className="w-full max-w-lg bg-[#0c1b33] border border-blue-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-[#0c1b33] p-4 sm:p-5 border-b border-blue-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Chakra_Petch'] text-white">
                {getTranslation(lang, 'notifications')}
              </h2>
              <p className="text-xs text-slate-400">
                Official announcements & toss updates from Brother Toss Book
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-[11px] text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'markAllRead')}</span>
            </button>
            <button 
              id="close-notifications-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications at this moment.
            </div>
          ) : (
            notifications.map((n) => {
              const title = n.titleEn || n.titleHi;
              const msg = n.messageEn || n.messageHi;
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs ${
                    n.read
                      ? 'bg-[#081528] border-blue-950 text-slate-300'
                      : 'bg-[#0e2242] border-blue-700/60 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        n.read ? 'bg-slate-600' : 'bg-amber-400 animate-pulse'
                      }`} />
                      <h4 className="font-bold text-sm text-white">
                        {title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed pl-4">
                    {msg}
                  </p>

                  {n.broadcast && (
                    <div className="mt-2 pl-4 flex items-center gap-1.5 text-[10px] text-amber-400/90 font-medium">
                      <Sparkles className="w-3 h-3" /> Broadcasted to all Brother Toss Book members
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
