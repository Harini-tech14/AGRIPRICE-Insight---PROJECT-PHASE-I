/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SUPPORTED_COMMODITIES,
  REGIONAL_MARKETS,
  getMandiRecords,
  INITIAL_SYSTEM_ALERTS,
} from './data/mandiRepository';
import { CommodityMeta, MarketMeta, ForecastResponse, PageId, UserRole } from './types/agricultural';
import { generate90DayForecast } from './ml/forecastEngine';
import { TAMIL_TRANSLATIONS, ENGLISH_TRANSLATIONS } from './locales/tamil';
import { getActiveSession, setActiveSession, logoutUser, RegisteredUser } from './services/authService';
import { SidebarNavigation } from './components/SidebarNavigation';
import { HeaderBar } from './components/HeaderBar';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ForecastingLab } from './components/ForecastingLab';
import { RegionalMarketMap } from './components/RegionalMarketMap';
import { FarmerDashboard } from './components/FarmerDashboard';
import { GovernmentDashboard } from './components/GovernmentDashboard';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [activeUser, setActiveUser] = useState<RegisteredUser | null>(getActiveSession);
  const [userRole, setUserRole] = useState<UserRole>(activeUser?.role || 'farmer');
  const [userName, setUserName] = useState<string>(activeUser?.name || 'Murugan S.');
  const [unitPreference, setUnitPreference] = useState<'kg' | 'quintal'>('quintal');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityMeta>(SUPPORTED_COMMODITIES[0]);
  const [selectedMarket, setSelectedMarket] = useState<MarketMeta>(REGIONAL_MARKETS[0]);

  // Sync state if user session changes
  useEffect(() => {
    if (activeUser) {
      setUserRole(activeUser.role);
      setUserName(activeUser.name);
    }
  }, [activeUser]);

  const t = useMemo(() => (lang === 'ta' ? TAMIL_TRANSLATIONS : ENGLISH_TRANSLATIONS), [lang]);

  // Retrieve records from in-memory repository
  const allRecords = useMemo(() => getMandiRecords(), []);

  // Filter historical records for current commodity & market
  const historicalRecords = useMemo(() => {
    return allRecords
      .filter(
        r =>
          r.commodity.toLowerCase().includes(selectedCommodity.id.toLowerCase()) &&
          r.market.toLowerCase().includes(selectedMarket.id.toLowerCase())
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allRecords, selectedCommodity, selectedMarket]);

  // Compute 90-day forecast for the currently active commodity and market
  const currentForecast = useMemo<ForecastResponse>(() => {
    return generate90DayForecast(selectedCommodity, selectedMarket, allRecords);
  }, [selectedCommodity, selectedMarket, allRecords]);

  // Compute forecasts across all commodities
  const allCommodityForecasts = useMemo<Record<string, ForecastResponse>>(() => {
    const map: Record<string, ForecastResponse> = {};
    for (const c of SUPPORTED_COMMODITIES) {
      map[c.id] = generate90DayForecast(c, selectedMarket, allRecords);
    }
    return map;
  }, [selectedMarket, allRecords]);


  const handleLogout = useCallback(() => {
    logoutUser();
    setActiveUser(null);
    setUserRole('farmer');
    setUserName('Guest Farmer');
    setActivePage('auth');
  }, []);

  const handleSuccessAuth = useCallback((user: RegisteredUser) => {
    setActiveUser(user);
    setUserRole(user.role);
    setUserName(user.name);
    if (user.role === 'farmer') setActivePage('farmer_dash');
    else if (user.role === 'government') setActivePage('gov_dash');
    else if (user.role === 'admin') setActivePage('admin_dash');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex">
      {/* Module Navigation Sidebar */}
      <SidebarNavigation
        activePage={activePage}
        setActivePage={setActivePage}
        userRole={userRole}
        userName={userName}
        onOpenAuth={() => setActivePage('auth')}
        onLogout={handleLogout}
        lastUpdatedDate={currentForecast.latestObservedDate}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        t={t}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <HeaderBar
          activePage={activePage}
          userRole={userRole}
          userName={userName}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onLogout={handleLogout}
          selectedDistrict={selectedMarket.district}
          unit={unitPreference}
          setUnit={setUnitPreference}
          lang={lang}
          setLang={setLang}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          lastUpdatedDate={currentForecast.latestObservedDate}
        />

        {/* Role Selector Modal */}
        <RoleSelectorModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          currentRole={userRole}
          lang={lang}
          onSelectRole={role => {
            setUserRole(role);
            if (role === 'farmer') {
              setUserName(lang === 'ta' ? 'முருகன் எஸ்.' : 'Murugan S.');
              setActivePage('farmer_dash');
            } else if (role === 'government') {
              setUserName(lang === 'ta' ? 'டாக்டர் கே. ராமநாதன், IAS' : 'Dr. K. Ramanathan, IAS');
              setActivePage('gov_dash');
            } else {
              setUserName(lang === 'ta' ? 'கணினி நிர்வாகி' : 'System Administrator');
              setActivePage('admin_dash');
            }
          }}
        />

        {/* Viewport for Active Approved Phase I Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Page 1: Overview */}
          {activePage === 'home' && (
            <HomePage
              onNavigate={setActivePage}
              onSetRole={setUserRole}
              commodities={SUPPORTED_COMMODITIES}
              markets={REGIONAL_MARKETS}
              allRecords={allRecords}
              userRole={userRole}
              t={t}
              lang={lang}
              lastUpdatedDate={currentForecast.latestObservedDate}
            />
          )}

          {/* Module 1: Auth (Login & Registration) */}
          {activePage === 'auth' && (
            <AuthPage
              onSuccessAuth={handleSuccessAuth}
              t={t}
              lang={lang}
            />
          )}

          {/* Module 1: Admin Management - Protected: Admin only */}
          {activePage === 'admin_dash' && (
            userRole === 'admin' ? (
              <AdminDashboard
                commodities={SUPPORTED_COMMODITIES}
                markets={REGIONAL_MARKETS}
                allRecords={allRecords}
                t={t}
                lang={lang}
              />
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-xs text-rose-800 space-y-2">
                <div className="font-bold text-sm">Access Denied: Admin Clearance Required</div>
                <p>Your active role ({userRole}) is not authorized to access system user and master dataset configuration.</p>
                <button
                  onClick={() => setActivePage('home')}
                  className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-semibold hover:bg-rose-800"
                >
                  Return to Home
                </button>
              </div>
            )
          )}

          {/* Module 3: Machine Learning Model Benchmarking & Multi-Horizon Forecaster */}
          {activePage === 'forecasting_lab' && (
            <ForecastingLab
              selectedCommodity={selectedCommodity}
              setSelectedCommodity={setSelectedCommodity}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              commodities={SUPPORTED_COMMODITIES}
              markets={REGIONAL_MARKETS}
              forecast={currentForecast}
              historicalRecords={historicalRecords}
              allRecords={allRecords}
              t={t}
              lang={lang}
            />
          )}

          {/* Module 4: Regional Market Intelligence & Risk Analysis */}
          {activePage === 'regional_map' && (
            <RegionalMarketMap
              selectedCommodity={selectedCommodity}
              setSelectedCommodity={setSelectedCommodity}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              commodities={SUPPORTED_COMMODITIES}
              markets={REGIONAL_MARKETS}
              allRecords={allRecords}
              forecasts={allCommodityForecasts}
              t={t}
              lang={lang}
            />
          )}

          {/* Module 5.1: Farmer Dashboard */}
          {activePage === 'farmer_dash' && (
            <FarmerDashboard
              selectedCommodity={selectedCommodity}
              setSelectedCommodity={setSelectedCommodity}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              commodities={SUPPORTED_COMMODITIES}
              markets={REGIONAL_MARKETS}
              forecast={currentForecast}
              historicalRecords={historicalRecords}
              allRecords={allRecords}
              t={t}
              lang={lang}
              unit={unitPreference}
              setUnit={setUnitPreference}
              userName={userName}
              onNavigateToForecasting={() => setActivePage('forecasting_lab')}
            />
          )}

          {/* Module 5.2: Government Dashboard - Protected: Government and Admin only */}
          {activePage === 'gov_dash' && (
            (userRole === 'government' || userRole === 'admin') ? (
              <GovernmentDashboard
                commodities={SUPPORTED_COMMODITIES}
                forecasts={allCommodityForecasts}
                selectedCommodity={selectedCommodity}
                setSelectedCommodity={setSelectedCommodity}
                onNavigate={setActivePage}
                t={t}
                lang={lang}
              />
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-xs text-rose-800 space-y-2">
                <div className="font-bold text-sm">Access Denied: Government / Policy Clearance Required</div>
                <p>The Government Decision Support Portal is restricted to authorized state civil supplies officials.</p>
                <button
                  onClick={() => setActivePage('farmer_dash')}
                  className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-semibold hover:bg-rose-800"
                >
                  Return to Farmer Dashboard
                </button>
              </div>
            )
          )}
        </main>

        {/* Academic Project Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-800">AgriPrice Insight</span> · Phase I Scope
            </div>
            <div className="text-[11px] text-slate-500">
              Verified Sources: AGMARKNET · e-NAM · TN-AMIS (2021–2024 Dataset)
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
