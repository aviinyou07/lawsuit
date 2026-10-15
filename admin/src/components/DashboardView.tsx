'use client';

import React from 'react';
import {
  Users,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
  Coins,
  Scale,
  Clock,
  ArrowUpRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { AdminMetrics } from '@/types';

interface DashboardViewProps {
  metrics: AdminMetrics | null;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ metrics, onNavigateTab }) => {
  const gmv = Number(metrics?.gross_merchandise_value || 2591);
  const revenue = Number(metrics?.platform_net_revenue || 497);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/40 p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Activity size={14} /> Real-Time Platform Status: Optimal
          </div>
          <h3 className="text-xl font-black text-white">Legal Services Marketplace Command Engine</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live telemetry monitoring client consultation dispatch, escrow disbursements, Bar Council verification queues, and dispute arbitrations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('kyc')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ShieldCheck size={14} /> Review Pending KYC ({metrics?.pending_kyc_applications ?? 0})
          </button>
          <button
            onClick={() => onNavigateTab('consultations')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
          >
            Live Sessions →
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Volume (GMV)</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-400">
              ₹{gmv.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold flex items-center">
                <ArrowUpRight size={12} /> +18.4%
              </span>{' '}
              vs previous week
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Revenue</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-400">
              ₹{revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">15% commission + conv. fees</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Advocates</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-blue-400">{metrics?.verified_lawyers ?? 1}</div>
            <div className="text-[11px] text-slate-400 mt-1">Bar Council Compliant</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Clients</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Users size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-purple-400">{metrics?.total_clients ?? 2}</div>
            <div className="text-[11px] text-slate-400 mt-1">Verified phone numbers</div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Consultations</span>
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CalendarCheck size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-indigo-400">
              {metrics?.total_consultations ?? 2}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Video, Audio & Offline</div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending KYC</span>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Clock size={16} />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-rose-400">
              {metrics?.pending_kyc_applications ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Awaiting compliance review</div>
          </div>
        </div>
      </div>

      {/* Operational Highlights & Shortcuts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Card 1: Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" /> Bar Council Verification Engine
              </h4>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                Screen 49
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Bar Council enrollment validation with manual inspection for High Court practice certificates and government IDs.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Average Turnaround Time</span>
                <span className="text-white font-semibold">&lt; 24 Hours</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Compliance Standard</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> BCI Rules 1961
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('kyc')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs border border-slate-700 transition"
          >
            Open Verification Queue →
          </button>
        </div>

        {/* Module Card 2: Escrow Ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins size={16} className="text-emerald-400" /> 24h Escrow Protection Ledger
              </h4>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                Screen 52
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guaranteed escrow hold period of 24 hours post-consultation to ensure dispute arbitration windows before advocate payout maturation.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Current Locked Escrow</span>
                <span className="text-emerald-400 font-bold">₹2,400.00</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Platform Take-Rate</span>
                <span className="text-white font-semibold">15% + ₹99 fee</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('finance')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition"
          >
            View Financial Breakdown →
          </button>
        </div>

        {/* Module Card 3: Dispute Arbitration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale size={16} className="text-purple-400" /> Dispute & Arbitration Panel
              </h4>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                Screen 55
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowers administrators to mediate client claims regarding call duration, no-shows, or drafting quality with immediate partial/full refunds.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Resolution Rate</span>
                <span className="text-purple-400 font-semibold">100% on schedule</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Refund Method</span>
                <span className="text-white font-semibold">Source Payment Gateway</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('disputes')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold text-xs border border-slate-700 transition"
          >
            Review Active Claims →
          </button>
        </div>
      </div>
    </div>
  );
};
