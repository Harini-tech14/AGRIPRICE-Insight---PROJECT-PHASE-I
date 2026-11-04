# AgriPrice Insight - Decision Support System & Price Forecasting

AI/ML-Driven Agricultural Commodity Price Forecasting and Buffer Stock Decision Support System with Regional Market Intelligence.

---

## 🚀 How to Run Locally in Visual Studio Code (Windows / Mac / Linux)

### Method 1: Using the 1-Click Script (Windows)
1. Double-click **`start-windows.bat`** in this folder.
2. It will automatically run `npm install --legacy-peer-deps` and start the server.
3. Open your browser at **`http://localhost:3000`**.

---

### Method 2: In Visual Studio Code Terminal
1. Open **Visual Studio Code**.
2. Click **File** > **Open Folder...** and select this extracted project folder.
3. Open the built-in terminal (`Ctrl + ~` or **Terminal** > **New Terminal**).
4. Run:
   ```cmd
   npm install --legacy-peer-deps
   ```
5. Once installation finishes, start the dev server:
   ```cmd
   npm run dev
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📦 Project Architecture & Key Features

- **Multi-Horizon Price Forecasting**: 7-day, 30-day, and 90-day wholesale APMC forecast engine (`src/ml/forecastEngine.ts`).
- **Buffer Stock Recommendation Module**: Transparent 5-question framework:
  $$Q_{\text{candidate}} = \min(G_{\text{gap}}, A_{\text{avail}}, C_{\text{cap}})$$
  with 4-point official verification workflow (`src/services/bufferStockService.ts`).
- **All Markets Live Board**: Compare Mandi prices, arrivals, price trends, and retail unit conversions (₹/kg vs. ₹/quintal) across Tamil Nadu markets (`src/components/AllMarketsLiveBoard.tsx`).
- **Bilingual Interface**: Full English and Tamil (தமிழ்) translation support across all pages (`src/locales/tamil.ts`).
- **GIS Mandi Map**: Interactive Leaflet geospatial visualization of regional markets and APMC clusters (`src/components/RegionalMarketMap.tsx`).
