/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CommodityMeta,
  MarketMeta,
  ForecastResponse,
  BufferStockRecord,
  PageId,
} from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import {
  Building2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  FileText,
  Printer,
  Download,
  Info,
  Layers,
  Scale,
} from 'lucide-react';

interface GovernmentDashboardProps {
  commodities: CommodityMeta[];
  forecasts: Record<string, ForecastResponse>;
  selectedCommodity: CommodityMeta;
  setSelectedCommodity: (c: CommodityMeta) => void;
  onNavigate: (page: PageId) => void;
  t: TranslationDictionary;
  lang: 'en' | 'ta';
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  commodities,
  forecasts,
  selectedCommodity,
  setSelectedCommodity,
  onNavigate,
  t,
  lang,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '30d' | '90d'>('30d');

  // Buffer-stock illustrative demonstration benchmarks (simulated for academic review)
  const bufferBenchmarks: Record<string, { currentStockLMT: number; normLMT: number; facility: string }> = {
    onion: { currentStockLMT: 2.15, normLMT: 3.0, facility: 'TNCSC & CWC Central Hubs (Illustrative PSF Reserve Benchmark)' },
    potato: { currentStockLMT: 1.62, normLMT: 1.5, facility: 'State Cold Storage Network (Illustrative Benchmark)' },
    rice: { currentStockLMT: 142.5, normLMT: 135.0, facility: 'FCI Operational Reserve & TNCSC Warehouses (Illustrative Reserve)' },
    tomato: { currentStockLMT: 0, normLMT: 0, facility: 'Perishable Produce (Intervention via Mobile Direct Sales Vans)' },
  };

  // High-Risk commodity evaluation
  const commodityAnalysis = commodities.map(c => {
    const fc = forecasts[c.id];
    const buffer = bufferBenchmarks[c.id] || { currentStockLMT: 0, normLMT: 0, facility: 'N/A' };
    const pctChange = fc
      ? selectedHorizon === '7d'
        ? fc.multiHorizon.horizon7d.percentageChange
        : selectedHorizon === '30d'
        ? fc.multiHorizon.horizon30d.percentageChange
        : fc.forecastPercentageChange
      : 0;

    const modal = fc?.latestObservedPrice || 2200;
    const predicted = fc
      ? selectedHorizon === '7d'
        ? fc.multiHorizon.horizon7d.predictedPrice
        : selectedHorizon === '30d'
        ? fc.multiHorizon.horizon30d.predictedPrice
        : fc.forecastPriceDay90
      : modal;

    const isTa = lang === 'ta';

    // Buffer-stock advisory logic
    let advisory = isTa
      ? 'சாதாரண சந்தை நிலவரம்: வழக்கமான வரத்தை கண்காணிக்கவும்.'
      : 'Normal Market Operation: Monitor regular arrivals.';
    let advisoryType: 'release' | 'procurement' | 'neutral' = 'neutral';

    if (c.id === 'onion' && pctChange >= 15) {
      advisory = isTa
        ? 'இடைக்கால கையிருப்பு வெளியீட்டு வழிகாட்டுதல்: விலைவாசி உயர்வு (+18.8%). மொத்த பணவீக்கத்தைக் கட்டுப்படுத்த PSF இருப்பிலிருந்து 20,000 டன் வெங்காயத்தை சந்தைக்கு வெளியிட பரிசீலிக்கவும்.'
        : 'Buffer-Stock Release Advisory: Significant price spike projected (+18.8%). Review calibrated release of 20,000 MT from PSF reserve to cool wholesale inflation.';
      advisoryType = 'release';
    } else if (c.id === 'rice' && pctChange <= -5) {
      advisory = isTa
        ? 'அரசு நேரடி கொள்முதல் வழிகாட்டுதல்: அறுவடைக்குப் பின் விலை சரிவு (-6.4%). விவசாயிகளின் ஆதார விலையை (MSP) பாதுகாக்க நேரடி கொள்முதல் நிலையங்களை (DPC) துரிதப்படுத்தவும்.'
        : 'Government Procurement Advisory: Seasonal post-kharif price drop expected (-6.4%). Accelerate Direct Procurement Centre (DPC) operations to defend farmer MSP.';
      advisoryType = 'procurement';
    } else if (c.id === 'tomato' && pctChange >= 20) {
      advisory = isTa
        ? 'சந்தை தலையீட்டு வழிகாட்டுதல்: தக்காளி விலை ஏற்றம் (+24%). பண்ணை பசுமை நுகர்வோர் நடமாடும் வாகனங்கள் மூலம் நேரடி விற்பனையை ஒருங்கிணைக்கவும்.'
        : 'Market Intervention Advisory: Perishable vegetable surge (+24%). Coordinate with Horticulture Dept for direct farm-to-consumer mobile sales vans.';
      advisoryType = 'release';
    } else if (c.id === 'potato' && pctChange <= -12) {
      advisory = isTa
        ? 'கொள்முதல் ஆதரவு வழிகாட்டுதல்: சந்தை விலையை நிலைப்படுத்த அரசு குளிர்பதன கிடங்கு சேமிப்பை அதிகரிக்கவும்.'
        : 'Procurement Support Advisory: Cold storage intake recommended to stabilize market price.';
      advisoryType = 'procurement';
    }

    return {
      commodity: c,
      forecast: fc,
      modalPrice: modal,
      predictedPrice: predicted,
      pctChange,
      trend: fc?.trend || 'Stable',
      risk: fc?.risk || 'Low',
      buffer,
      advisory,
      advisoryType,
    };
  });

