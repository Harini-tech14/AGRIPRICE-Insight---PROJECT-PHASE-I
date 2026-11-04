/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommodityMeta, MarketMeta, MandiRecord } from '../types/agricultural';

// 1. STRICT PHASE I COMMODITIES: Tomato, Onion, Potato, Paddy
export const SUPPORTED_COMMODITIES: CommodityMeta[] = [
  {
    id: 'tomato',
    name: 'Tomato (Hybrid)',
    nameTamil: 'தக்காளி (ஹைப்ரிட்)',
    category: 'Vegetables',
    unit: '₹/Quintal',
    shelfLifeDays: 7,
    bufferStockEligible: false,
    priceSpikeThresholdPercent: 30,
  },
  {
    id: 'onion',
    name: 'Onion (Big)',
    nameTamil: 'பெரிய வெங்காயம்',
    category: 'Vegetables',
    unit: '₹/Quintal',
    shelfLifeDays: 30,
    bufferStockEligible: true,
    minBufferNormLMT: 3.0, // 3.0 Lakh Metric Tonnes (Price Stabilization Fund)
    priceSpikeThresholdPercent: 25,
  },
  {
    id: 'potato',
    name: 'Potato (Local/Jyoti)',
    nameTamil: 'உருளைக்கிழங்கு',
    category: 'Vegetables',
    unit: '₹/Quintal',
    shelfLifeDays: 60,
    bufferStockEligible: true,
    minBufferNormLMT: 1.5,
    priceSpikeThresholdPercent: 20,
  },
  {
    id: 'rice',
    name: 'Paddy / Rice (Common Grade A)',
    nameTamil: 'நெல் / அரிசி (கிரேடு ஏ)',
    category: 'Cereals',
    unit: '₹/Quintal',
    shelfLifeDays: 365,
    bufferStockEligible: true,
    minBufferNormLMT: 135.0, // Food Corporation of India Operational Reserve
    priceSpikeThresholdPercent: 12,
  },
];

// 2. STRICT PHASE I MARKETS: 5 Tamil Nadu Mandis
export const REGIONAL_MARKETS: MarketMeta[] = [
  {
    id: 'koyambedu_chennai',
    name: 'Koyambedu Wholesale Market, Chennai',
    nameTamil: 'கோயம்பேடு மொத்த சந்தை, சென்னை',
    district: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0694,
    longitude: 80.1948,
    marketType: 'Major Terminal Mandi',
    averageDailyArrivalTonnes: 850,
  },
  {
    id: 'coimbatore_market',
    name: 'Coimbatore Wholesale Agricultural Market',
    nameTamil: 'கோயம்புத்தூர் மொத்த சந்தை',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    marketType: 'Major Terminal Mandi',
    averageDailyArrivalTonnes: 520,
  },
  {
    id: 'madurai_market',
    name: 'Mattuthavani Central Market, Madurai',
    nameTamil: 'மாட்டுத்தாவணி மத்திய சந்தை, மதுரை',
    district: 'Madurai',
    state: 'Tamil Nadu',
    latitude: 9.9482,
    longitude: 78.1565,
    marketType: 'Wholesale APMC',
    averageDailyArrivalTonnes: 410,
  },
  {
    id: 'trichy_market',
    name: 'Gandhi Market, Tiruchirappalli',
    nameTamil: 'காந்தி சந்தை, திருச்சிராப்பள்ளி',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    latitude: 10.8212,
    longitude: 78.6946,
    marketType: 'Wholesale APMC',
    averageDailyArrivalTonnes: 320,
  },
  {
    id: 'salem_market',
    name: 'Leigh Bazaar Wholesale Market, Salem',
    nameTamil: 'லீ பஜார் மொத்த சந்தை, சேலம்',
    district: 'Salem',
    state: 'Tamil Nadu',
    latitude: 11.6643,
    longitude: 78.1460,
    marketType: 'Wholesale APMC',
    averageDailyArrivalTonnes: 280,
  },
];

