/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ForecastPoint, MandiRecord } from '../types/agricultural';

interface ForecastChartProps {
  historicalRecords: MandiRecord[];
  forecastSeries: ForecastPoint[];
  commodityName: string;
  marketName: string;
  unit: string;
  isRegionalPool?: boolean;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  historicalRecords,
  forecastSeries,
  commodityName,
  marketName,
  unit,
  isRegionalPool = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    price: number;
    isForecast: boolean;
    lower?: number;
    upper?: number;
    x: number;
    y: number;
  } | null>(null);

  // Take the last 60 days of historical records for clean visual continuity
  const recentHistory = historicalRecords.slice(-60);
  if (recentHistory.length === 0 && forecastSeries.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
        Insufficient data points to render time-series chart.
      </div>
    );
  }

  // Combine points to calculate Y min and max
  const allPrices: number[] = [
    ...recentHistory.map(r => r.modalPrice),
    ...forecastSeries.map(p => p.predictedPrice),
    ...forecastSeries.map(p => p.lowerBound95),
    ...forecastSeries.map(p => p.upperBound95),
  ].filter(p => !isNaN(p) && p > 0);

  const minPrice = Math.max(0, Math.floor((Math.min(...allPrices) * 0.9) / 100) * 100);
  const maxPrice = Math.ceil((Math.max(...allPrices) * 1.1) / 100) * 100;
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions
  const width = 850;
  const height = 320;
  const padLeft = 65;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 35;

  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;

  const totalPoints = recentHistory.length + forecastSeries.length;
  const getX = (index: number) => padLeft + (index / (totalPoints - 1 || 1)) * innerWidth;
  const getY = (val: number) => padTop + innerHeight - ((val - minPrice) / priceRange) * innerHeight;

  // Construct SVG paths
  // 1. Historical line
  let historyPath = '';
  recentHistory.forEach((r, idx) => {
    const x = getX(idx);
    const y = getY(r.modalPrice);
    historyPath += idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  // 2. Forecast line (starts from last historical point)
  let forecastPath = '';
  const lastHistIdx = recentHistory.length - 1;
  const lastHistRecord = recentHistory[lastHistIdx];
  if (lastHistRecord) {
    forecastPath = `M ${getX(lastHistIdx)} ${getY(lastHistRecord.modalPrice)}`;
  }
  forecastSeries.forEach((p, idx) => {
    const globalIdx = recentHistory.length + idx;
    const x = getX(globalIdx);
    const y = getY(p.predictedPrice);
    forecastPath += ` L ${x} ${y}`;
  });

  // 3. Confidence Interval Polygon
  let upperPoints: string[] = [];
  let lowerPoints: string[] = [];
  if (lastHistRecord) {
    const startX = getX(lastHistIdx);
    const startY = getY(lastHistRecord.modalPrice);
    upperPoints.push(`${startX},${startY}`);
    lowerPoints.push(`${startX},${startY}`);
  }
  forecastSeries.forEach((p, idx) => {
    const globalIdx = recentHistory.length + idx;
    const x = getX(globalIdx);
    upperPoints.push(`${x},${getY(p.upperBound95)}`);
    lowerPoints.push(`${x},${getY(p.lowerBound95)}`);
  });
  lowerPoints.reverse();
  const confidenceBandPath = upperPoints.length > 0 ? `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z` : '';

  // Y-axis grid ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = Math.round(minPrice + ratio * priceRange);
    return { val, y: getY(val) };
  });

  // X-axis key dates
  const xLabels = [
    { label: recentHistory[0]?.date || '', x: getX(0) },
    { label: lastHistRecord?.date || 'Today', x: getX(lastHistIdx) },
    { label: forecastSeries[44]?.date || '+45d', x: getX(recentHistory.length + 44) },
    { label: forecastSeries[89]?.date || '+90d', x: getX(totalPoints - 1) },
  ];

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {commodityName} Wholesale Trajectory (Past 60d Observed + 90d Projection)
          </h3>
          <p className="text-xs text-slate-500">
            {marketName} {isRegionalPool && '· Hierarchical Regional Pool (+35% widened confidence)'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span>
            <span>Observed Mandi Price</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 border-t border-dashed border-blue-600 inline-block"></span>
            <span>90-Day ML Projection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-blue-100 border border-blue-200 inline-block rounded-xs"></span>
            <span>95% Confidence Band</span>
          </div>
        </div>
      </div>

      <div className="relative mt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={width - padRight}
                y2={t.y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={t.y + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400 tabular-nums"
              >
                ₹{t.val}
              </text>
            </g>
          ))}

          {/* Vertical marker for T0 (transition to forecast) */}
          {lastHistRecord && (
            <g>
              <line
                x1={getX(lastHistIdx)}
                y1={padTop}
                x2={getX(lastHistIdx)}
                y2={height - padBottom}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={getX(lastHistIdx)}
                y={padTop - 6}
                textAnchor="middle"
                className="text-[10px] font-medium fill-slate-500 uppercase tracking-wider"
              >
                Forecast Horizon Starts →
              </text>
            </g>
          )}

          {/* Shaded 95% Confidence Interval Band */}
          {confidenceBandPath && (
            <path d={confidenceBandPath} fill="url(#confidenceGrad)" />
          )}

          {/* Upper and Lower Envelope Lines */}
          {forecastSeries.length > 0 && (
            <>
              <path
                d={`M ${upperPoints.join(' L ')}`}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <path
                d={`M ${lowerPoints.reverse().join(' L ')}`}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </>
          )}

          {/* Historical Price Line */}
          <path
            d={historyPath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 90-Day Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Latest observed anchor dot */}
          {lastHistRecord && (
            <circle
              cx={getX(lastHistIdx)}
              cy={getY(lastHistRecord.modalPrice)}
              r="4.5"
              fill="#059669"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}

          {/* Day 90 final projection dot */}
          {forecastSeries.length > 0 && (
            <circle
              cx={getX(totalPoints - 1)}
              cy={getY(forecastSeries[forecastSeries.length - 1].predictedPrice)}
              r="4.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}

          {/* Invisible hover trigger zones across the timeline */}
          {recentHistory.map((r, idx) => {
            const x = getX(idx);
            const y = getY(r.modalPrice);
            return (
              <rect
                key={`h_hit_${idx}`}
                x={x - innerWidth / (totalPoints * 2)}
                y={padTop}
                width={innerWidth / totalPoints}
                height={innerHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() =>
                  setHoveredPoint({
                    date: r.date,
                    price: r.modalPrice,
                    isForecast: false,
                    x,
                    y,
                  })
                }
              />
            );
          })}

          {forecastSeries.map((p, idx) => {
            const globalIdx = recentHistory.length + idx;
            const x = getX(globalIdx);
            const y = getY(p.predictedPrice);
            return (
              <rect
                key={`f_hit_${idx}`}
                x={x - innerWidth / (totalPoints * 2)}
                y={padTop}
                width={innerWidth / totalPoints}
                height={innerHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() =>
                  setHoveredPoint({
                    date: p.date,
                    price: p.predictedPrice,
                    isForecast: true,
                    lower: p.lowerBound95,
                    upper: p.upperBound95,
                    x,
                    y,
                  })
                }
              />
            );
          })}

          {/* Active hover crosshair indicator */}
          {hoveredPoint && (
            <g pointerEvents="none">
              <line
                x1={hoveredPoint.x}
                y1={padTop}
                x2={hoveredPoint.x}
                y2={height - padBottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill={hoveredPoint.isForecast ? '#2563eb' : '#059669'}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X-axis labels */}
          {xLabels.map((xl, idx) => (
            <text
              key={idx}
              x={xl.x}
              y={height - padBottom + 18}
              textAnchor={idx === 0 ? 'start' : idx === xLabels.length - 1 ? 'end' : 'middle'}
              className="text-[10px] font-mono fill-slate-400"
            >
              {xl.label}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/90 text-white rounded-lg px-3 py-2 text-xs shadow-lg backdrop-blur-xs border border-slate-700"
            style={{
              left: Math.min(Math.max(10, hoveredPoint.x - 70), width - 160),
              top: Math.max(10, hoveredPoint.y - 85),
            }}
          >
            <div className="font-semibold text-slate-200">{hoveredPoint.date}</div>
            <div className="text-sm font-bold text-white tabular-nums">
              ₹{hoveredPoint.price.toLocaleString()} <span className="text-xs font-normal text-slate-300">{unit}</span>
            </div>
            {hoveredPoint.isForecast ? (
              <div className="text-[11px] text-blue-200 mt-0.5 tabular-nums">
                95% CI: ₹{hoveredPoint.lower} – ₹{hoveredPoint.upper}
              </div>
            ) : (
              <div className="text-[11px] text-emerald-300 mt-0.5">Observed AGMARKNET Modal</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <span>Unit: ₹ per Quintal (100 kg)</span>
        <span>
          Note: Confidence envelope widens as forecast horizon advances ($t+1$ to $t+90$) to reflect empirical time-decay uncertainty.
        </span>
      </div>
    </div>
  );
};
