/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, UserRole } from '../types/agricultural';
import { Menu, Users, Building2, Shield, MapPin, Scale, Lock, LogOut } from 'lucide-react';

interface HeaderBarProps {
  activePage: PageId;
  userRole: UserRole;
  userName: string;
  onOpenRoleModal: () => void;
  onLogout: () => void;
  selectedDistrict?: string;
  unit?: 'kg' | 'quintal';
  setUnit?: (u: 'kg' | 'quintal') => void;
  lang: 'en' | 'ta';
  setLang: (lang: 'en' | 'ta') => void;
  onToggleMobileMenu: () => void;
  lastUpdatedDate: string;
}

const PAGE_TITLES: Record<PageId, { en: string; ta: string }> = {
  home: { en: 'Market Overview & Intelligence', ta: 'சந்தை நிலவரம்' },
  auth: { en: 'Account Portal', ta: 'பயனர் கணக்கு' },
  admin_dash: { en: 'System Administration', ta: 'நிர்வாக மேலாண்மை' },
  forecasting_lab: { en: 'Price Forecasting Lab', ta: 'விலை முன்னறிவிப்பு மையம்' },
  regional_map: { en: 'Regional Mandi Intelligence', ta: 'மண்டல சந்தை நுண்ணறிவு' },
  farmer_dash: { en: 'Farmer Advisory Dashboard', ta: 'விவசாயிகள் ஆலோசனை தளம்' },
  gov_dash: { en: 'Buffer Stock Decision Console', ta: 'கையிருப்பு கண்காணிப்பு தளம்' },
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activePage,
  userRole,
  userName,
  onOpenRoleModal,
  onLogout,
  selectedDistrict = 'Dindigul',
  unit = 'quintal',
  setUnit,
  lang,
  setLang,
  onToggleMobileMenu,
  lastUpdatedDate,
}) => {
  const currentTitle = PAGE_TITLES[activePage]?.[lang] || 'AgriPrice Insight';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs min-w-0">
          <span className="text-slate-400 hidden sm:inline">AgriPrice Insight</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right Controls: Role Badge, Language Switcher, Logout */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Role Indicator / Switcher */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800"
          title={lang === 'ta' ? 'பொறுப்பை மாற்ற கிளிக் செய்க' : 'Click to switch active role'}
        >
          {userRole === 'farmer' && <Users className="w-3.5 h-3.5 text-emerald-700" />}
          {userRole === 'government' && <Building2 className="w-3.5 h-3.5 text-blue-700" />}
          {userRole === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-700" />}
          <span className="font-bold">
            {lang === 'ta'
              ? userRole === 'farmer'
                ? 'விவசாயி'
                : userRole === 'government'
                ? 'அரசு அதிகாரி'
                : 'நிர்வாகி'
              : userRole}
          </span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded transition-colors ${
              lang === 'en'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ta')}
            className={`px-2 py-1 rounded transition-colors ${
              lang === 'ta'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Quick Logout */}
        <button
          onClick={onLogout}
          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
          title={lang === 'ta' ? 'வெளியேறு' : 'Logout'}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
