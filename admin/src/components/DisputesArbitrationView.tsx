'use client';

import React, { useState } from 'react';
import { Scale, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AdminDispute } from '@/types';
import { adminFetch } from '@/lib/api';

interface DisputesArbitrationViewProps {
  disputes: AdminDispute[];
  onRefresh: () => void;
}

export const DisputesArbitrationView: React.FC<DisputesArbitrationViewProps> = ({
  disputes,
  onRefresh,
}) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (id: string, status: 'RESOLVED_REFUNDED' | 'RESOLVED_REJECTED') => {
    const actionLabel = status === 'RESOLVED_REFUNDED' ? 'Issue 100% Refund' : 'Dismiss Dispute';
    if (!confirm(`Are you sure you want to: ${actionLabel}?`)) return;

    try {
      setResolvingId(id);
      const res = await adminFetch(`/disputes/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          status,
          resolution_notes: `Arbitrated via Next.js Web Admin Console. Decision: ${status}`,
        }),
      });

      if (res.success) {
        alert(res.message || 'Dispute updated successfully');
        onRefresh();
      } else {
        alert(res.message || 'Failed to update dispute');
      }
    } catch (err: any) {
      alert(err.message || 'Error resolving dispute');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Scale size={18} className="text-purple-400" />
          Dispute Arbitration & Escrow Refund Panel ({disputes.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Arbitrate client complaints regarding call disconnects, counsel unavailability, or drafting milestones.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Claim ID</th>
                <th className="py-4 px-6">Client Name</th>
                <th className="py-4 px-6">Issue Category</th>
                <th className="py-4 px-6">Dispute Description & Grounds</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Arbitration Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {disputes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck size={36} className="text-emerald-400/60" />
                      <div className="font-bold text-slate-300">Zero Active Disputes</div>
                      <div className="text-[11px]">Marketplace consultations and drafting orders are executing with 100% satisfaction.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">
                      #{d.id.slice(0, 8)}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">{d.client_name || 'Client'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                        {d.issue_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300 max-w-sm leading-relaxed">
                      {d.description}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          d.status === 'RESOLVED_REFUNDED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : d.status === 'RESOLVED_REJECTED'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {d.status === 'OPEN' || d.status === 'INVESTIGATING' ? (
                        <>
                          <button
                            onClick={() => handleResolve(d.id, 'RESOLVED_REFUNDED')}
                            disabled={resolvingId === d.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1"
                          >
                            <Check size={12} /> Refund Client
                          </button>
                          <button
                            onClick={() => handleResolve(d.id, 'RESOLVED_REJECTED')}
                            disabled={resolvingId === d.id}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 font-bold text-xs transition inline-flex items-center gap-1"
                          >
                            <X size={12} /> Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 font-semibold text-xs">Closed</span>
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
