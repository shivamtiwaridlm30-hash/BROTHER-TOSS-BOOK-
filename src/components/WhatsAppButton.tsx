import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall } from 'lucide-react';
import { Language, User } from '../types';

interface WhatsAppButtonProps {
  user: User;
  lang: Language;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ user, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: `Hello! Welcome to Brother Toss Book 24x7 Official Support. How can we help you today with your deposit, withdrawal, or toss markets?`,
      time: 'Just now'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const userText = msg.trim();
    setMsg('');

    const newHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setChatHistory(newHistory);

    // Automated instant reply
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'agent' as const,
          text: `Thank you! Support operator has received your inquiry. Please stand by 1 minute with your User ID (@${user.username}).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-40 select-none">
      {/* WhatsApp Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-24px)] sm:w-96 max-w-sm right-0 bg-[#071324] border border-emerald-500/60 rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-100 flex flex-col animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-3.5 flex items-center justify-between text-white border-b border-emerald-600/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                💬
              </div>
              <div>
                <div className="font-bold text-sm">Brother Toss Book Help</div>
                <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online 24x7
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 space-y-2 h-64 overflow-y-auto bg-[#050e1a]">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed text-xs ${
                    item.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-[#102344] text-slate-200 border border-blue-900 rounded-bl-none'
                  }`}
                >
                  {item.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2 bg-[#0a1830] border-t border-blue-900/60 flex items-center gap-1.5">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message to WhatsApp support..."
              className="flex-1 px-3 py-2 bg-[#06101f] border border-blue-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button matching screenshot! */}
      <button
        id="whatsapp-support-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center ring-4 ring-emerald-400/30"
        title="24/7 WhatsApp Support"
      >
        <span className="text-2xl leading-none">
          💬
        </span>
        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-black animate-pulse">
          24/7
        </span>
      </button>
    </div>
  );
};