// Helper to generate deterministic historical Agmarknet daily price records for 2021-01-01 to 2024-12-31
export function generateSyntheticHistoricalData(): MandiRecord[] {
  const records: MandiRecord[] = [];

  const commodityBaseProfiles: Record<
    string,
    {
      baseModal: number;
      spread: number;
      seasonalityPeakMonth: number; // 0-11
      seasonalityStrength: number;
      annualTrendSlope: number;
      arrivalBaselineTonnes: number;
    }
  > = {
    tomato: {
      baseModal: 2100,
      spread: 450,
      seasonalityPeakMonth: 6, // July summer/monsoon heat spike
      seasonalityStrength: 0.48,
      annualTrendSlope: 0.03,
      arrivalBaselineTonnes: 70,
    },
    onion: {
      baseModal: 2400,
      spread: 350,
      seasonalityPeakMonth: 9, // October pre-kharif spike
      seasonalityStrength: 0.38,
      annualTrendSlope: 0.04,
      arrivalBaselineTonnes: 85,
    },
    potato: {
      baseModal: 1850,
      spread: 180,
      seasonalityPeakMonth: 10, // November pre-fresh harvest
      seasonalityStrength: 0.18,
      annualTrendSlope: 0.02,
      arrivalBaselineTonnes: 110,
    },
    rice: {
      baseModal: 3600,
      spread: 140,
      seasonalityPeakMonth: 7, // August
      seasonalityStrength: 0.08,
      annualTrendSlope: 0.05,
      arrivalBaselineTonnes: 160,
    },
  };

  const marketMultipliers: Record<string, number> = {
    koyambedu_chennai: 1.08, // Metro consumption premium
    coimbatore_market: 1.02,
    madurai_market: 0.98,
    trichy_market: 0.96,
    salem_market: 0.97,
  };

  // Generate historical daily observations across 2021-01-01 to 2024-12-31
  // Sampling weekly or bi-daily across 4 years to yield dense, realistic time series
  const startDate = new Date('2021-01-01');
  const endDate = new Date('2024-12-31');
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  for (const commodity of SUPPORTED_COMMODITIES) {
    const profile = commodityBaseProfiles[commodity.id] || {
      baseModal: 2000,
      spread: 200,
      seasonalityPeakMonth: 6,
      seasonalityStrength: 0.2,
      annualTrendSlope: 0.02,
      arrivalBaselineTonnes: 50,
    };

    for (const market of REGIONAL_MARKETS) {
      const marketMult = marketMultipliers[market.id] || 1.0;

      // Seed for deterministic pseudo-random sequence
      let seed = commodity.id.charCodeAt(0) * 19 + market.id.charCodeAt(1) * 37;
      const pseudoRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      // Sample every 3rd day to produce ~480 contiguous data points per pair across 2021-2024
      for (let dayOffset = 0; dayOffset <= totalDays; dayOffset += 3) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + dayOffset);

        const dateStr = d.toISOString().split('T')[0];
        const month = d.getMonth();
        const yearFraction = (d.getFullYear() - 2021) + month / 12;

        // Seasonal cycle
        const monthDist = Math.abs(month - profile.seasonalityPeakMonth);
        const seasonalFactor = Math.cos((monthDist / 6) * Math.PI) * profile.seasonalityStrength;

        // Long-term 4-year trend drift
        const trendFactor = yearFraction * profile.annualTrendSlope;

        // Realistic variation
        const noise = (pseudoRandom() - 0.5) * 0.08;
        const arrivalNoise = (pseudoRandom() - 0.5) * 0.25;

        const effectiveModal = Math.round(
          profile.baseModal * marketMult * (1 + seasonalFactor + trendFactor + noise)
        );
        const minPrice = Math.max(100, Math.round(effectiveModal - profile.spread * (0.6 + pseudoRandom() * 0.4)));
        const maxPrice = Math.round(effectiveModal + profile.spread * (0.6 + pseudoRandom() * 0.4));
        const arrival = Math.max(5, Math.round(profile.arrivalBaselineTonnes * (1 - seasonalFactor * 0.4 + arrivalNoise)));

        records.push({
          id: `${dateStr}_${market.id}_${commodity.id}`,
          date: dateStr,
          state: market.state,
          district: market.district,
          market: market.name,
          commodity: commodity.name,
          variety: commodity.id === 'tomato' ? 'Hybrid / Desi' : commodity.id === 'onion' ? 'Bellary / Nasik' : 'Standard',
          minPrice,
          maxPrice,
          modalPrice: effectiveModal,
          arrivalQuantity: arrival,
          source: 'Synthetic Benchmark Series (Simulated from AGMARKNET/TN-AMIS Seasonal Profiles)',
          lastUpdated: `${dateStr}T18:30:00.000Z`,
        });
      }
    }
  }

  return records;
}

