/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId, UserRole } from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import {
  Home,
  Users,
  Building2,
  Shield,
  Cpu,
  Compass,
  Lock,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarNavigationProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  userRole: UserRole;
  userName: string;
  onOpenAuth: () => void;
  onLogout: () => void;
  lastUpdatedDate: string;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  t: TranslationDictionary;
  lang: 'en' | 'ta';
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activePage,
  setActivePage,
  userRole,
  userName,
  onOpenAuth,
  onLogout,
  lastUpdatedDate,
  isMobileOpen,
  setIsMobileOpen,
  t,
  lang,
}) => {
  const handleSelect = (page: PageId) => {
    setActivePage(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div onClick={() => handleSelect('home')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              A
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block leading-tight">
                AgriPrice Insight
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide block uppercase">
                Phase I Implementation
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 m-3 bg-slate-800/70 border border-slate-700/60 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{lang === 'ta' ? 'உள்நுழைந்தவர்:' : 'Signed In As:'}</span>
            <button
              onClick={onLogout}
              className="text-rose-400 hover:text-rose-300 text-[10px] font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>{lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
              {userRole === 'farmer' && <Users className="w-3.5 h-3.5" />}
              {userRole === 'government' && <Building2 className="w-3.5 h-3.5" />}
              {userRole === 'admin' && <Shield className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-white block truncate">{userName}</span>
              <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide">
                {lang === 'ta'
                  ? userRole === 'farmer'
                    ? 'பொறுப்பு: விவசாயி'
                    : userRole === 'government'
                    ? 'பொறுப்பு: அரசு அதிகாரி'
                    : 'பொறுப்பு: நிர்வாகி'
                  : `Role: ${userRole}`}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs">
          {/* General Overview */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'ta' ? 'கண்ணோட்டம்' : 'Overview'}
            </div>
            <button
              onClick={() => handleSelect('home')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                activePage === 'home'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ta' ? 'திட்ட விளக்கம்' : 'Project Summary'}</span>
              </div>
              {activePage === 'home' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Portals & Access */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'ta' ? 'கணக்கு & பாதுகாப்பு' : 'Account & Security'}
            </div>
            <button
              onClick={() => handleSelect('auth')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                activePage === 'auth'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ta' ? 'உள்நுழைவு / பதிவு' : 'Login / Register'}</span>
              </div>
              {activePage === 'auth' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {userRole === 'admin' && (
              <button
                onClick={() => handleSelect('admin_dash')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  activePage === 'admin_dash'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'ta' ? 'நிர்வாகி பயனர் மேலாண்மை' : 'Admin User Management'}</span>
                </div>
                {activePage === 'admin_dash' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Analytics & Projections */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'ta' ? 'ஆய்வு & முன்னறிவிப்பு' : 'Analytics & Forecasting'}
            </div>
            <button
              onClick={() => handleSelect('forecasting_lab')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                activePage === 'forecasting_lab'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ta' ? 'விலை முன்னறிவிப்பு மையம்' : 'Price Forecasting Lab'}</span>
              </div>
              {activePage === 'forecasting_lab' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleSelect('regional_map')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                activePage === 'regional_map'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-slate-400" />
                <span>{lang === 'ta' ? 'மண்டல சந்தை நுண்ணறிவு' : 'Regional Mandi Intelligence'}</span>
              </div>
              {activePage === 'regional_map' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Decision Support Portals */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'ta' ? 'முடிவு ஆதரவு' : 'Decision Support'}
            </div>

            {/* Farmer Dashboard visible to Farmer and Admin */}
            {(userRole === 'farmer' || userRole === 'admin') && (
              <button
                onClick={() => handleSelect('farmer_dash')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  activePage === 'farmer_dash'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ta' ? 'விவசாயிகள் ஆலோசனை தளம்' : 'Farmer Dashboard'}</span>
                </div>
                {activePage === 'farmer_dash' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Government Dashboard visible to Government and Admin */}
            {(userRole === 'government' || userRole === 'admin') && (
              <button
                onClick={() => handleSelect('gov_dash')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  activePage === 'gov_dash'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'ta' ? 'அரசு கையிருப்பு தளம்' : 'Government Buffer Portal'}</span>
                </div>
                {activePage === 'gov_dash' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between">
            <span>{lang === 'ta' ? 'அக்மார்க்நெட் சரிபார்க்கப்பட்டது' : 'AGMARKNET Verified'}</span>
            <span className="font-mono text-emerald-400 font-semibold">2021–2024</span>
          </div>
        </div>
      </aside>
    </>
  );
};
