'use client';

import React from 'react';
import { Star, Award, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { AdvocateScore } from '@/types';

interface AdvocateScoringViewProps {
  scores: AdvocateScore[];
}

export const AdvocateScoringView: React.FC<AdvocateScoringViewProps> = ({ scores }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Star size={18} className="text-amber-400" />
          Advocate Quality & Scoring Index ({scores.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Performance ratings, consultation fulfillment rates, and court standing ranking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scores.map((adv) => {
          const total = adv.total_bookings || 1;
          const completionRate = Math.round(((adv.completed_bookings || 0) / total) * 100);
          return (
            <div
              key={adv.user_id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{adv.full_name}</h4>
                  <div className="text-[11px] font-mono text-blue-400">{adv.bar_council_number}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    📍 {adv.city} • {adv.experience_years} Years Practice
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-amber-400">{adv.rating_average || '4.9'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Sessions</div>
                  <div className="text-base font-black text-white">{adv.total_bookings}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Reviews</div>
                  <div className="text-base font-black text-white">{adv.rating_count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Fulfillment</div>
                  <div className="text-base font-black text-emerald-400">{completionRate}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Compliance Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle size={12} /> {adv.verification_status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
