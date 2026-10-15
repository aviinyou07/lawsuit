'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Star,
  CalendarDays,
  Coins,
  ArrowDownToLine,
  FileText,
  Scale,
  FolderTree,
  Settings,
  ScrollText,
  LogOut,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'kyc'
  | 'users'
  | 'scoring'
  | 'consultations'
  | 'finance'
  | 'payouts'
  | 'drafting'
  | 'disputes'
  | 'categories'
  | 'settings'
  | 'audit';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingKycCount?: number;
  openDisputesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingKycCount = 0,
  openDisputesCount = 0,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Master Dashboard', icon: <LayoutDashboard size={18} /> },
    {
      id: 'kyc',
      label: 'Advocate KYC Queue',
      icon: <ShieldCheck size={18} />,
      badge: pendingKycCount,
    },
    { id: 'users', label: 'User Directory', icon: <Users size={18} /> },
    { id: 'scoring', label: 'Advocate Scoring', icon: <Star size={18} /> },
    { id: 'consultations', label: 'Consultations Oversight', icon: <CalendarDays size={18} /> },
    { id: 'finance', label: 'Financial Escrow Ledger', icon: <Coins size={18} /> },
    { id: 'payouts', label: 'Lawyer Payouts', icon: <ArrowDownToLine size={18} /> },
    { id: 'drafting', label: 'Document Templates', icon: <FileText size={18} /> },
    {
      id: 'disputes',
      label: 'Dispute Arbitration',
      icon: <Scale size={18} />,
      badge: openDisputesCount,
    },
    { id: 'categories', label: 'Legal Categories Tree', icon: <FolderTree size={18} /> },
    { id: 'settings', label: 'Platform Config', icon: <Settings size={18} /> },
    { id: 'audit', label: 'Security & Audit Logs', icon: <ScrollText size={18} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-screen text-slate-200">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl shadow-lg shadow-amber-900/30">
          ⚖️
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            LAWSUIT
            <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
              CONSOLE
            </span>
          </h1>
          <p className="text-[11px] font-semibold text-amber-500 tracking-wider uppercase">
            Platform Web Admin
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Marketplace Operations
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">
            SA
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Super Admin</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Level 3 Authorized
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('lawsuit_admin_token');
              window.location.reload();
            }
          }}
          title="Sign Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
