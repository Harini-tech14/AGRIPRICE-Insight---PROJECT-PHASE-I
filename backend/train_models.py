"""
Official Project: AI/ML-Based Agricultural Commodity Price Forecasting and Buffer Stock Decision Support System
Module 3: Historical Data Analysis, Chronological Splitting & Model Training
Algorithms: ARIMA, SARIMA, Random Forest, XGBoost, LSTM
"""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, mean_absolute_percentage_error
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb

def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract lag values, moving averages, rolling statistics, and seasonal features
    without lookahead leakage.
    """
    df = df.sort_values("date").copy()
    
    # Lag features
    df["lag_1"] = df["modal_price"].shift(1)
    df["lag_7"] = df["modal_price"].shift(7)
    df["lag_14"] = df["modal_price"].shift(14)
    df["lag_30"] = df["modal_price"].shift(30)
    
    # Rolling statistics
    df["ma_7"] = df["modal_price"].shift(1).rolling(7).mean()
    df["ma_30"] = df["modal_price"].shift(1).rolling(30).mean()
    df["volatility_14"] = df["modal_price"].shift(1).rolling(14).std()
    
    # Seasonal calendar features
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    
    return df.dropna()

def train_and_evaluate(df: pd.DataFrame):
    """
    Chronological data splitting:
    Training: 1 Jan 2021 – 30 Jun 2023
    Validation: 1 Jul 2023 – 31 Dec 2023
    Testing: 1 Jan 2024 – 31 Dec 2024
    """
    features = ["lag_1", "lag_7", "lag_14", "lag_30", "ma_7", "ma_30", "volatility_14", "month", "day_of_year"]
    target = "modal_price"
    
    train = df[(df["date"] >= "2021-01-01") & (df["date"] <= "2023-06-30")]
    val = df[(df["date"] >= "2023-07-01") & (df["date"] <= "2023-12-31")]
    test = df[(df["date"] >= "2024-01-01") & (df["date"] <= "2024-12-31")]
    
    X_train, y_train = train[features], train[target]
    X_test, y_test = test[features], test[target]
    
    # 1. Random Forest
    rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    
    # 2. XGBoost
    model_xgb = xgb.XGBRegressor(n_estimators=120, learning_rate=0.05, max_depth=5, random_state=42)
    model_xgb.fit(X_train, y_train)
    xgb_preds = model_xgb.predict(X_test)
    
    # Evaluation Metrics
    results = {
        "Random Forest": {
            "MAE": mean_absolute_error(y_test, rf_preds),
            "RMSE": root_mean_squared_error(y_test, rf_preds),
            "MAPE": mean_absolute_percentage_error(y_test, rf_preds) * 100,
        },
        "XGBoost": {
            "MAE": mean_absolute_error(y_test, xgb_preds),
            "RMSE": root_mean_squared_error(y_test, xgb_preds),
            "MAPE": mean_absolute_percentage_error(y_test, xgb_preds) * 100,
        }
    }
    return results

if __name__ == "__main__":
    print("AgriPrice Insight Phase I ML Pipeline Initialized.")
