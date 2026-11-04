/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CommodityId = 'tomato' | 'onion' | 'potato' | 'rice' | string;

export type UserRole = 'farmer' | 'government' | 'admin';

export type PageId =
  | 'home'
  | 'farmer_dash'
  | 'gov_dash'
  | 'admin_dash'
  | 'forecasting_lab'
  | 'regional_map'
  | 'auth';

export interface CommodityMeta {
  id: CommodityId;
  name: string;
  nameTamil: string;
  category: 'Vegetables' | 'Cereals';
  unit: string; // "₹/Quintal"
  shelfLifeDays: number;
  bufferStockEligible: boolean;
  minBufferNormLMT?: number; // Minimum buffer norm in Lakh Metric Tonnes
  priceSpikeThresholdPercent: number; // e.g., 20%
}

export interface MarketMeta {
  id: string;
  name: string;
  nameTamil: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  marketType: 'Wholesale APMC' | 'Major Terminal Mandi' | 'Secondary Market';
  averageDailyArrivalTonnes: number;
}

export interface MandiRecord {
  id: string;
  date: string; // YYYY-MM-DD
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number; // ₹/quintal
  maxPrice: number; // ₹/quintal
  modalPrice: number; // ₹/quintal
  arrivalQuantity: number; // tonnes
  source: string;
  lastUpdated: string;
}

export type ModelAlgorithm = 'arima' | 'sarima' | 'random_forest' | 'xgboost' | 'lstm';

export interface ModelMetrics {
  algorithm: ModelAlgorithm;
  algorithmName: string;
  mae: number; // Mean Absolute Error in ₹
  rmse: number; // Root Mean Square Error in ₹
  mape: number; // Mean Absolute Percentage Error in %
  directionalAccuracy: number; // in %
  trainingTimeMs: number;
  selectedForProduction: boolean;
  trainSamplesCount?: number;
  valSamplesCount?: number;
  testSamplesCount?: number;
}

export interface ForecastPoint {
  date: string;
  dayIndex: number; // 1 to 90
  predictedPrice: number;
  lowerBound95: number;
  upperBound95: number;
  confidenceStdDev: number;
  trendComponent?: number;
  seasonalComponent?: number;
}

export type TrendDirection = 'Increasing' | 'Decreasing' | 'Stable';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface FeatureImportanceItem {
  feature: string;
  featureTamil: string;
  importance: number; // 0 to 1
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
  explanationTamil: string;
}

export interface ValidationDiagnostic {
  isFullySupported: boolean;
  canPredict: boolean;
  tier: 'tier_1_validated' | 'tier_2_regional_pool' | 'tier_3_unsupported';
  historicalRecordCount: number;
  minimumRequiredRecords: number;
  commodityKnown: boolean;
  marketKnown: boolean;
  reason: string;
  reasonTamil: string;
  recommendation: string;
  recommendationTamil: string;
  dataGapsIdentified: string[];
}

export interface MultiHorizonSummary {
  horizon7d: {
    targetDate: string;
    predictedPrice: number;
    percentageChange: number;
    lowerBound: number;
    upperBound: number;
    trend: TrendDirection;
    mape: number;
  };
  horizon30d: {
    targetDate: string;
    predictedPrice: number;
    percentageChange: number;
    lowerBound: number;
    upperBound: number;
    trend: TrendDirection;
    mape: number;
  };
  horizon90d: {
    targetDate: string;
    predictedPrice: number;
    percentageChange: number;
    lowerBound: number;
    upperBound: number;
    trend: TrendDirection;
    mape: number;
  };
}

export interface ForecastResponse {
  commodity: CommodityMeta;
  market: MarketMeta;
  latestObservedPrice: number;
  latestObservedDate: string;
  forecastHorizonDays: number; // 90
  forecastPriceDay90: number;
  forecastPercentageChange: number;
  trend: TrendDirection;
  risk: RiskLevel;
  volatilityScore: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  bestModel: ModelAlgorithm;
  modelMetrics: ModelMetrics[];
  forecastSeries: ForecastPoint[];
  featureImportance: FeatureImportanceItem[];
  validationDiagnostic: ValidationDiagnostic;
  generatedTimestamp: string;
  modelVersion: string;
  multiHorizon: MultiHorizonSummary;
}

export interface BufferStockRecord {
  commodityId: string;
  commodityName: string;
  commodityNameTamil: string;
  currentStockLMT: number; // Lakh Metric Tonnes
  normRequiredLMT: number;
  storageCapacityUtilization: number; // %
  lastStockUpdateDate: string;
  source: string;
  procurementRecommended: boolean;
  procurementTargetLMT: number;
  releaseRecommended: boolean;
  releaseTargetLMT: number;
  reviewStatus: 'Safe' | 'Watchlist' | 'Critical Intervention Required';
  estimatedWholesaleImpactOnReleasePercent: number;
}

export interface SystemAlert {
  id: string;
  title: string;
  type: 'critical' | 'warning' | 'info';
  targetRole: 'farmer' | 'government' | 'all';
  commodity: string;
  location: string;
  horizon: '7 Days' | '30 Days' | '90 Days' | 'Immediate';
  predictedChange: number;
  reason: string;
  recommendedAction: string;
  status: 'active' | 'acknowledged' | 'action_initiated';
  timestamp: string;
}