// Global in-memory data store with initial seed
let inMemoryMandiStore: MandiRecord[] = generateSyntheticHistoricalData();

export function getMandiRecords(): MandiRecord[] {
  return inMemoryMandiStore;
}

export function addMandiRecords(newRecords: MandiRecord[]): { added: number; duplicates: number } {
  const existingKeys = new Set(inMemoryMandiStore.map(r => `${r.date}_${r.market}_${r.commodity}`));
  let added = 0;
  let duplicates = 0;

  for (const rec of newRecords) {
    const key = `${rec.date}_${rec.market}_${rec.commodity}`;
    if (existingKeys.has(key)) {
      duplicates++;
    } else {
      inMemoryMandiStore.push(rec);
      existingKeys.add(key);
      added++;
    }
  }

  // Keep chronologically sorted
  inMemoryMandiStore.sort((a, b) => a.date.localeCompare(b.date));
  return { added, duplicates };
}

export function resetMandiStore(): void {
  inMemoryMandiStore = generateSyntheticHistoricalData();
}

import { SystemAlert } from '../types/agricultural';

export const INITIAL_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 'alert_01',
    title: 'Potential Price Spike Alert (Onion)',
    type: 'critical',
    targetRole: 'all',
    commodity: 'Onion (Big)',
    location: 'Chennai & Madurai Markets',
    horizon: '30 Days',
    predictedChange: 18.8,
    reason: 'Mandi arrival volumes projected to fall by 28% due to pre-kharif transition.',
    recommendedAction: 'Inspect buffer-stock reserves in State Warehousing. Consider open-market intervention advisory.',
    status: 'active',
    timestamp: '2024-12-15T06:00:00.000Z',
  },
  {
    id: 'alert_02',
    title: 'Price Trend Advisory (Tomato)',
    type: 'warning',
    targetRole: 'farmer',
    commodity: 'Tomato (Hybrid)',
    location: 'Coimbatore vs Koyambedu Mandi',
    horizon: '7 Days',
    predictedChange: 14.5,
    reason: 'Farmgate price at Coimbatore is ₹2,050/qtl while Koyambedu wholesale bids are ₹2,480/qtl.',
    recommendedAction: 'Regional price comparison shows favorable returns in terminal markets.',
    status: 'active',
    timestamp: '2024-12-20T05:30:00.000Z',
  },
  {
    id: 'alert_03',
    title: 'MSP Floor Realization Notice (Paddy)',
    type: 'info',
    targetRole: 'government',
    commodity: 'Paddy / Rice (Common Grade A)',
    location: 'Tiruchirappalli Mandi',
    horizon: '90 Days',
    predictedChange: -6.4,
    reason: 'Heavy post-kharif harvest arrivals approaching. Price softening towards minimum support floor.',
    recommendedAction: 'Initiate government direct procurement centre (DPC) preparedness.',
    status: 'active',
    timestamp: '2024-12-24T14:15:00.000Z',
  },
];
