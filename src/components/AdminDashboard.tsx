/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommodityMeta, MarketMeta, MandiRecord } from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import { getStoredUsers, updateUserStatus, RegisteredUser } from '../services/authService';
import {
  Shield,
  Users,
  Database,
  Store,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Search,
  Plus,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface AdminDashboardProps {
  commodities: CommodityMeta[];
  markets: MarketMeta[];
  allRecords: MandiRecord[];
  t: TranslationDictionary;
  lang: 'en' | 'ta';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  commodities,
  markets,
  allRecords,
  t,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'commodities' | 'markets' | 'system'>('overview');
  const [users, setUsers] = useState<RegisteredUser[]>(getStoredUsers);
  const [userSearch, setUserSearch] = useState('');

  const handleToggleStatus = (userId: string, current: 'active' | 'suspended') => {
    const nextStatus = current === 'active' ? 'suspended' : 'active';
    updateUserStatus(userId, nextStatus);
    setUsers(getStoredUsers());
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-50 text-purple-800 text-[11px] font-semibold mb-2 border border-purple-200">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'கணினி நிர்வாகம் & மேலாண்மை' : 'System Administration & Governance'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {lang === 'ta' ? 'கணினி நிர்வாகம் & முதன்மைத் தரவு மேலாண்மை' : 'System Administration & Master Data Management'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ta'
                ? 'பயனர்கள் கணக்குகளை நிர்வகிக்கவும், வேளாண் சந்தை பதிவுகளை கண்காணிக்கவும், கணினி அமைப்புகளை சரிபார்க்கவும்.'
                : 'Manage system users, monitor agricultural dataset records (2021–2024), and audit system parameters.'}
            </p>
          </div>
          <div className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
            <span>{lang === 'ta' ? 'நிலை: ' : 'Environment: '}</span>
            <span className="font-semibold text-emerald-700">{lang === 'ta' ? 'முதல் கட்ட நேரலை வெளியீடு' : 'Phase I Production Release'}</span>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 text-[11px]">{lang === 'ta' ? 'பதிவுசெய்த பயனர்கள்' : 'Registered Users'}</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{users.length} {lang === 'ta' ? 'கணக்குகள்' : 'Accounts'}</div>
            <span className="text-[10px] text-emerald-700 font-medium">{lang === 'ta' ? '3 முக்கிய பொறுப்புகள்' : '3 Core Roles Active'}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 text-[11px]">{lang === 'ta' ? 'ஆதரிக்கப்படும் பயிர்கள்' : 'Supported Commodities'}</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{commodities.length} {lang === 'ta' ? 'பயிர்கள்' : 'Verified'}</div>
            <span className="text-[10px] text-slate-500">{lang === 'ta' ? 'தக்காளி, வெங்காயம், உருளை, நெல்' : 'Tomato, Onion, Potato, Paddy'}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 text-[11px]">{lang === 'ta' ? 'தமிழ்நாடு மண்டிகள்' : 'Tamil Nadu Mandis'}</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{markets.length} {lang === 'ta' ? 'மண்டிகள்' : 'Mandis'}</div>
            <span className="text-[10px] text-slate-500">{lang === 'ta' ? 'சென்னை, கோவை, மதுரை, திருச்சி, சேலம்' : 'Chennai, Cbe, Madurai, Trichy, Salem'}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 text-[11px]">{lang === 'ta' ? 'வரலாற்று தரவுத்தளம்' : 'Historical Database'}</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{allRecords.length} {lang === 'ta' ? 'பதிவுகள்' : 'Records'}</div>
            <span className="text-[10px] text-emerald-700 font-medium">{lang === 'ta' ? 'காலம்: 2021–2024 சேர்க்கப்பட்டது' : 'Period: 2021–2024 Indexed'}</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'ta' ? 'பொதுப் பார்வை & நலம்' : 'Overview & Health'}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'ta' ? `பயனர் மேலாண்மை (${users.length})` : `User Management (${users.length})`}
        </button>
        <button
          onClick={() => setActiveTab('commodities')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'commodities'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'ta' ? `பயிர் பட்டியல் (${commodities.length})` : `Commodity Master (${commodities.length})`}
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'markets'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'ta' ? `மண்டி சந்தைகள் (${markets.length})` : `Market Mandis (${markets.length})`}
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-700" />
              Phase I Architecture Compliance Status
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Access Management:</strong> Role-Based Access Control (Farmer, Government, Admin)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Data Repository:</strong> 2021–2024 Verified Historical Mandi Records</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Predictive Suite:</strong> Multi-Algorithm ML Models (ARIMA, SARIMA, Random Forest, XGBoost, LSTM)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Spatial Intelligence:</strong> Regional Mandi Intelligence & Price Risk Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Decision Support:</strong> Farmer Advisory & Strategic Buffer-Stock Decision Console</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-700" />
              Storage Architecture & Data Provenance
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Active Storage:</strong> In-memory mandi database with browser <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">localStorage</code> session persistence (Production PostgreSQL schema provided in <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">backend/main.py</code>).
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Data Provenance:</strong> Baseline observations are verified agricultural market series calibrated to historical AGMARKNET and TN-AMIS seasonal profiles (2021–2024).
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
              <span>Time Horizon: 2021–2024 Daily Observations</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Account Management</h3>
              <p className="text-xs text-slate-500">View and update user account authorization status.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user, email, role..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">District / Org</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          u.role === 'farmer'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : u.role === 'government'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{u.organizationOrDistrict}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          u.status === 'active' ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className="px-2 py-1 text-[10px] font-semibold rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Commodities Master */}
      {activeTab === 'commodities' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Approved Phase I Commodities</h3>
              <p className="text-slate-500">Strictly 4 commodities: Tomato, Onion, Potato, and Paddy (Rice).</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              Standardized ₹/Quintal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commodities.map(c => (
              <div key={c.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <span className="text-emerald-700 font-semibold font-mono">{c.unit}</span>
                </div>
                <div className="text-slate-600 text-xs mb-2">Tamil: {c.nameTamil}</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <div>Category: <span className="font-medium text-slate-800">{c.category}</span></div>
                  <div>Buffer Eligible: <span className="font-medium text-slate-800">{c.bufferStockEligible ? 'Yes (PSF/FCI)' : 'No'}</span></div>
                  <div>Shelf Life: <span className="font-medium text-slate-800">{c.shelfLifeDays} days</span></div>
                  <div>Spike Threshold: <span className="font-medium text-slate-800">+{c.priceSpikeThresholdPercent}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Markets Master */}
      {activeTab === 'markets' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Approved Phase I Regional Tamil Nadu Mandis</h3>
            <p className="text-slate-500">Official 5 Tamil Nadu Markets: Koyambedu (Chennai), Coimbatore, Madurai, Tiruchirappalli, Salem.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2 px-3">Market / Mandi Name</th>
                  <th className="py-2 px-3">District</th>
                  <th className="py-2 px-3">Market Classification</th>
                  <th className="py-2 px-3 text-right">Avg Daily Arrivals</th>
                  <th className="py-2 px-3 text-center">GIS Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {markets.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.nameTamil}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{m.district}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.marketType}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{m.averageDailyArrivalTonnes} MT/day</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 text-[11px]">
                      {m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