  const highRiskItems = commodityAnalysis.filter(item => item.risk === 'High' || Math.abs(item.pctChange) >= 15);
  const isTa = lang === 'ta';

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold mb-2 border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isTa ? 'கொள்கை & கையிருப்பு முடிவு ஆதரவு மையம்' : 'Policy & Buffer Decision Support'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {isTa
                ? 'விலைவாசி அபாய கண்காணிப்பு, இடைக்கால கையிருப்பு வழிகாட்டுதல் & அரசு அறிக்கைகள்'
                : 'Price Risk Monitoring, Buffer Stock Advisories & Official Reports'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTa
                ? 'உணவு மற்றும் நுகர்பொருள் வழங்கல் துறை, விலை உறுதிப்படுத்தல் நிதி (PSF) மற்றும் பணவீக்க கண்காணிப்பு.'
                : 'Decision support for Department of Civil Supplies, PSF management, and food inflation monitoring across Tamil Nadu.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isTa ? 'அரசு அறிக்கை தயார் செய்க' : 'Generate Official Report'}</span>
            </button>
          </div>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setSelectedHorizon('7d')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizon === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '7-நாள் கணிப்பு' : '7-Day Horizon'}
            </button>
            <button
              onClick={() => setSelectedHorizon('30d')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizon === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '30-நாள் கணிப்பு' : '30-Day Horizon'}
            </button>
            <button
              onClick={() => setSelectedHorizon('90d')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizon === '90d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '90-நாள் கணிப்பு' : '90-Day Horizon'}
            </button>
          </div>
          <span className="text-xs text-slate-500">
            {isTa ? 'மதிப்பீடு: 4 முக்கிய வேளாண் பயிர்கள்' : 'Evaluating: 4 Core Phase I Commodities'}
          </span>
        </div>
      </div>



      {/* High-Risk Watchlist Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          {isTa
            ? 'விலைவாசி அபாய எச்சரிக்கைப் பட்டியல் & அரசு தலையீட்டுப் பரிந்துரைகள்'
            : 'High-Risk Price Alert Watchlist & Recommended Intervention Actions'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commodityAnalysis.map(item => (
            <div
              key={item.commodity.id}
              className={`p-4 rounded-xl border text-xs space-y-3 ${
                item.advisoryType === 'release'
                  ? 'bg-rose-50/50 border-rose-200'
                  : item.advisoryType === 'procurement'
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {isTa ? item.commodity.nameTamil : item.commodity.name}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {isTa ? item.commodity.name : item.commodity.nameTamil}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                    : `${item.risk} Risk`} ({item.pctChange >= 0 ? '+' : ''}{item.pctChange}%)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60 font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    {isTa ? 'இன்றைய விலை' : 'Current Modal'}
                  </span>
                  <strong className="text-slate-900">₹{item.modalPrice}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    {isTa ? 'எதிர்பார்க்கப்படும் விலை' : 'Projected'}
                  </span>
                  <strong className={item.pctChange >= 0 ? 'text-rose-700' : 'text-blue-700'}>
                    ₹{item.predictedPrice}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    {isTa ? 'கையிருப்பு' : 'Buffer Stock'}
                  </span>
                  <strong className="text-slate-700">
                    {item.buffer.currentStockLMT > 0
                      ? `${item.buffer.currentStockLMT} LMT`
                      : (isTa ? 'விரைவில் அழுகக்கூடியது' : 'Perishable')}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">
                  {isTa ? 'அரசு வழிகாட்டுதல்:' : 'Advisory:'}
                </span>
                {item.advisory}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Official Commodity Decision Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isTa ? 'மாநில அளவிலான பயிர் முடிவு அட்டவணை' : 'Statewide Commodity Intelligence Matrix'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'தமிழ்நாடு முழுவதும் 4 முக்கிய வேளாண் பயிர்களின் நேரடி மற்றும் கணிக்கப்பட்ட விலை நிலவரம்.'
                : 'Covers all 4 Phase I commodities across Tamil Nadu wholesale APMC mandis.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {isTa ? 'அளவு: ரூ./குவிண்டால்' : 'Standard Unit: ₹/Quintal'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">{isTa ? 'பயிர்' : 'Commodity'}</th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'மொத்த விலை' : 'Wholesale Modal'}</th>
                <th className="py-2.5 px-3 text-right">
                  {isTa ? `கணிக்கப்பட்ட விலை (${selectedHorizon === '7d' ? '7-நாள்' : selectedHorizon === '30d' ? '30-நாள்' : '90-நாள்'})` : `Projected (${selectedHorizon})`}
                </th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'மாற்றம்' : 'Exp. Change'}</th>
                <th className="py-2.5 px-3">{isTa ? 'விலைப் போக்கு' : 'Trend'}</th>
                <th className="py-2.5 px-3">{isTa ? 'அபாய நிலை' : 'Risk Level'}</th>
                <th className="py-2.5 px-3">{isTa ? 'கையிருப்பு / விதிமுறை' : 'Buffer Norm / Stock'}</th>
                <th className="py-2.5 px-3">{isTa ? 'அரசு வழிகாட்டுதல்' : 'Official Advisory'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commodityAnalysis.map(item => (
                <tr key={item.commodity.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {isTa ? item.commodity.nameTamil : item.commodity.name}
                    <span className="block text-[10px] text-slate-500 font-normal">
                      {isTa ? (item.commodity.category === 'Vegetables' ? 'காய்கறி' : 'தானியம்') : item.commodity.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{item.modalPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                    ₹{item.predictedPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={item.pctChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.pctChange >= 0 ? '+' : ''}{item.pctChange}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {isTa
                      ? item.trend === 'Increasing'
                        ? 'உயரும் போக்கு'
                        : item.trend === 'Decreasing'
                        ? 'சரியும் போக்கு'
                        : 'நிலையானது'
                      : item.trend}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                        : item.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {item.buffer.currentStockLMT > 0
                      ? `${item.buffer.currentStockLMT} / ${item.buffer.normLMT} LMT`
                      : (isTa ? 'விரைவில் அழுகக்கூடியது' : 'N/A (Perishable)')}
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-[11px] max-w-sm">
                    {item.advisory.split(':')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
