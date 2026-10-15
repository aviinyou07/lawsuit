'use client';

import React from 'react';
import { FileText, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const DraftingCatalogView: React.FC = () => {
  const templates = [
    {
      id: 'doc-1',
      title: 'Residential Rental / Tenancy Agreement',
      category: 'Property & Real Estate',
      standard_price: 999,
      delivery_sla_days: 2,
      revisions: 2,
      description: 'Comprehensive 11-month lease agreement drafted under State Tenancy Laws with custom security deposit and repair covenants.',
    },
    {
      id: 'doc-2',
      title: 'Statutory Legal Notice under Sec 138 NI Act',
      category: 'Banking & Cheque Bounce',
      standard_price: 1499,
      delivery_sla_days: 1,
      revisions: 3,
      description: 'Mandatory 15-day statutory demand notice for bounced cheques with tracking postal dispatch guidelines.',
    },
    {
      id: 'doc-3',
      title: 'General Power of Attorney (GPA)',
      category: 'Civil & Property',
      standard_price: 1299,
      delivery_sla_days: 2,
      revisions: 2,
      description: 'Authorized legal representation instrument for property management, bank operations, and court filings.',
    },
    {
      id: 'doc-4',
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      category: 'Corporate & Commercial',
      standard_price: 1999,
      delivery_sla_days: 2,
      revisions: 3,
      description: 'Bilateral confidentiality agreement safeguarding proprietary business secrets, IP, and non-circumvention terms.',
    },
    {
      id: 'doc-5',
      title: 'Sworn General Affidavit & Notary Draft',
      category: 'Documentation & Affidavits',
      standard_price: 499,
      delivery_sla_days: 1,
      revisions: 1,
      description: 'Legal sworn statement for name change, address proof, passport verification, or date of birth declaration.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText size={18} className="text-amber-400" />
          Document Drafting Directory & Template Catalog ({templates.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage legal templates, turnaround SLAs, lawyer assignments, and client milestone escrows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {tpl.category}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Service
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{tpl.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Delivery SLA:
                </span>
                <span className="text-white font-semibold">{tpl.delivery_sla_days} Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <RefreshCw size={12} /> Free Revisions:
                </span>
                <span className="text-white font-semibold">{tpl.revisions} Versions</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 font-bold">Standard Price:</span>
                <span className="text-base font-black text-amber-400">₹{tpl.standard_price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
