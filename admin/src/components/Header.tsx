'use client';

import React from 'react';
import { RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminTab } from './Sidebar';

interface HeaderProps {
  activeTab: AdminTab;
  onRefresh: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onRefresh,
  isLoading,
  isAuthenticated,
  onLogin,
}) => {
  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Platform Master Dashboard',
      subtitle: 'Real-time operational KPIs, revenue velocity, and active user metrics (Screen 47)',
    },
    kyc: {
      title: 'Advocate Bar Verification & Compliance Queue',
      subtitle: 'Inspect Bar Council enrollment, court certificates, and verify incoming advocates (Screen 49)',
    },
    users: {
      title: 'User & Advocate Directory',
      subtitle: 'Manage client accounts, advocate credentials, block/unblock permissions, and roles (Screen 48)',
    },
    scoring: {
      title: 'Advocate Quality & Performance Scoring',
      subtitle: 'Ratings breakdown, completion percentages, response SLAs, and quality metrics (Screen 50)',
    },
    consultations: {
      title: 'Consultations & Escrow Oversight',
      subtitle: 'Monitor all live Agora rooms, scheduled sessions, fees, and appointment statuses (Screen 51)',
    },
    finance: {
      title: 'Financial Escrow & Revenue Ledger',
      subtitle: 'Gross Merchandise Value, 15% platform take-rate, GST collections, and escrow holdings (Screen 52)',
    },
    payouts: {
      title: 'Advocate Payout Approvals & Settlements',
      subtitle: 'Process bank withdrawal requests with automated IMPS/NEFT UTR generation (Screen 53)',
    },
    drafting: {
      title: 'Document Drafting Directory & Catalog',
      subtitle: 'Manage statutory legal templates, turn-around SLAs, and drafting orders queue (Screen 54)',
    },
    disputes: {
      title: 'Dispute Arbitration & Refund Panel',
      subtitle: 'Arbitrate client disputes, inspect call logs, and issue full or partial escrow refunds (Screen 55)',
    },
    categories: {
      title: 'Legal Category & Specialization Engine',
      subtitle: 'Manage 11 primary legal domains, sub-specialities, and algorithm search weights (Screen 56)',
    },
    settings: {
      title: 'Platform Configuration & System Settings',
      subtitle: 'Configure commission %, GST rates, consultation buffer times, and maintenance mode (Screen 57)',
    },
    audit: {
      title: 'Platform Security & Regulatory Audit Trail',
      subtitle: 'Immutable system audit logs, administrative actions, and compliance data export (Screen 58)',
    },
  };

  const current = titles[activeTab] || { title: 'Admin Console', subtitle: 'Platform Operations' };

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">{current.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>API Connected: Port 5000</span>
        </div>

        {/* Auth Button */}
        {!isAuthenticated ? (
          <button
            onClick={onLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
          >
            <AlertCircle size={14} />
            <span>Dev 1-Click SuperAdmin Login</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs">
            <CheckCircle2 size={14} />
            <span>Authenticated</span>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition disabled:opacity-50"
        >
          <RotateCw size={14} className={isLoading ? 'animate-spin text-blue-400' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
};
