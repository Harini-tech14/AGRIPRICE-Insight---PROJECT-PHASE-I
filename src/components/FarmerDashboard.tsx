/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CommodityMeta,
  MarketMeta,
  ForecastResponse,
  MandiRecord,
} from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import { ForecastChart } from './ForecastChart';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Calendar,
  Compass,
  Store,
  Info,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface FarmerDashboardProps {
  selectedCommodity: CommodityMeta;
  setSelectedCommodity: (c: CommodityMeta) => void;
  selectedMarket: MarketMeta;
  setSelectedMarket: (m: MarketMeta) => void;
  commodities: CommodityMeta[];
  markets: MarketMeta[];
  forecast: ForecastResponse;
  historicalRecords: MandiRecord[];
  allRecords: MandiRecord[];
  t: TranslationDictionary;
  lang: 'en' | 'ta';
  unit: 'kg' | 'quintal';
  setUnit: (u: 'kg' | 'quintal') => void;
  userName?: string;
  onNavigateToForecasting: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  selectedCommodity,
  setSelectedCommodity,
  selectedMarket,
  setSelectedMarket,
  commodities,
  markets,
  forecast,
  historicalRecords,
  allRecords,
  t,
  lang,
  unit,
  setUnit,
  userName = 'Murugan S.',
  onNavigateToForecasting,
}) => {
  const isTa = lang === 'ta';
  const divisor = unit === 'kg' ? 100 : 1;
  const unitLabel = unit === 'kg' 
    ? (isTa ? 'ரூ. / கிலோ' : '₹ / kg')
    : (isTa ? 'ரூ. / குவிண்டால்' : '₹ / quintal');

  const curPrice = Math.round((forecast.latestObservedPrice / divisor) * 10) / 10;
  const p7 = Math.round((forecast.multiHorizon.horizon7d.predictedPrice / divisor) * 10) / 10;
  const p30 = Math.round((forecast.multiHorizon.horizon30d.predictedPrice / divisor) * 10) / 10;
  const p90 = Math.round((forecast.forecastPriceDay90 / divisor) * 10) / 10;

  // Regional market comparison across the 5 Tamil Nadu mandis
  const marketComparisons = markets.map(m => {
    const records = allRecords.filter(
      r =>
        r.commodity.toLowerCase().includes(selectedCommodity.id.toLowerCase()) &&
        r.market.toLowerCase().includes(m.id.toLowerCase())
    );
    const latest = records[records.length - 1];
    const rawPrice = latest ? latest.modalPrice : 2200;
    const displayPrice = Math.round((rawPrice / divisor) * 10) / 10;
    const diff = displayPrice - curPrice;

    return {
      market: m,
      price: displayPrice,
      diff,
      isCurrent: m.id === selectedMarket.id,
    };
  });

  // Farmer recommendation logic based on documented price trend and risk level
  const trend = forecast.trend;
  const risk = forecast.risk;
  const pctChange30 = forecast.multiHorizon.horizon30d.percentageChange;

  let recommendationTitle = isTa
    ? 'சாதகமான சந்தை: சந்தைக்கு சீராக அனுப்பி விற்பனை செய்க'
    : 'Favorable Market Condition: Gradual Selling Recommended';
  let recommendationDetails = isTa
    ? 'அடுத்த 30 நாட்களில் விலை நிலையாக இருக்கும் என்று கணிக்கப்படுகிறது. அறுவடையை தேவையற்ற முறையில் தாமதிக்காமல் அருகிலுள்ள சந்தைக்கு வழக்கம்போல் அனுப்பவும்.'
    : 'Prices are expected to remain stable over the next 30 days. Plan regular market arrivals in nearby mandis without delaying harvests.';
  let recommendationBadge = isTa ? 'படிப்படியாக விற்பனை செய்க' : 'SELL IN BATCHES';

  if (trend === 'Increasing' && pctChange30 >= 10) {
    recommendationTitle = isTa
      ? 'வலுவான விலை உயர்வு போக்கு: அறுவடையை தாமதித்து கையிருப்பில் வைக்கலாம்'
      : 'Strong Upward Price Trend: Consider Holding / Staggered Harvest';
    recommendationDetails = isTa
      ? `அடுத்த 30 நாட்களில் விலை +${pctChange30}% வரை உயர வாய்ப்புள்ளது. சேமிப்பு வசதி இருப்பின் சில நாட்கள் தாமதித்து விற்கலாம்.`
      : `Prices are projected to increase by +${pctChange30}% over the next 30 days. For commodities with adequate shelf-life, staggered harvesting or holding short-term yields higher returns.`;
    recommendationBadge = isTa ? 'கையிருப்பில் வைக்கவும்' : 'CONSIDER HOLDING';
  } else if (trend === 'Decreasing' && pctChange30 <= -8) {
    recommendationTitle = isTa
      ? 'விலை சரியும் போக்கு: அறுவடை ஆனவுடன் தாமதிக்காமல் விற்கவும்'
      : 'Softening Price Trend: Early Market Realization Recommended';
    recommendationDetails = isTa
      ? `அடுத்த 30 நாட்களில் சந்தை வரத்து அதிகரித்து விலை ${pctChange30}% வரை சரியக்கூடும். விலை மேலும் குறைவதற்கு முன் அறுவடை செய்தவுடன் விற்க பரிந்துரைக்கப்படுகிறது.`
      : `Prices are projected to soften by ${pctChange30}% due to higher seasonal crop arrivals. Selling upon harvest maturity is advised to protect farm-gate price realization.`;
    recommendationBadge = isTa ? 'உடனே விற்பனை செய்க' : 'SELL PROMPTLY';
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-800/80 text-emerald-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTa ? 'விவசாயிகள் முடிவு ஆதரவு தளம்' : 'Farmer Decision Support Portal'}</span>
            </div>
            <h2 className="text-xl font-bold">
              {isTa ? `வணக்கம், ${userName}` : `Welcome, ${userName}`}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isTa
                ? 'உங்கள் பயிருக்கான உள்ளூர் சந்தை நிலவரம், எதிர்கால விலை கணிப்புகள் மற்றும் நேரடி வழிகாட்டுதல்கள்.'
                : 'Localized agricultural market intelligence, future price forecasts, and transparent market recommendations for your crop.'}
            </p>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            <span className="text-slate-400 pl-2">{isTa ? 'அளவு முறை:' : 'Display Unit:'}</span>
            <button
              onClick={() => setUnit('kg')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                unit === 'kg' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isTa ? 'ரூ. / கிலோ (1 kg)' : '₹ / Kilogram (1 kg)'}
            </button>
            <button
              onClick={() => setUnit('quintal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                unit === 'quintal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isTa ? 'ரூ. / குவிண்டால் (100 kg)' : '₹ / Quintal (100 kg)'}
            </button>
          </div>
        </div>
      </div>

      {/* Commodity & Market Selectors */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isTa ? 'வேளாண் பயிரைத் தேர்ந்தெடுக்கவும்:' : 'Select Agricultural Commodity:'}
            </label>
            <select
              value={selectedCommodity.id}
              onChange={e => {
                const found = commodities.find(c => c.id === e.target.value);
                if (found) setSelectedCommodity(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2 text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              {commodities.map(c => (
                <option key={c.id} value={c.id}>
                  {isTa ? `${c.nameTamil} (${c.name})` : `${c.name} (${c.nameTamil})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isTa ? 'முதன்மை சந்தையைத் தேர்ந்தெடுக்கவும்:' : 'Select Primary Local Mandi / Market:'}
            </label>
            <select
              value={selectedMarket.id}
              onChange={e => {
                const found = markets.find(m => m.id === e.target.value);
                if (found) setSelectedMarket(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2 text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              {markets.map(m => (
                <option key={m.id} value={m.id}>
                  {isTa ? `${m.nameTamil} (${m.district})` : `${m.name} (${m.district})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 6 Core Price and Trend Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? 'இன்றைய நேரடி விலை' : 'Current Modal Price'}
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
            ₹{curPrice.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{unitLabel}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? '7-நாள் கணிப்பு' : '7-Day Forecast'}
          </span>
          <div className="text-xl font-bold text-emerald-800 font-mono mt-1">
            ₹{p7.toLocaleString()}
          </div>
          <span className={`text-[10px] font-semibold ${forecast.multiHorizon.horizon7d.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {forecast.multiHorizon.horizon7d.percentageChange >= 0 ? '+' : ''}{forecast.multiHorizon.horizon7d.percentageChange}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? '30-நாள் கணிப்பு' : '30-Day Forecast'}
          </span>
          <div className="text-xl font-bold text-blue-800 font-mono mt-1">
            ₹{p30.toLocaleString()}
          </div>
          <span className={`text-[10px] font-semibold ${forecast.multiHorizon.horizon30d.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {forecast.multiHorizon.horizon30d.percentageChange >= 0 ? '+' : ''}{forecast.multiHorizon.horizon30d.percentageChange}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? '90-நாள் கணிப்பு' : '90-Day Forecast'}
          </span>
          <div className="text-xl font-bold text-purple-800 font-mono mt-1">
            ₹{p90.toLocaleString()}
          </div>
          <span className={`text-[10px] font-semibold ${forecast.forecastPercentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {forecast.forecastPercentageChange >= 0 ? '+' : ''}{forecast.forecastPercentageChange}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? 'விலைப் போக்கு' : 'Price Trend'}
          </span>
          <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1">
            {trend === 'Increasing' && <TrendingUp className="w-4 h-4 text-emerald-600" />}
            {trend === 'Decreasing' && <TrendingDown className="w-4 h-4 text-rose-600" />}
            {trend === 'Stable' && <Minus className="w-4 h-4 text-slate-400" />}
            <span>
              {isTa
                ? trend === 'Increasing'
                  ? 'உயரும் போக்கு'
                  : trend === 'Decreasing'
                  ? 'சரியும் போக்கு'
                  : 'நிலையான விலை'
                : trend}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {isTa ? 'கணிக்கப்பட்ட போக்கு' : 'Documented Trend'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">
            {isTa ? 'விலை அபாய நிலை' : 'Price Risk Level'}
          </span>
          <div className="mt-1">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold inline-block ${
                risk === 'High'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : risk === 'Medium'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isTa
                ? risk === 'High'
                  ? 'அதிக அபாயம்'
                  : risk === 'Medium'
                  ? 'நடுத்தர அபாயம்'
                  : 'குறைந்த அபாயம்'
                : `${risk} Risk`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {isTa ? 'விலை மாறுபாடு:' : 'Volatility Score:'} {forecast.volatilityScore}%
          </span>
        </div>
      </div>

      {/* Farmer Market Recommendation Advisory Card */}
      <div className="bg-white border-2 border-emerald-500/30 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {isTa ? 'செயல்முறை வழிகாட்டுதல்' : 'Actionable Advisory'}
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {recommendationTitle}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-bold text-xs">
            {recommendationBadge}
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          {recommendationDetails}
        </p>

        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>
              {isTa ? 'பாதுகாப்பு காலம்:' : 'Shelf Life:'} ~{selectedCommodity.shelfLifeDays} {isTa ? 'நாட்கள்' : 'days'} · {isTa ? 'பிரிவு:' : 'Category:'} {isTa ? (selectedCommodity.category === 'Vegetables' ? 'காய்கறி' : 'தானியம்') : selectedCommodity.category}
            </span>
          </div>
          <button
            onClick={onNavigateToForecasting}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{isTa ? 'முழு ML மாதிரி மதிப்பீட்டைக் காண்க' : 'View Full ML Model Evaluation'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Historical Chart & Forecast */}
      <ForecastChart
        historicalRecords={historicalRecords}
        forecastSeries={forecast.forecastSeries}
        commodityName={isTa ? selectedCommodity.nameTamil : selectedCommodity.name}
        marketName={isTa ? selectedMarket.nameTamil : selectedMarket.name}
        unit={unitLabel}
        isRegionalPool={forecast.validationDiagnostic.tier === 'tier_2_regional_pool'}
      />

      {/* Regional Mandi Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isTa
                ? 'மண்டல சந்தை ஒப்பீடு (தமிழ்நாடு மொத்த விற்பனை சந்தைகள்)'
                : 'Regional Market Comparison (Tamil Nadu Wholesale Mandis)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'அருகிலுள்ள 5 முக்கிய சந்தைகளின் விலையை ஒப்பிட்டு சிறந்த லாபம் தரும் சந்தையைத் தேர்ந்தெடுக்கவும்.'
                : 'Compare wholesale modal prices across the 5 primary markets to identify favorable selling destinations.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {isTa ? 'அளவு:' : 'Unit:'} {unitLabel}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">{isTa ? 'சந்தை / மண்டி' : 'Mandi / Market'}</th>
                <th className="py-2.5 px-3">{isTa ? 'மாவட்டம்' : 'District'}</th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'மொத்த விலை' : 'Wholesale Modal Price'}</th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'விலை வேறுபாடு' : 'Price Spread vs Your Mandi'}</th>
                <th className="py-2.5 px-3 text-center">{isTa ? 'நடவடிக்கை' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketComparisons.map(item => (
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
                  <td className="py-3 px-3 text-slate-600">{item.market.district}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    {item.isCurrent ? (
                      <span className="text-slate-400">{isTa ? 'அடிப்படை (₹0)' : 'Baseline (₹0)'}</span>
                    ) : item.diff > 0 ? (
                      <span className="text-emerald-700">
                        +₹{item.diff.toFixed(1)} {isTa ? 'அதிகம்' : 'higher'}
                      </span>
                    ) : (
                      <span className="text-rose-700">
                        -₹{Math.abs(item.diff).toFixed(1)} {isTa ? 'குறைவு' : 'lower'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.isCurrent ? (
                      <span className="text-[11px] text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded">
                        {isTa ? 'தேர்ந்தெடுக்கப்பட்ட சந்தை' : 'Selected Mandi'}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedMarket(item.market)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        {isTa ? 'இந்த சந்தைக்கு மாறு' : 'Switch Mandi'}
                      </button>
                    )}
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
