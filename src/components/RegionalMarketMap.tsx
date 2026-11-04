/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommodityMeta, MarketMeta, MandiRecord, ForecastResponse } from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import {
  Compass,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Bell,
  MapPin,
  BarChart3,
  Filter,
} from 'lucide-react';

interface RegionalMarketMapProps {
  selectedCommodity: CommodityMeta;
  setSelectedCommodity: (c: CommodityMeta) => void;
  selectedMarket: MarketMeta;
  setSelectedMarket: (m: MarketMeta) => void;
  commodities: CommodityMeta[];
  markets: MarketMeta[];
  allRecords: MandiRecord[];
  forecasts: Record<string, ForecastResponse>;
  t: TranslationDictionary;
  lang: 'en' | 'ta';
}

export const RegionalMarketMap: React.FC<RegionalMarketMapProps> = ({
  selectedCommodity,
  setSelectedCommodity,
  selectedMarket,
  setSelectedMarket,
  commodities,
  markets,
  allRecords,
  forecasts,
  t,
  lang,
}) => {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  // Compute stats for all 5 markets for this commodity
  const marketIntelligence = markets.map(m => {
    const records = allRecords.filter(
      r =>
        r.commodity.toLowerCase().includes(selectedCommodity.id.toLowerCase()) &&
        r.market.toLowerCase().includes(m.id.toLowerCase())
    );
    const latest = records[records.length - 1];
    const prev = records[records.length - 8]; // 7 days prior

    const modal = latest ? latest.modalPrice : 2200;
    const prevModal = prev ? prev.modalPrice : modal;
    const weekChange = Math.round(((modal - prevModal) / (prevModal || 1)) * 1000) / 10;
    const arrival = latest ? latest.arrivalQuantity : m.averageDailyArrivalTonnes;

    // Projected change & risk classification
    let trend: 'Increasing' | 'Decreasing' | 'Stable' = 'Stable';
    if (weekChange >= 5.0) trend = 'Increasing';
    else if (weekChange <= -5.0) trend = 'Decreasing';

    let risk: 'High' | 'Medium' | 'Low' = 'Low';
    if (Math.abs(weekChange) >= 15) risk = 'High';
    else if (Math.abs(weekChange) >= 8) risk = 'Medium';

    return {
      market: m,
      modalPrice: modal,
      prevModalPrice: prevModal,
      weekChange,
      arrivalTonnes: arrival,
      trend,
      risk,
      isCurrent: m.id === selectedMarket.id,
    };
  });

  // Statewide Benchmark (Koyambedu Wholesale Market, Chennai)
  const chennaiBenchmark = marketIntelligence.find(item => item.market.id === 'koyambedu_chennai');
  const benchmarkPrice = chennaiBenchmark ? chennaiBenchmark.modalPrice : 2400;

  // Filtered rows
  const filteredMarkets = marketIntelligence.filter(item => {
    if (selectedRiskFilter === 'all') return true;
    return item.risk === selectedRiskFilter;
  });

  const isTa = lang === 'ta';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-2 border border-emerald-200">
              <Compass className="w-3.5 h-3.5" />
              <span>{isTa ? 'மண்டல சந்தை நுண்ணறிவு' : 'Regional Spatial Analytics'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {isTa
                ? 'தமிழ்நாடு 5 மண்டல சந்தைகளின் நேரடி விலை ஒப்பீடு & அபாய வகைப்பாடு'
                : 'Cross-Mandi Price Comparison & Risk Classification (5 Tamil Nadu Markets)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTa
                ? 'கோயம்பேடு (சென்னை), கோவை, மதுரை, திருச்சி மற்றும் சேலம் சந்தைகளின் விலைப் போக்கு மற்றும் மாறுபாடுகள்.'
                : 'Tracks price spreads and volatility across Koyambedu, Coimbatore, Madurai, Tiruchirappalli, and Salem.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500">{isTa ? 'பயிரைத் தேர்ந்தெடுக்கவும்:' : 'Filter Commodity:'}</span>
            <select
              value={selectedCommodity.id}
              onChange={e => {
                const found = commodities.find(c => c.id === e.target.value);
                if (found) setSelectedCommodity(found);
              }}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-900 focus:bg-white"
            >
              {commodities.map(c => (
                <option key={c.id} value={c.id}>
                  {isTa ? c.nameTamil : c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cross-Market Spread Bar Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4 text-xs">
          {marketIntelligence.map(item => {
            const spreadFromChennai = item.modalPrice - benchmarkPrice;
            return (
              <div
                key={item.market.id}
                onClick={() => setSelectedMarket(item.market)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  item.isCurrent
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">
                    {item.market.district}
                  </span>
                  {item.isCurrent && (
                    <span className="text-emerald-700 font-bold text-[10px]">
                      {isTa ? 'செயலில்' : 'Active'}
                    </span>
                  )}
                </div>
                <div className="text-base font-bold text-slate-900 font-mono">
                  ₹{item.modalPrice.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    {isTa ? '/ குவிண்டால்' : '/ qtl'}
                  </span>
                </div>
                <div className="text-[11px] mt-1 font-semibold flex items-center justify-between">
                  <span className={item.weekChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {item.weekChange >= 0 ? '+' : ''}{item.weekChange}%
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.risk === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : item.risk === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isTa
                      ? item.risk === 'High'
                        ? 'அதிக அபாயம்'
                        : item.risk === 'Medium'
                        ? 'நடுத்தர அபாயம்'
                        : 'குறைந்த அபாயம்'
                      : `${item.risk} Risk`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200/50">
                  {spreadFromChennai === 0
                    ? (isTa ? 'சென்னை அடிப்படை சந்தை' : 'Chennai Benchmark')
                    : `${spreadFromChennai > 0 ? '+' : ''}₹${spreadFromChennai} ${isTa ? 'சென்னை vs' : 'vs Chennai'}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Mandi Comparison Table & Price Risk Classification */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              {isTa ? 'மண்டல சந்தை நுண்ணறிவு அட்டவணை' : 'Regional Market Intelligence Matrix'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'விலைப் போக்கு வகைப்பாடு (உயரும், சரியும், நிலையானது) மற்றும் விலை அபாய நிலை.'
                : 'Classification of market trend (Increasing, Decreasing, Stable) and price risk level (Low, Medium, High).'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{isTa ? 'அபாய வடிகட்டி:' : 'Risk Filter:'}</span>
            <select
              value={selectedRiskFilter}
              onChange={e => setSelectedRiskFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold"
            >
              <option value="all">{isTa ? 'அனைத்து நிலைகளும்' : 'All Risk Levels'}</option>
              <option value="High">{isTa ? 'அதிக அபாயம் மட்டும்' : 'High Risk Only'}</option>
              <option value="Medium">{isTa ? 'நடுத்தர அபாயம் மட்டும்' : 'Medium Risk Only'}</option>
              <option value="Low">{isTa ? 'குறைந்த அபாயம் மட்டும்' : 'Low Risk Only'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">{isTa ? 'சந்தை / மண்டி' : 'Mandi / Market'}</th>
                <th className="py-2.5 px-3">{isTa ? 'மாவட்டம்' : 'District'}</th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'சராசரி விலை (ரூ./குவிண்டால்)' : 'Modal Price (₹/qtl)'}</th>
                <th className="py-2.5 px-3 text-right">{isTa ? '7-நாள் மாற்றம்' : '7-Day Change'}</th>
                <th className="py-2.5 px-3">{isTa ? 'விலைப் போக்கு' : 'Trend Classification'}</th>
                <th className="py-2.5 px-3">{isTa ? 'அபாய நிலை' : 'Risk Level'}</th>
                <th className="py-2.5 px-3">{isTa ? 'காரணம் / விவரம்' : 'Classification Rationale'}</th>
                <th className="py-2.5 px-3 text-center">{isTa ? 'நடவடிக்கை' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMarkets.map(item => (
                <tr
                  key={item.market.id}
                  className={`hover:bg-slate-50 ${item.isCurrent ? 'bg-emerald-50/40 font-semibold' : ''}`}
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      {isTa ? item.market.nameTamil : item.market.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isTa ? item.market.name : item.market.nameTamil}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{item.market.district}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{item.modalPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={item.weekChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.weekChange >= 0 ? '+' : ''}{item.weekChange}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        item.trend === 'Increasing'
                          ? 'text-emerald-700'
                          : item.trend === 'Decreasing'
                          ? 'text-rose-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.trend === 'Increasing' && <TrendingUp className="w-3.5 h-3.5" />}
                      {item.trend === 'Decreasing' && <TrendingDown className="w-3.5 h-3.5" />}
                      {item.trend === 'Stable' && <Minus className="w-3.5 h-3.5" />}
                      <span>
                        {isTa
                          ? item.trend === 'Increasing'
                            ? 'உயரும் போக்கு'
                            : item.trend === 'Decreasing'
                            ? 'சரியும் போக்கு'
                            : 'நிலையானது'
                          : item.trend}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.risk === 'High'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.risk === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isTa
                        ? item.risk === 'High'
                          ? 'அதிக அபாயம்'
                          : item.risk === 'Medium'
                          ? 'நடுத்தர அபாயம்'
                          : 'குறைந்த அபாயம்'
                        : `${item.risk} Risk`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">
                    {item.risk === 'High'
                      ? (isTa ? '15% க்கும் அதிகமான விலையேற்றம்/இறக்கம்; உடனடி கண்காணிப்பு தேவை.' : 'Volatility >15% threshold; rapid inter-week price movement detected.')
                      : item.risk === 'Medium'
                      ? (isTa ? '8-15% நடுத்தர விலை வேறுபாடு மண்டல சந்தைகளில் பதிவாகியுள்ளது.' : 'Moderate price divergence (8-15%) across regional wholesale supply routes.')
                      : (isTa ? 'வழக்கமான வரத்து மற்றும் நிலையான விலை (±8% வரம்பிற்குள்).' : 'Stable arrivals and price dispersion within standard normal deviation (±8%).')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.isCurrent ? (
                      <span className="text-[11px] text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded">
                        {isTa ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected'}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedMarket(item.market)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        {isTa ? 'தேர்வு செய்க' : 'Select'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-Application Price Risk Alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-600" />
          {isTa ? 'செயலில் உள்ள விலை அபாய எச்சரிக்கைகள்' : 'Active In-Application Price-Risk Alerts'}
        </h3>
        <p className="text-xs text-slate-500">
          {isTa
            ? 'விலை மாறுபாடுகள் வரம்பை மீறும் போது தானாகவே உருவாக்கப்படும் எச்சரிக்கைகள்.'
            : 'Generated automatically by the documented risk threshold logic when expected price deviations exceed boundaries.'}
        </p>

        <div className="space-y-2.5 pt-1">
          {marketIntelligence
            .filter(m => m.risk === 'High' || m.risk === 'Medium')
            .map(m => (
              <div
                key={m.market.id}
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
                  m.risk === 'High'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${m.risk === 'High' ? 'text-rose-600' : 'text-amber-600'}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {m.market.name} · {selectedCommodity.name}
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded bg-white/80 border text-[10px]">
                      {m.risk} Risk Alert
                    </span>
                  </div>
                  <p className="text-slate-700">
                    Expected price shift of <strong>{m.weekChange >= 0 ? '+' : ''}{m.weekChange}%</strong>.
                    Modal price is ₹{m.modalPrice}/qtl.
                    {m.risk === 'High'
                      ? ' Exceeds high-volatility threshold. Market intervention watchlist triggered.'
                      : ' Moderate price movement detected. Farmers advised to monitor terminal prices.'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
