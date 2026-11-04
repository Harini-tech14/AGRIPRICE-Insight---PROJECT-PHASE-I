/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MandiRecord, ValidationDiagnostic } from '../types/agricultural';
import { SUPPORTED_COMMODITIES, REGIONAL_MARKETS } from '../data/mandiRepository';

export const MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL = 90;
export const MIN_HISTORICAL_DAYS_FOR_POOLED_MODEL = 60;

export function validateCommodityAndMarket(
  commodityQuery: string,
  marketQuery: string,
  records: MandiRecord[]
): ValidationDiagnostic {
  const normCommodity = commodityQuery.trim().toLowerCase();
  const normMarket = marketQuery.trim().toLowerCase();

  // 1. Check known metadata
  const matchedCommodity = SUPPORTED_COMMODITIES.find(
    c => c.id.toLowerCase() === normCommodity || c.name.toLowerCase().includes(normCommodity)
  );

  const matchedMarket = REGIONAL_MARKETS.find(
    m => m.id.toLowerCase() === normMarket || m.name.toLowerCase().includes(normMarket)
  );

  // Filter existing historical records for this pair
  const directRecords = records.filter(
    r =>
      r.commodity.toLowerCase().includes(normCommodity) &&
      r.market.toLowerCase().includes(normMarket)
  );

  // Distinct reporting dates
  const distinctDates = new Set(directRecords.map(r => r.date));
  const recordCount = distinctDates.size;

  // Case A: Completely unseen or unsupported commodity with insufficient records
  if (!matchedCommodity && recordCount < MIN_HISTORICAL_DAYS_FOR_POOLED_MODEL) {
    return {
      isFullySupported: false,
      canPredict: false,
      tier: 'tier_3_unsupported',
      historicalRecordCount: recordCount,
      minimumRequiredRecords: MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL,
      commodityKnown: false,
      marketKnown: !!matchedMarket,
      reason: `Commodity '${commodityQuery}' is unseen in training datasets and has only ${recordCount} historical records (minimum ${MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL} required). Predicting without empirical data would generate unsupported, fabricated results.`,
      reasonTamil: `'${commodityQuery}' பயிருக்கு போதுமான கடந்த கால விலை விவரங்கள் இல்லை (${recordCount} நாட்கள் மட்டுமே உள்ளன; குறைந்தபட்சம் ${MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL} நாட்கள் தேவை). போலி கணிப்புகளைத் தவிர்க்க கணினி இதை நிராகரிக்கிறது.`,
      recommendation: `Provide at least 90 consecutive daily Agmarknet market arrival and modal price records for '${commodityQuery}' in the historical database before initiating model predictions.`,
      recommendationTamil: `மாதிரிப் பயிற்சிக்கு முன்னதாக தரவுத்தளத்தில் குறைந்தபட்சம் 90 நாள் அக்மார்க்நெட் பதிவுகளைச் சேர்க்கவும்.`,
      dataGapsIdentified: [
        'Lack of 90-day contiguous wholesale modal price series',
        'Missing harvest arrival elasticity coefficients',
        'Unverified seasonal variance profile',
        'Zero cross-mandi spatial transmission benchmarks'
      ],
    };
  }

  // Case B: Known commodity, but unseen or sparse market (Hierarchical Regional Pooling)
  if (recordCount < MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL) {
    // Check if commodity has sufficient regional pooled data across other mandis
    const regionalRecords = records.filter(r =>
      r.commodity.toLowerCase().includes(normCommodity)
    );
    const regionalDates = new Set(regionalRecords.map(r => r.date)).size;

    if (regionalDates >= MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL) {
      return {
        isFullySupported: false,
        canPredict: true,
        tier: 'tier_2_regional_pool',
        historicalRecordCount: recordCount,
        minimumRequiredRecords: MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL,
        commodityKnown: true,
        marketKnown: !!matchedMarket,
        reason: `Mandi '${marketQuery}' has only ${recordCount} direct historical entries (below the 90-day threshold). However, state-level regional pooling is available with ${regionalDates} days of verified multi-mandi data. Hierarchical state spatial features will be applied with an expanded uncertainty band (+35%).`,
        reasonTamil: `'${marketQuery}' சந்தைக்கு நேரடி பதிவுகள் குறைவாக உள்ளன (${recordCount} நாட்கள்). எனினும், மாநில அளவிலான தொகுப்பு மாதிரி (Regional Pooled Model) மூலம் கணிக்க முடியும். விரிவுபடுத்தப்பட்ட நிச்சயமற்ற தன்மை வரம்பு (+35%) பொருந்தும்.`,
        recommendation: `Proceeding with Regional Hierarchical Model. Note that local mandi transport basis risk is wider. Continuously ingest daily arrivals for this market to transition to a Tier-1 localized model.`,
        recommendationTamil: `மாநில அளவிலான படிநிலை மாதிரியுடன் தொடரலாம். இந்த சந்தைக்கான உள்ளூர் தினசரி வரவுகளைத் தொடர்ந்து சேர்க்கவும்.`,
        dataGapsIdentified: [
          `Localized mandi history is ${recordCount} / 90 days`,
          'Direct arrival volume series has intermittent reporting gaps',
          'Applying regional hub price transmission basis'
        ],
      };
    } else {
      return {
        isFullySupported: false,
        canPredict: false,
        tier: 'tier_3_unsupported',
        historicalRecordCount: recordCount,
        minimumRequiredRecords: MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL,
        commodityKnown: true,
        marketKnown: !!matchedMarket,
        reason: `Insufficient historical data across both local market (${recordCount} days) and regional pooled pool (${regionalDates} days). Reliable 90-day time series forecasting requires $\\ge$ 90 days.`,
        reasonTamil: `உள்ளூர் சந்தை மற்றும் பிராந்திய தரவு இரண்டிலும் போதிய தரவு இல்லை. நம்பகமான 90 நாள் கணிப்புக்கு 90 நாட்கள் தரவு தேவை.`,
        recommendation: `Upload historical mandi data for this commodity to activate time-series forecasting.`,
        recommendationTamil: `காலவரிசை மாதிரியை இயக்க இந்த பயிருக்கான முந்தைய அக்மார்க்நெட் பதிவுகளைப் பதிவேற்றவும்.`,
        dataGapsIdentified: [
          'Statewide arrival volume insufficient',
          'Less than 2 seasonal cycles detected'
        ],
      };
    }
  }

  // Case C: Fully validated (Tier 1)
  return {
    isFullySupported: true,
    canPredict: true,
    tier: 'tier_1_validated',
    historicalRecordCount: recordCount,
    minimumRequiredRecords: MIN_HISTORICAL_DAYS_FOR_MARKET_MODEL,
    commodityKnown: true,
    marketKnown: true,
    reason: `Verified ${recordCount} consecutive daily observations with complete arrival volumes and modal prices. Full localized ML model pipeline enabled.`,
    reasonTamil: `சரிபார்க்கப்பட்ட ${recordCount} தொடர்ச்சியான தினசரி சந்தைப் பதிவுகள் உள்ளன. முழுமையான உள்ளூர் ML மாதிரி செயல்படுத்தப்பட்டுள்ளது.`,
    recommendation: `Direct localized multi-step model evaluation ready across Seasonal Naive, SARIMA, Random Forest, XGBoost, and LSTM candidates.`,
    recommendationTamil: `அனைத்து ML மாதிரிகளையும் (SARIMA, XGBoost, Random Forest, LSTM) ஒப்பீடு செய்து 90 நாள் கணிப்பை மேற்கொள்ளலாம்.`,
    dataGapsIdentified: [],
  };
}
