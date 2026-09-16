(async function () {
  // === DEVELOPMENT SWITCH ===
  // Set to true to force using cached data and prevent API calls during rapid reloads.
  // Set to false to allow the script to fetch new data normally.
  const DEV_MODE_FORCE_CACHE = false;
  // ==========================

  const ticker = document.getElementById('marketTicker');
  if (!ticker) {
    console.error('Ticker element with ID "marketTicker" not found.');
    return;
  }

  const API_KEY = 'ASIKCka2XbDTd5ucu7qmkSP50MX4279b';
  const CACHE_KEY = 'fmp_ticker_data';
  const CACHE_TIME_KEY = 'fmp_ticker_time';
  const HALF_HOUR = 30 * 60 * 1000;

  async function getMarketData() {
    const now = Date.now();
    const lastFetchTime = localStorage.getItem(CACHE_TIME_KEY);
    const isCacheFresh = lastFetchTime && (now - parseInt(lastFetchTime) < HALF_HOUR);
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

    // 1. If in dev mode, ALWAYS use the cache if it exists.
    if (DEV_MODE_FORCE_CACHE && cachedData) {
      console.log("Dev Mode: Forcing use of cached data.");
      return cachedData;
    }

    // 2. If cache is fresh, use it.
    if (isCacheFresh && cachedData) {
      console.log("Cache is fresh. Using cached data.");
      return cachedData;
    }

    // 3. If we are here, fetch from API.
    console.log("Cache is stale or empty. Fetching new data from API.");
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${API_KEY}`);
      if (!response.ok) {
        // This is where your 429 error is caught!
        throw new Error(`HTTP error: ${response.status}`);
      }
      const stocks = await response.json();
      
      if (!Array.isArray(stocks)) {
         throw new Error('API did not return a valid array.');
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(stocks));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());
      return stocks;

    } catch (err) {
      console.error('Failed to fetch new stock data:', err);
      // IMPORTANT: If API fails, try to use old, stale data as a fallback.
      return cachedData || null; 
    }
  }

  function populateTicker(stocks) {
    if (!stocks || stocks.length === 0) {
      ticker.innerHTML = '<span class="ticker-item">Market data is currently unavailable.</span>';
      ticker.style.animation = 'none';
      return;
    }

    const visibleStocks = stocks.slice(0, 50);
    const tickerItemsHTML = visibleStocks.map(stock => {
      if (!stock || typeof stock.symbol !== 'string' || typeof stock.price !== 'number' || typeof stock.changesPercentage !== 'number') return '';
      const isUp = stock.changesPercentage >= 0;
      return `
        <span class="ticker-item ${isUp ? 'ticker-up' : 'ticker-down'}">
          <strong>${stock.symbol}</strong> ${stock.price.toFixed(2)}
          <span style="margin-left: 5px;">${isUp ? '▲' : '▼'} ${Math.abs(stock.changesPercentage).toFixed(2)}%</span>
        </span>
      `;
    }).join('');

    ticker.innerHTML = tickerItemsHTML + tickerItemsHTML;
  }

  // --- Main Execution ---
  const stockData = await getMarketData();
  populateTicker(stockData);

})();