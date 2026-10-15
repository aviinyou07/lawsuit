'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, X, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import { LawyerVerification } from '@/types';
import { adminFetch } from '@/lib/api';

interface KycQueueViewProps {
  verifications: LawyerVerification[];
  onRefresh: () => void;
}

export const KycQueueView: React.FC<KycQueueViewProps> = ({ verifications, onRefresh }) => {
  const [selectedKyc, setSelectedKyc] = useState<LawyerVerification | null>(null);
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleDecision = async () => {
    if (!selectedKyc || !actionType) return;
    try {
      setProcessing(true);
      const res = await adminFetch(`/admin/lawyer-verifications/${selectedKyc.id}/decision`, {
        method: 'POST',
        body: JSON.stringify({
          decision: actionType,
          rejection_reason: rejectionReason || undefined,
          admin_notes: adminNotes || undefined,
        }),
      });

      if (res.success) {
        alert(res.message || `Application marked as ${actionType}`);
        setSelectedKyc(null);
        setActionType(null);
        setRejectionReason('');
        setAdminNotes('');
        onRefresh();
      } else {
        alert(res.message || 'Action failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating decision');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-400" />
            Advocate Bar Verification Queue ({verifications.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Incoming advocate applications requiring State Bar Council credential verification.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Advocate</th>
                <th className="py-4 px-6">Bar Council Enrollment</th>
                <th className="py-4 px-6">State Bar</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {verifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck size={36} className="text-emerald-400/60" />
                      <div className="font-bold text-slate-300">Verification Queue is Clear</div>
                      <div className="text-[11px]">All enrolled advocates have been processed and certified.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-bold text-white">{v.full_name || 'Advocate'}</td>
                    <td className="py-4 px-6 font-mono text-blue-400 font-semibold">
                      {v.bar_council_number || 'D/1482/2010'}
                    </td>
                    <td className="py-4 px-6 text-slate-300">{v.state_bar_council || 'Bar Council of Delhi'}</td>
                    <td className="py-4 px-6 text-slate-300">{v.experience_years || 12} Years</td>
                    <td className="py-4 px-6 text-slate-300">{v.city || 'Delhi'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          v.status === 'APPROVED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : v.status === 'REJECTED'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedKyc(v);
                          setActionType('APPROVED');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedKyc(v);
                          setActionType('REJECTED');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <X size={12} /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedKyc && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  actionType === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {actionType === 'APPROVED' ? <Check size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Confirm {actionType === 'APPROVED' ? 'Bar Council Approval' : 'Application Rejection'}
                </h4>
                <p className="text-xs text-slate-400">
                  Advocate: {selectedKyc.full_name} ({selectedKyc.bar_council_number})
                </p>
              </div>
            </div>

            {actionType === 'REJECTED' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Rejection Reason (Sent to Advocate)
                </label>
                <textarea
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="e.g. Bar Council Certificate mismatch or illegible document scan"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Internal Notes
              </label>
              <textarea
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                rows={2}
                placeholder="Internal verification remarks for compliance audit trail"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedKyc(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                disabled={processing}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition ${
                  actionType === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {processing ? 'Saving...' : `Confirm ${actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
