'use client';

import React, { useState } from 'react';
import { Users, Search, Ban, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AdminUser } from '@/types';
import { adminFetch } from '@/lib/api';

interface UserDirectoryViewProps {
  users: AdminUser[];
  onRefresh: () => void;
}

export const UserDirectoryView: React.FC<UserDirectoryViewProps> = ({ users, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENT' | 'LAWYER' | 'ADMIN'>('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone_number?.includes(search) ||
      u.city?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleBlock = async (user: AdminUser) => {
    const actionName = user.is_active ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${actionName} access for ${user.full_name || user.phone_number}?`)) return;

    try {
      setTogglingId(user.id);
      const res = await adminFetch(`/admin/users/${user.id}/toggle-block`, { method: 'POST' });
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Action failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            User & Advocate Directory ({users.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full platform registry with permissions management, status toggles, and role governance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'CLIENT', 'LAWYER', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                roleFilter === r
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by full name, phone number (+91...), or city..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 shadow-inner"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {(u.full_name || 'U')[0]}
                      </div>
                      {u.full_name || 'New User'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">+91 {u.phone_number}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          u.role === 'LAWYER'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : u.role === 'ADMIN'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{u.city || 'India'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          u.is_active
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.is_active ? <CheckCircle2 size={10} /> : <ShieldAlert size={10} />}
                        {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleBlock(u)}
                        disabled={togglingId === u.id || u.role === 'ADMIN'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 ${
                          u.is_active
                            ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
                        } disabled:opacity-40`}
                      >
                        <Ban size={12} />
                        {u.is_active ? 'Block Account' : 'Reactivate'}
                      </button>
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
