'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, CheckCircle2, Tag } from 'lucide-react';
import { adminFetch } from '@/lib/api';

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminFetch('/categories');
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderTree size={18} className="text-blue-400" />
          Legal Category, Specialization & Practice Area Tree ({categories.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          11 primary legal domains configured in PostgreSQL with sub-specialities and search rankings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Domain #{idx + 1}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{cat.name}</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/30">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>

            {cat.specializations && cat.specializations.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={10} /> Sub-Specialities ({cat.specializations.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.specializations.map((spec: any) => (
                    <span
                      key={spec.id}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium"
                    >
                      {spec.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
