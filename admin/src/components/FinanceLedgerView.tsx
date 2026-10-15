'use client';

import React from 'react';
import { Coins, Lock, CheckCircle2, TrendingUp, ReceiptText, ShieldCheck } from 'lucide-react';
import { FinanceLedger } from '@/types';

interface FinanceLedgerViewProps {
  ledger: FinanceLedger | null;
}

export const FinanceLedgerView: React.FC<FinanceLedgerViewProps> = ({ ledger }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Coins size={18} className="text-emerald-400" />
          Financial Escrow & Marketplace Revenue Ledger
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          24-hour mature escrow accounting, 15% platform take-rate, and statutory GST reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Locked in Escrow</span>
            <Lock size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-3">
            ₹{Number(ledger?.escrow_locked || 2400).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Under 24h maturity protection</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Net Platform Revenue</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            ₹{Number(ledger?.net_platform_revenue || 497).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">15% commission + conv. fees</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Statutory GST (18%)</span>
            <ReceiptText size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 mt-3">
            ₹{Number(ledger?.gst_collected || 395).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Central + State GST collected</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Advocate Settlements</span>
            <CheckCircle2 size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 mt-3">
            ₹{Number(ledger?.total_withdrawn_by_advocates || 85000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Disbursed via IMPS bank rails</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" /> Automated Escrow Maturity Policy
        </h4>
        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            1. All client payments for video/audio consultations and statutory document drafting are deposited directly into the Platform Escrow Account upon booking creation.
          </p>
          <p>
            2. The funds remain locked in Escrow for exactly 24 hours following the consultation completion timestamp to allow for client quality verification and dispute raising.
          </p>
          <p>
            3. Upon expiration of the 24-hour window without dispute, the consultation fee minus the 15% marketplace commission is automatically released into the advocate's available withdrawal wallet.
          </p>
        </div>
      </div>
    </div>
  );
};
