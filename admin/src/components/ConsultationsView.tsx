'use client';

import React, { useState } from 'react';
import { CalendarDays, Video, Phone, MessageSquare, Clock } from 'lucide-react';
import { AdminBooking } from '@/types';

interface ConsultationsViewProps {
  bookings: AdminBooking[];
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({ bookings }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = bookings.filter((b) => filter === 'ALL' || b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-400" />
            Consultations & Escrow Oversight ({bookings.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of all Video, Audio, and In-Person legal consultations booked across India.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                filter === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Reference</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Advocate</th>
                <th className="py-4 px-6">Mode</th>
                <th className="py-4 px-6">Scheduled Window</th>
                <th className="py-4 px-6">Fee Paid</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No consultation sessions found under this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">
                      {b.booking_reference}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      {b.client_name || 'Client'}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {b.lawyer_name || 'Adv. Rajesh Sharma'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 text-[11px]">
                        {b.consultation_mode === 'VIDEO' ? (
                          <Video size={12} />
                        ) : b.consultation_mode === 'AUDIO' ? (
                          <Phone size={12} />
                        ) : (
                          <MessageSquare size={12} />
                        )}
                        {b.consultation_mode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {new Date(b.scheduled_start).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">₹{b.total_amount}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'COMPLETED'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : b.status === 'CANCELLED'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
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
