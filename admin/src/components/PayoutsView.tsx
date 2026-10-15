'use client';

import React, { useState } from 'react';
import { ArrowDownToLine, Check, Building, CreditCard } from 'lucide-react';
import { AdminPayout } from '@/types';
import { adminFetch } from '@/lib/api';

interface PayoutsViewProps {
  payouts: AdminPayout[];
  onRefresh: () => void;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({ payouts, onRefresh }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessPayout = async (payoutId: string) => {
    if (!confirm('Authorize IMPS bank transfer for this advocate payout request?')) return;
    try {
      setProcessingId(payoutId);
      const res = await adminFetch(`/admin/payouts/${payoutId}/process`, { method: 'POST' });
      if (res.success) {
        alert(res.message || 'Payout processed successfully!');
        onRefresh();
      } else {
        alert(res.message || 'Payout processing failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing payout');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ArrowDownToLine size={18} className="text-emerald-400" />
          Advocate Bank Payouts & Settlement Queue ({payouts.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Process verified IMPS/NEFT transfers to advocate bank accounts with automated UTR logging.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Advocate</th>
                <th className="py-4 px-6">Bank Account</th>
                <th className="py-4 px-6">IFSC Code</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">UTR / Reference</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No payout withdrawal requests found.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-bold text-white">
                      <div>{p.lawyer_name || 'Adv. Rajesh Sharma'}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {p.bar_council_number || 'D/1482/2010'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      •••• •••• {p.bank_account_number ? p.bank_account_number.slice(-4) : '4921'}
                    </td>
                    <td className="py-4 px-6 font-mono text-blue-400">
                      {p.bank_ifsc_code || 'HDFC0001234'}
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-400 text-sm">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {p.bank_reference_utr || 'Pending Dispatch'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          p.status === 'PAID'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.status !== 'PAID' ? (
                        <button
                          onClick={() => handleProcessPayout(p.id)}
                          disabled={processingId === p.id}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Check size={14} /> Process IMPS
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-xs">Settled ✓</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
