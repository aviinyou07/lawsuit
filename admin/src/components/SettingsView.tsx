'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import { PlatformSettings } from '@/types';
import { adminFetch } from '@/lib/api';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platform_commission_rate: 15,
    convenience_fee: 99,
    gst_rate: 18,
    consultation_buffer_minutes: 10,
    instant_call_max_radius_km: 50,
    emergency_sos_enabled: true,
    maintenance_mode: false,
    bar_council_compliance_mode: 'STRICT_ACTIVE',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await adminFetch<PlatformSettings>('/admin/settings');
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await adminFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res.success) {
        alert('Platform settings updated & logged to compliance audit trail.');
      } else {
        alert(res.message || 'Failed to update settings');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings size={18} className="text-slate-400" />
          Marketplace Configuration & Regulatory Settings
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Take-rate commissions, statutory GST rules, consultation buffers, and emergency mode toggles.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Marketplace Commission Rate (%)
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              value={settings.platform_commission_rate}
              onChange={(e) =>
                setSettings({ ...settings, platform_commission_rate: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-[11px] text-slate-400 mt-1">Deducted from advocate gross consultation fees.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Client Convenience Fee (₹)
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              value={settings.convenience_fee}
              onChange={(e) =>
                setSettings({ ...settings, convenience_fee: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-[11px] text-slate-400 mt-1">Flat convenience fee charged on booking checkout.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Statutory GST Rate (%)
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              value={settings.gst_rate}
              onChange={(e) =>
                setSettings({ ...settings, gst_rate: parseFloat(e.target.value) || 0 })
              }
            />
            <p className="text-[11px] text-slate-400 mt-1">Tax invoice collection percentage.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Consultation Slot Buffer (Minutes)
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
              value={settings.consultation_buffer_minutes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  consultation_buffer_minutes: parseInt(e.target.value, 10) || 0,
                })
              }
            />
            <p className="text-[11px] text-slate-400 mt-1">Break time enforced between back-to-back consultations.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Emergency Legal SOS Dispatch</div>
              <div className="text-[11px] text-slate-400">
                Allow clients facing arrest or police custody to request emergency urgent counsel.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.emergency_sos_enabled}
              onChange={(e) => setSettings({ ...settings, emergency_sos_enabled: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Platform Maintenance Mode</div>
              <div className="text-[11px] text-slate-400">
                Temporarily pause new client bookings for scheduled database migrations.
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving Settings...' : 'Save System Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
