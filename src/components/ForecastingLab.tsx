/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CommodityMeta,
  MarketMeta,
  ForecastResponse,
  MandiRecord,
  ModelAlgorithm,
} from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import { ForecastChart } from './ForecastChart';
import {
  CheckCircle,
  AlertCircle,
  Cpu,
  BarChart3,
  Layers,
  Search,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface ForecastingLabProps {
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
}

export const ForecastingLab: React.FC<ForecastingLabProps> = ({
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
}) => {
  const [selectedHorizonTab, setSelectedHorizonTab] = useState<7 | 30 | 90>(30);
  const isTa = lang === 'ta';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-2 border border-emerald-200">
              <Cpu className="w-3.5 h-3.5" />
              <span>{isTa ? 'விலை கணிப்பு மாதிரி மையம்' : 'Predictive Intelligence Engine'}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {isTa
                ? 'ARIMA, SARIMA, Random Forest, XGBoost & LSTM முன்னறிவிப்பு மையம்'
                : 'ARIMA, SARIMA, Random Forest, XGBoost & LSTM Multi-Horizon Forecaster'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTa
                ? '2024 காலக்கிரம சோதனைத் தொகுப்பில் எதிர்கால தரவு கசிவு இன்றி துல்லியமாக மதிப்பீடு செய்யப்பட்டது.'
                : 'Evaluated strictly on Chronological Out-of-Sample Holdout (2024 test partition) with zero lookahead leakage.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-xs">
              <span className="text-slate-500 mr-1.5">{isTa ? 'பயிர்:' : 'Commodity:'}</span>
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

            <div className="text-xs">
              <span className="text-slate-500 mr-1.5">{isTa ? 'சந்தை:' : 'Market:'}</span>
              <select
                value={selectedMarket.id}
                onChange={e => {
                  const found = markets.find(m => m.id === e.target.value);
                  if (found) setSelectedMarket(found);
                }}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-900 focus:bg-white"
              >
                {markets.map(m => (
                  <option key={m.id} value={m.id}>
                    {isTa ? m.nameTamil.split(',')[0] : m.name.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison Table: MAE, RMSE, MAPE */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">{isTa ? 'மாதிரி (Algorithm)' : 'Algorithm'}</th>
                <th className="py-2.5 px-3">{isTa ? 'மாதிரி வகை' : 'Model Type'}</th>
                <th className="py-2.5 px-3 text-right">MAE ({isTa ? 'ரூ./குவிண்டால்' : '₹/qtl'})</th>
                <th className="py-2.5 px-3 text-right">RMSE ({isTa ? 'ரூ./குவிண்டால்' : '₹/qtl'})</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-800">MAPE (%)</th>
                <th className="py-2.5 px-3 text-right">{isTa ? 'திசை துல்லியம்' : 'Directional Acc.'}</th>
                <th className="py-2.5 px-3 text-center">{isTa ? 'நிலை' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecast.modelMetrics.map(m => (
                <tr
                  key={m.algorithm}
                  className={`hover:bg-slate-50 ${m.selectedForProduction ? 'bg-emerald-50/50 font-semibold' : ''}`}
                >
                  <td className="py-2.5 px-3 font-mono text-slate-900 flex items-center gap-1.5">
                    {m.selectedForProduction && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{m.algorithmName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">
                    {isTa
                      ? m.algorithm === 'arima' || m.algorithm === 'sarima'
                        ? 'புள்ளியியல் காலவரிசை (Time-Series)'
                        : m.algorithm === 'random_forest'
                        ? 'முடிவு மரக் கூட்டமைப்பு (Random Forest)'
                        : m.algorithm === 'xgboost'
                        ? 'கிரேடியன்ட் பூஸ்டிங் (XGBoost)'
                        : 'ஆழ்ந்த நரம்பியல் வலைப்பின்னல் (LSTM)'
                      : m.algorithm === 'arima' || m.algorithm === 'sarima'
                      ? 'Statistical Time-Series'
                      : m.algorithm === 'random_forest'
                      ? 'Ensemble Decision Trees'
                      : m.algorithm === 'xgboost'
                      ? 'Gradient Boosted Trees'
                      : 'Recurrent Neural Network'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">₹{m.mae}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">₹{m.rmse}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">{m.mape}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700">{m.directionalAccuracy}%</td>
                  <td className="py-2.5 px-3 text-center">
                    {m.selectedForProduction ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {isTa ? 'தேர்ந்தெடுக்கப்பட்ட மாதிரி' : 'Top Benchmark'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">{isTa ? 'மதிப்பிடப்பட்டது' : 'Evaluated'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Horizon Visualisation & Comparison */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              {isTa
                ? 'பல காலக்கட்ட விலை கணிப்புகள் (7-நாள், 30-நாள் & 90-நாள் முன்னறிவிப்பு)'
                : 'Multi-Horizon Price Projections (7-Day, 30-Day & 90-Day Forecasts)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? '95% நம்பிக்கை இடைவெளியுடன் கூடிய ஊடாடும் 90-நாள் விலை போக்கு வரைபடம்.'
                : 'Interactive 90-day trajectory with 95% heteroskedastic confidence intervals.'}
            </p>
          </div>

          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setSelectedHorizonTab(7)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizonTab === 7 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '7-நாள் கணிப்பு' : '7-Day Horizon'}
            </button>
            <button
              onClick={() => setSelectedHorizonTab(30)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizonTab === 30 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '30-நாள் கணிப்பு' : '30-Day Horizon'}
            </button>
            <button
              onClick={() => setSelectedHorizonTab(90)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedHorizonTab === 90 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTa ? '90-நாள் கணிப்பு' : '90-Day Horizon'}
            </button>
          </div>
        </div>

        {/* Horizon Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 text-[11px] font-semibold uppercase">
              {isTa ? '7-நாள் உடனடி கணிப்பு' : '7-Day Immediate Horizon'}
            </span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              ₹{forecast.multiHorizon.horizon7d.predictedPrice.toLocaleString()} {isTa ? '/ குவிண்டால்' : '/ qtl'}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {isTa ? 'மாற்றம்:' : 'Change:'}{' '}
              <strong className={forecast.multiHorizon.horizon7d.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {forecast.multiHorizon.horizon7d.percentageChange >= 0 ? '+' : ''}{forecast.multiHorizon.horizon7d.percentageChange}%
              </strong> | MAPE: {forecast.multiHorizon.horizon7d.mape}%
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 text-[11px] font-semibold uppercase">
              {isTa ? '30-நாள் இடைக்கால கணிப்பு' : '30-Day Medium-Term Horizon'}
            </span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              ₹{forecast.multiHorizon.horizon30d.predictedPrice.toLocaleString()} {isTa ? '/ குவிண்டால்' : '/ qtl'}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {isTa ? 'மாற்றம்:' : 'Change:'}{' '}
              <strong className={forecast.multiHorizon.horizon30d.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {forecast.multiHorizon.horizon30d.percentageChange >= 0 ? '+' : ''}{forecast.multiHorizon.horizon30d.percentageChange}%
              </strong> | MAPE: {forecast.multiHorizon.horizon30d.mape}%
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 text-[11px] font-semibold uppercase">
              {isTa ? '90-நாள் நீண்டகால கணிப்பு' : '90-Day Strategic Horizon'}
            </span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              ₹{forecast.multiHorizon.horizon90d.predictedPrice.toLocaleString()} {isTa ? '/ குவிண்டால்' : '/ qtl'}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {isTa ? 'மாற்றம்:' : 'Change:'}{' '}
              <strong className={forecast.multiHorizon.horizon90d.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {forecast.multiHorizon.horizon90d.percentageChange >= 0 ? '+' : ''}{forecast.multiHorizon.horizon90d.percentageChange}%
              </strong> | MAPE: {forecast.multiHorizon.horizon90d.mape}%
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <ForecastChart
          historicalRecords={historicalRecords}
          forecastSeries={forecast.forecastSeries}
          commodityName={isTa ? selectedCommodity.nameTamil : selectedCommodity.name}
          marketName={isTa ? selectedMarket.nameTamil : selectedMarket.name}
          unit={isTa ? 'ரூ./குவிண்டால்' : '₹/Quintal'}
          isRegionalPool={forecast.validationDiagnostic.tier === 'tier_2_regional_pool'}
        />

        {/* Explainability & Feature Attribution */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isTa ? 'விலை கணிப்புக்கான முக்கிய காரணிகள் (SHAP Feature Importance)' : 'Feature Attribution & Contribution (Frontend Demonstration)'}
            </h4>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {isTa ? 'அக்மார்க்நெட் மற்றும் பருவகால காரணிகள் மூலம் கணிக்கப்பட்டது' : 'Computed from normalized test feature vectors'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {forecast.featureImportance.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">
                    {isTa ? item.featureTamil : item.feature}
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">{(item.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${item.importance * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  {isTa ? item.explanationTamil : item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
