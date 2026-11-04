/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BufferStockRecord, CommodityMeta, ForecastResponse } from '../types/agricultural';
import { SUPPORTED_COMMODITIES } from '../data/mandiRepository';

// Authoritative / Benchmark demonstration buffer stock data (labelled clearly as Department of Consumer Affairs / PSF demonstration data)
export const INITIAL_BUFFER_STOCKS: BufferStockRecord[] = [
  {
    commodityId: 'onion',
    commodityName: 'Onion (Big)',
    commodityNameTamil: 'பெரிய வெங்காயம்',
    currentStockLMT: 2.15, // 2.15 Lakh Metric Tonnes (PSF Target 3.0 LMT)
    normRequiredLMT: 3.0,
    storageCapacityUtilization: 71.6,
    lastStockUpdateDate: '2026-10-20',
    source: 'Price Stabilization Fund (PSF) / NAFED Benchmark (Demonstration Registry)',
    procurementRecommended: true,
    procurementTargetLMT: 0.85,
    releaseRecommended: false,
    releaseTargetLMT: 0,
    reviewStatus: 'Watchlist',
    estimatedWholesaleImpactOnReleasePercent: -12.5,
  },
  {
    commodityId: 'potato',
    commodityName: 'Potato (Local/Jyoti)',
    commodityNameTamil: 'உருளைக்கிழங்கு',
    currentStockLMT: 1.62,
    normRequiredLMT: 1.5,
    storageCapacityUtilization: 108.0,
    lastStockUpdateDate: '2026-10-18',
    source: 'State Cold Storage Federation & PSF Demonstration Data',
    procurementRecommended: false,
    procurementTargetLMT: 0,
    releaseRecommended: false,
    releaseTargetLMT: 0,
    reviewStatus: 'Safe',
    estimatedWholesaleImpactOnReleasePercent: -8.0,
  },
  {
    commodityId: 'rice',
    commodityName: 'Rice (Common/Grade A)',
    commodityNameTamil: 'நெல் / அரிசி (கிரேடு ஏ)',
    currentStockLMT: 142.5,
    normRequiredLMT: 135.0,
    storageCapacityUtilization: 105.5,
    lastStockUpdateDate: '2026-10-22',
    source: 'Food Corporation of India (FCI) Operational Reserve Public Norms',
    procurementRecommended: false,
    procurementTargetLMT: 0,
    releaseRecommended: false,
    releaseTargetLMT: 0,
    reviewStatus: 'Safe',
    estimatedWholesaleImpactOnReleasePercent: -4.5,
  },
  {
    commodityId: 'moong',
    commodityName: 'Moong Dal (Green Gram)',
    commodityNameTamil: 'பாசிப்பயறு (பச்சைப்பயறு)',
    currentStockLMT: 3.8,
    normRequiredLMT: 5.0,
    storageCapacityUtilization: 76.0,
    lastStockUpdateDate: '2026-10-15',
    source: 'National Agricultural Cooperative Marketing Federation (NAFED) PSF Pulse Buffer',
    procurementRecommended: true,
    procurementTargetLMT: 1.2,
    releaseRecommended: false,
    releaseTargetLMT: 0,
    reviewStatus: 'Watchlist',
    estimatedWholesaleImpactOnReleasePercent: -10.0,
  },
];

export interface BufferStockEvaluation {
  commodity: CommodityMeta;
  forecastChangePercent: number;
  risk: string;
  stockRecord?: BufferStockRecord;
  actionableDecision: {
    action: 'None' | 'Procure During Glut' | 'Review Buffer Stock' | 'Emergency Open Market Release';
    actionTamil: string;
    urgency: 'Normal' | 'Elevated' | 'Immediate';
    details: string;
    detailsTamil: string;
    suggestedQuantityLMT?: number;
  };
}

