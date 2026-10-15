'use client';

import React, { useState } from 'react';
import { ScrollText, Search, Download, ShieldAlert, Clock, User, Database, ChevronDown, ChevronRight } from 'lucide-react';
import { AuditLog } from '@/types';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onRefresh: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'LAWYER' | 'CLIENT' | 'SYSTEM'>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.target_entity && log.target_entity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.actor_phone && log.actor_phone.includes(searchTerm)) ||
      (log.actor_id && log.actor_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || log.actor_role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const exportToCsv = () => {
    const headers = ['ID', 'Timestamp', 'Actor Role', 'Actor Phone', 'Action', 'Target Entity', 'Target Entity ID', 'Payload'];
    const rows = filteredLogs.map((log) => [
      log.id,
      new Date(log.created_at).toISOString(),
      log.actor_role,
      log.actor_phone || 'N/A',
      log.action,
      log.target_entity,
      log.target_entity_id || 'N/A',
      JSON.stringify(log.after_state || {}).replace(/"/g, '""'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => `"${e.join('","')}"`)].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'LAWYER':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CLIENT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ScrollText size={18} className="text-blue-400" />
            Security & System Audit Trail ({filteredLogs.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically timestamped audit log of all administrative interventions, KYC transitions, financial ledger events, and state mutations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow"
          >
            <Download size={14} className="text-blue-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by action, target entity, actor ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'ADMIN', 'LAWYER', 'CLIENT'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                roleFilter === role
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6 w-8"></th>
                <th className="py-4 px-6">Timestamp (IST)</th>
                <th className="py-4 px-6">Actor</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Target Entity</th>
                <th className="py-4 px-6">Entity ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <ShieldAlert size={36} className="mx-auto mb-2 text-slate-600" />
                    No audit log records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="hover:bg-slate-800/40 transition cursor-pointer"
                      >
                        <td className="py-4 px-6 text-slate-500">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-500" />
                            {new Date(log.created_at).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'medium',
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1.5 font-medium text-white">
                            <User size={13} className="text-slate-400" />
                            {log.actor_phone || log.actor_id.slice(0, 8) + '...'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadge(
                              log.actor_role
                            )}`}
                          >
                            {log.actor_role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Database size={13} className="text-slate-500" />
                            {log.target_entity}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                          {log.target_entity_id ? log.target_entity_id.slice(0, 12) + '...' : '—'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-950/70 border-b border-slate-800">
                          <td colSpan={7} className="p-4 pl-14">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-[11px]">
                              <div className="flex items-center justify-between text-slate-400 mb-2 font-bold text-xs">
                                <span>Recorded State Mutation & Payload</span>
                                <span className="text-slate-500">ID: {log.id}</span>
                              </div>
                              <pre className="text-emerald-400 overflow-x-auto p-3 bg-slate-950 rounded-lg">
                                {JSON.stringify(log.after_state || {}, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
