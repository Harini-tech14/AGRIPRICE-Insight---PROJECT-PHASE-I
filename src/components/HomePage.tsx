/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommodityMeta, MarketMeta, MandiRecord, PageId, UserRole } from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import {
  TrendingUp,
  ShieldCheck,
  Compass,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  Shield,
  Cpu,
  Table,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSetRole: (role: UserRole) => void;
  commodities: CommodityMeta[];
  markets: MarketMeta[];
  allRecords: MandiRecord[];
  userRole: UserRole;
  t: TranslationDictionary;
  lang: 'en' | 'ta';
  lastUpdatedDate: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSetRole,
  commodities,
  markets,
  allRecords,
  userRole,
  t,
  lang,
  lastUpdatedDate,
}) => {
  // Price cards for the 4 Phase I commodities
  const commodityCards = commodities.map(c => {
    const records = allRecords.filter(r => r.commodity.toLowerCase().includes(c.id.toLowerCase()));
    const latest = records[records.length - 1];
    const prev = records[records.length - 8];
    const modal = latest ? latest.modalPrice : 2200;
    const prevModal = prev ? prev.modalPrice : modal;
    const weekChange = Math.round(((modal - prevModal) / (prevModal || 1)) * 1000) / 10;

    return {
      commodity: c,
      modal,
      weekChange,
      marketName: latest?.market || 'Koyambedu Wholesale Market, Chennai',
    };
  });

  const isTa = lang === 'ta';

  return (
    <div className="space-y-6 pb-6">
      {/* Official Project Title & System Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900/40 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-900/60 text-emerald-300 rounded-full border border-emerald-700/50">
            <span>{isTa ? 'அங்கீகரிக்கப்பட்ட கட்டம் I அமைப்பு' : 'Official Phase I Architecture'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-white">
            {isTa
              ? 'வேளாண் பயிர் விலை முன்னறிவிப்பு & மண்டல சந்தை நுண்ணறிவு கொண்ட இடைக்கால கையிருப்பு முடிவு ஆதரவு அமைப்பு'
              : 'AI/ML-Based Agricultural Commodity Price Forecasting and Buffer Stock Decision Support System with Regional Market Intelligence'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {isTa
              ? 'விவசாயிகள், தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம் மற்றும் சந்தை நிர்வாகிகளுக்கான கல்வி சார்ந்த முடிவு ஆதரவு தளம். 7, 30 மற்றும் 90 நாள் பல காலக்கட்ட விலை கணிப்புகள், மண்டல சந்தை விலை ஒப்பீடு மற்றும் தகுந்த கையிருப்பு பரிந்துரைகள்.'
              : 'An academic decision-support platform designed for farmers, state civil supplies officials, and market administrators. Provides multi-horizon price forecasting, regional market intelligence across Tamil Nadu wholesale mandis, and data-driven buffer-stock advisories.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('farmer_dash')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>{isTa ? 'விவசாயிகள் தளம்' : 'Farmer Dashboard'}</span>
            </button>
            <button
              onClick={() => onNavigate('gov_dash')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Building2 className="w-4 h-4" />
              <span>{isTa ? 'அரசு தளம்' : 'Government Portal'}</span>
            </button>
            <button
              onClick={() => onNavigate('forecasting_lab')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>{isTa ? 'மாதிரி முன்னறிவிப்பு மையம்' : 'ML Benchmarking'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Phase I Commodity Price Overview */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isTa ? 'முக்கிய வேளாண் பயிர்கள் நேரடி விலை' : 'Approved Phase I Agricultural Commodities'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? '2021–2024 கடந்த கால மற்றும் நேரடி சந்தை சராசரி விலைகள் (ரூ./குவிண்டால்).'
                : 'Historical baseline (2021–2024) and live market modal prices in ₹/quintal.'}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {isTa ? 'சமீபத்திய பதிவு:' : 'Latest Observation:'} {lastUpdatedDate}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commodityCards.map(item => (
            <div
              key={item.commodity.id}
              onClick={() => onNavigate('farmer_dash')}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {isTa ? item.commodity.nameTamil : item.commodity.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isTa ? item.commodity.name : item.commodity.nameTamil}
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">
                ₹{item.modal.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-1">
                  {isTa ? '/ குவிண்டால்' : '/ qtl'}
                </span>
              </div>
              <div className="text-[11px] font-semibold flex items-center justify-between pt-1 border-t border-slate-100">
                <span className={item.weekChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                  {item.weekChange >= 0 ? '+' : ''}{item.weekChange}% {isTa ? '(7-நாள் போக்கு)' : '(7-day trend)'}
                </span>
                <span className="text-slate-400 font-normal truncate max-w-[100px]">
                  {isTa
                    ? item.commodity.category === 'Vegetables'
                      ? 'காய்கறி'
                      : 'தானியம்'
                    : item.commodity.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Capabilities Showcase */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {isTa ? 'முக்கிய தள சேவைகள் & நுண்ணறிவு' : 'Core Platform Features & Intelligence'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('auth')}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-300 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">
              {isTa ? 'பாதுகாப்பான பயனர் அணுகல்' : 'Secure Role-Based Access'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {isTa
                ? 'விவசாயிகள், அரசு கொள்கை அதிகாரிகள் மற்றும் கணினி நிர்வாகிகளுக்கான பிரத்யேக தளங்கள் மற்றும் பாதுகாப்பு அங்கீகாரம்.'
                : 'Tailored workspaces for Farmers, Government Policy Officials, and System Administrators with authenticated sessions.'}
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('forecasting_lab')}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-300 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">
              {isTa ? 'பல மாதிரி விலை முன்னறிவிப்பு' : 'Multi-Model Price Forecasting'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {isTa
                ? 'ARIMA, SARIMA, Random Forest, XGBoost மற்றும் LSTM ஒப்பீட்டு பகுப்பாய்வு மூலம் 7, 30 மற்றும் 90 நாள் விலை கணிப்பு.'
                : 'Multi-horizon 7, 30, and 90-day projections comparing ARIMA, SARIMA, Random Forest, XGBoost, and LSTM with holdout evaluation.'}
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('regional_map')}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-300 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">
              {isTa ? 'மண்டல சந்தை நுண்ணறிவு' : 'Regional Mandi Intelligence'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {isTa
                ? 'கோயம்பேடு, கோவை, மதுரை, திருச்சி மற்றும் சேலம் சந்தைகளின் நேரடி விலை, வரத்து வேறுபாடுகள் மற்றும் விலை ஏற்ற இறக்க எச்சரிக்கை.'
                : 'Live price spreads and volatility detection across Koyambedu, Coimbatore, Madurai, Tiruchirappalli, and Salem mandis.'}
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('farmer_dash')}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-300 transition-colors cursor-pointer space-y-1.5"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">
              {isTa ? 'முடிவு ஆதரவு தளங்கள்' : 'Decision Support Systems'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {isTa
                ? 'விவசாயிகளுக்கான அறுவடை வழிகாட்டுதல் (விற்பனை vs சேமிப்பு) மற்றும் அரசுக்கான இடைக்கால கையிருப்பு கண்காணிப்பு.'
                : 'Actionable harvest advisories (Sell vs. Hold) for growers alongside strategic buffer-stock monitoring and printable policy reports for state authorities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