export function evaluateBufferStockDecision(
  forecast: ForecastResponse,
  stocks: BufferStockRecord[] = INITIAL_BUFFER_STOCKS
): BufferStockEvaluation {
  const stock = stocks.find(s => s.commodityId === forecast.commodity.id);
  const change = forecast.forecastPercentageChange;

  let action: 'None' | 'Procure During Glut' | 'Review Buffer Stock' | 'Emergency Open Market Release' = 'None';
  let actionTamil = 'நடவடிக்கை தேவையில்லை';
  let urgency: 'Normal' | 'Elevated' | 'Immediate' = 'Normal';
  let details = 'Price movement is within standard seasonal bands. Monitor regular weekly arrivals.';
  let detailsTamil = 'விலை மாற்றம் இயல்பான வரம்பிற்குள் உள்ளது. வழக்கமான வாராந்திர வரவுகளைக் கண்காணிக்கவும்.';
  let suggestedQuantityLMT: number | undefined = undefined;

  // Decision logic
  if (change >= 25) {
    action = 'Emergency Open Market Release';
    actionTamil = 'அவசர வெளிச்சந்தை கையிருப்பு வெளியீடு';
    urgency = 'Immediate';
    suggestedQuantityLMT = stock ? Math.round(stock.currentStockLMT * 0.25 * 10) / 10 : 0.5;
    details = `Projected price surge of +${change}% crosses the ${forecast.commodity.priceSpikeThresholdPercent}% trigger limit. Recommend authorizing calibrated release of ${suggestedQuantityLMT} LMT through targeted wholesale mandis and mobile retail vans to deflate hoarding premiums.`;
    detailsTamil = `எதிர்பார்க்கப்படும் +${change}% விலை உயர்வு எச்சரிக்கை வரம்பை தாண்டியுள்ளது. மொத்த சந்தைகளில் ${suggestedQuantityLMT} லட்சம் மெட்ரிக் டன் கையிருப்பை வெளியிட பரிந்துரைக்கப்படுகிறது.`;
  } else if (change >= 15) {
    action = 'Review Buffer Stock';
    actionTamil = 'கையிருப்பு நிலையை மறுஆய்வு செய்க';
    urgency = 'Elevated';
    details = `Moderate upward pressure (+${change}%). Inspect cold storage stocks and assess transport bottlenecks from major source production belts.`;
    detailsTamil = `மிதமான விலை உயர்வு அழுத்தம் (+${change}%). சேமிப்புக் கிடங்கு கையிருப்பை ஆய்வு செய்து போக்குவரத்து தடைகளை சரிபார்க்கவும்.`;
  } else if (change <= -15) {
    action = 'Procure During Glut';
    actionTamil = 'சந்தை வீழ்ச்சியின் போது கொள்முதல் செய்க';
    urgency = 'Elevated';
    suggestedQuantityLMT = stock ? Math.max(0.2, Math.round((stock.normRequiredLMT - stock.currentStockLMT) * 10) / 10) : 0.4;
    details = `Prices projected to slump by ${change}% (harvest glut). Recommend active market intervention procurement of ${suggestedQuantityLMT} LMT at or above MSP/support price to protect farmer realization.`;
    detailsTamil = `விலை ${change}% வீழ்ச்சியடைய வாய்ப்புள்ளது. விவசாயிகளுக்கு குறைந்தபட்ச ஆதரவு விலையை உறுதி செய்ய ${suggestedQuantityLMT} லட்சம் மெட்ரிக் டன் கொள்முதல் செய்ய பரிந்துரைக்கப்படுகிறது.`;
  }

  return {
    commodity: forecast.commodity,
    forecastChangePercent: change,
    risk: forecast.risk,
    stockRecord: stock,
    actionableDecision: {
      action,
      actionTamil,
      urgency,
      details,
      detailsTamil,
      suggestedQuantityLMT,
    },
  };
}

// Simulate open market release impact on forecasted price series
export function simulateMarketIntervention(
  baseForecast: ForecastResponse,
  releaseQuantityTonnes: number
): {
  adjustedDay90Price: number;
  priceReductionPercent: number;
  coolingEffectPerQuintal: number;
  newTrend: string;
} {
  // Agricultural market arrival elasticity: -0.3 to -0.6
  // Roughly 10,000 tonnes injection into Tamil Nadu terminal markets cools wholesale prices by ~3.5%
  const elasticityFactor = 0.00035; // 3.5% per 10k tonnes
  const coolingPct = Math.min(28, releaseQuantityTonnes * elasticityFactor);
  const coolingRupees = Math.round((baseForecast.forecastPriceDay90 * coolingPct) / 100);
  const adjustedPrice = Math.max(baseForecast.latestObservedPrice * 0.7, baseForecast.forecastPriceDay90 - coolingRupees);
  const priceReductionPercent = Math.round(coolingPct * 10) / 10;

  return {
    adjustedDay90Price: Math.round(adjustedPrice),
    priceReductionPercent,
    coolingEffectPerQuintal: coolingRupees,
    newTrend: adjustedPrice > baseForecast.latestObservedPrice * 1.05 ? 'Increasing (Moderated)' : 'Stabilized',
  };
}
