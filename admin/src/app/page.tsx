'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, AdminTab } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { KycQueueView } from '@/components/KycQueueView';
import { UserDirectoryView } from '@/components/UserDirectoryView';
import { AdvocateScoringView } from '@/components/AdvocateScoringView';
import { ConsultationsView } from '@/components/ConsultationsView';
import { FinanceLedgerView } from '@/components/FinanceLedgerView';
import { PayoutsView } from '@/components/PayoutsView';
import { DraftingCatalogView } from '@/components/DraftingCatalogView';
import { DisputesArbitrationView } from '@/components/DisputesArbitrationView';
import { CategoriesView } from '@/components/CategoriesView';
import { SettingsView } from '@/components/SettingsView';
import { AuditLogsView } from '@/components/AuditLogsView';

import {
  AdminMetrics,
  LawyerVerification,
  AdminUser,
  AdminBooking,
  AdminPayout,
  AdvocateScore,
  FinanceLedger,
  AuditLog,
  AdminDispute,
} from '@/types';
import {
  adminFetch,
  autoSuperAdminLogin,
  getAdminToken,
} from '@/lib/api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Platform Data Stores
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [kycQueue, setKycQueue] = useState<LawyerVerification[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [scores, setScores] = useState<AdvocateScore[]>([]);
  const [ledger, setLedger] = useState<FinanceLedger | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Dashboard Metrics
      const mRes = await adminFetch<AdminMetrics>('/admin/dashboard/metrics');
      if (mRes.success && mRes.data) setMetrics(mRes.data);

      // 2. KYC Verifications
      const kRes = await adminFetch<LawyerVerification[]>('/admin/lawyer-verifications');
      if (kRes.success && kRes.data) setKycQueue(kRes.data);

      // 3. User Directory
      const uRes = await adminFetch<AdminUser[]>('/admin/users');
      if (uRes.success && uRes.data) setUsers(uRes.data);

      // 4. Bookings & Consultations
      const bRes = await adminFetch<AdminBooking[]>('/admin/bookings');
      if (bRes.success && bRes.data) setBookings(bRes.data);

      // 5. Payouts
      const pRes = await adminFetch<AdminPayout[]>('/admin/payouts');
      if (pRes.success && pRes.data) setPayouts(pRes.data);

      // 6. Advocate Scoring
      const sRes = await adminFetch<AdvocateScore[]>('/admin/advocate-scores');
      if (sRes.success && sRes.data) setScores(sRes.data);

      // 7. Finance Ledger
      const fRes = await adminFetch<FinanceLedger>('/admin/finance/ledger');
      if (fRes.success && fRes.data) setLedger(fRes.data);

      // 8. Audit Logs
      const aRes = await adminFetch<AuditLog[]>('/admin/audit-logs');
      if (aRes.success && aRes.data) setAuditLogs(aRes.data);

      // 9. Disputes & Arbitration
      const dRes = await adminFetch<AdminDispute[]>('/disputes/admin/all');
      if (dRes.success && dRes.data) setDisputes(dRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    const token = await autoSuperAdminLogin();
    if (token) {
      setIsAuthenticated(true);
      await fetchAllData();
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [fetchAllData]);

  useEffect(() => {
    const existingToken = getAdminToken();
    if (existingToken) {
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      handleLogin();
    }
  }, [fetchAllData, handleLogin]);

  const pendingKycCount = kycQueue.filter((k) => k.status === 'PENDING').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'OPEN').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingKycCount={pendingKycCount}
        openDisputesCount={openDisputesCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          onRefresh={fetchAllData}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView metrics={metrics} onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'kyc' && (
            <KycQueueView verifications={kycQueue} onRefresh={fetchAllData} />
          )}

          {activeTab === 'users' && (
            <UserDirectoryView users={users} onRefresh={fetchAllData} />
          )}

          {activeTab === 'scoring' && <AdvocateScoringView scores={scores} />}

          {activeTab === 'consultations' && (
            <ConsultationsView bookings={bookings} />
          )}

          {activeTab === 'finance' && <FinanceLedgerView ledger={ledger} />}

          {activeTab === 'payouts' && (
            <PayoutsView payouts={payouts} onRefresh={fetchAllData} />
          )}

          {activeTab === 'drafting' && <DraftingCatalogView />}

          {activeTab === 'disputes' && (
            <DisputesArbitrationView disputes={disputes} onRefresh={fetchAllData} />
          )}

          {activeTab === 'categories' && <CategoriesView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'audit' && (
            <AuditLogsView logs={auditLogs} onRefresh={fetchAllData} />
          )}
        </main>
      </div>
    </div>
  );
}
