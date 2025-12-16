import React, { useState, useEffect, useCallback, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../StockManagement.css'; 

const FLASK_API_URL = "http://127.0.0.1:5001"; 
//const DEFAULT_TICKER = 'LMT';

const fmt = (n, d = 2) => Number(n).toFixed(d); // formats to cent decimal place

/* MAIN COMPONENT */
function StockManagement() {
  const chartRef = useRef(null);        // ref for the canvas element
  const chartInstance = useRef(null);   // ref for the Chart.js instance

  // UI/INTERACTION STATES
  //const [ticker, setTicker] = useState(DEFAULT_TICKER);
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ kind: 'info', message: `Enter a ticker symbol to get started.` });
  const [smoothChart, setSmoothChart] = useState(true);
  const [apiResponse, setApiResponse] = useState(null); // holds the full JSON response

  /* CHART CLEANUP */
  const destroyChart = useCallback(() => {
    if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
    }
  }, []);

  /* STOCK CHART DRAWING LOGIC */
  const drawChart = useCallback((points, smooth) => {
    destroyChart(); // clear before making new one

    if (!chartRef.current || points.length === 0) {
        return;
    }

    const labels = points.map(p => p.date);
    const prices = points.map(p => p.predicted_price);
    const lastHistoricalIndex = points.length - 2;
    const predictionPoint = points[points.length - 1];
    const lastHistoricalPrice = points[lastHistoricalIndex]?.predicted_price;
    const predictionPrice = predictionPoint?.predicted_price;
    
    // prediction point coloring logic
    const pointBorderColors = prices.map((price, i) => {
        if (i === lastHistoricalIndex) return '#f2eb1aff'; // current date
        if (i === points.length - 1) {
            if (predictionPrice > lastHistoricalPrice) return '#10b981'; // green (ok)
            if (predictionPrice < lastHistoricalPrice) return '#ef4444'; // red (err)
            return '#6366f1'; // blue (brand) by default
        }
        return '#6366f1'; // blue (historical points)
    });

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Predicted Price',
          data: prices,
          borderColor: '#4f46e5',
          borderWidth: 2,
          fill: true,
          tension: smooth ? 0.4 : 0, // apply smoothing
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
            return gradient;
          },
          pointRadius: 4,
          pointBackgroundColor: pointBorderColors,
          pointBorderColor: pointBorderColors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Price: $${fmt(context.parsed.y)}`,
              title: (context) => {
                const index = context[0].dataIndex;
                return index === points.length - 1 ? 'Forecast' : points[index].date;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#6f7787ff', callback: (value) => `$${value}` },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6f7787ff' },
          }
        }
      }
    });
  }, [destroyChart, smoothChart]);

  /* DATA PROCESSING */
  const processData = useCallback((data) => {
    setApiResponse(data);
    drawChart(data.predictions, smoothChart);
    
    // success status
    setStatus({ kind: 'ok', message: `Forecast for ${data.ticker} loaded successfully!` });
  }, [smoothChart, drawChart]);


  // PREDICTION HANDLER
  const handlePrediction = async (e) => {
    e.preventDefault();
    const cleanTicker = ticker.toUpperCase().trim();
    if (!cleanTicker) {
      setStatus({ kind: 'err', message: 'Please enter a stock ticker.' });
      return;
    }

    setLoading(true);
    setStatus({ kind: 'info', message: `Fetching prediction for ${cleanTicker}...` });

    try {
      const apiUrl = `${FLASK_API_URL}/predict?ticker=${cleanTicker}&days=7`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setTicker(cleanTicker);
        processData(data);
      } else {
        // fail status
        setStatus({ 
          kind: 'err', 
          message: data.error || `Failed to fetch prediction for ${cleanTicker}.` 
        });
        destroyChart(); // cleanup
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // handle network errors
      setStatus({ 
        kind: 'err', 
        message: 'Unable to connect to Flask server. Please ensure the server is running on port 5000.' 
      });
      destroyChart(); // cleanup
    } finally {
      setLoading(false);
    }
  };
  
  // SMOOTH TOGGLE HANDLER
  const handleSmoothToggle = (e) => {
    setSmoothChart(e.target.checked);
    // redraw chart
    if (apiResponse) {
        drawChart(apiResponse.predictions, e.target.checked);
    }
  };
    // CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => destroyChart();
  }, [destroyChart]);


  // <><><> HELPER VARIABLES <><><>
  let nextPrice = '—';
  let startPrice = '—';
  let endPrice = '—';
  let priceDelta = '—';
  let pricePct = '—';
  let priceChangeClass = '';
  let lastUpdated = '—';
  let daysInForecast = '—';

  if (apiResponse && apiResponse.predictions && apiResponse.predictions.length > 1) {
    const points = apiResponse.predictions;
    const predictionPoint = points[points.length - 1];
    const lastHistoricalPoint = points[points.length - 2];
    
    if (predictionPoint && lastHistoricalPoint) {
        nextPrice = `$${fmt(predictionPoint.predicted_price)}`;
        daysInForecast = points.length;
        startPrice = `$${fmt(points[0].predicted_price)}`;  // first historical price in range
        endPrice = `$${fmt(lastHistoricalPoint.predicted_price)}`; // last historical price

        const end = lastHistoricalPoint.predicted_price;
        const delta = predictionPoint.predicted_price - end;
        const pct = (delta / (end || 1)) * 100;
        
        priceDelta = `${delta >= 0 ? "+" : ""}$${fmt(delta)}`;
        pricePct = `${delta >= 0 ? "+" : ""}${fmt(pct)}%`;
        priceChangeClass = delta >= 0 ? 'sm-ok' : 'sm-bad';
    }
    lastUpdated = new Date(apiResponse.generated_at).toLocaleString();
  }


  return (
    <div className="stock-manager">
        <main className="sm-container">
          <section className="sm-panel sm-hero">
            <div className="sm-hero-copy">
              <h2><b>Defense Sector Forecasts, Fast.</b></h2>
              <p className="sm-muted">
                Enter a ticker to fetch a {daysInForecast > 1 ? daysInForecast + '-day' : '7-day'} forecast.
              </p>

              <form className="sm-input-wrap" onSubmit={handlePrediction}>
                <input 
                  type="text" 
                  id="tickerInput" 
                  className="sm-input"
                  //placeholder="LMT" 
                  placeholder=""
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <button id="predictButton" type="submit" disabled={loading} className={`sm-button ${loading ? 'sm-loading' : ''}`}>
                  <span className="sm-btn-label">Predict</span>
                  <span className="sm-spinner"></span>
                </button>
              </form>

              <div className="sm-form-group" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="sm-checkbox-wrap">
                  <input 
                    type="checkbox" 
                    id="smoothToggle" 
                    checked={smoothChart} 
                    onChange={handleSmoothToggle} 
                  />
                  <span>Smooth Chart Lines</span>
                </label>
                <span className="sm-hint">Tip: For a demo, try <b>LMT</b>, <b>RTX</b>, or <b>BA</b>.</span>
              </div>

              <div id="status" className={`sm-toast ${status.kind} ${status.message ? 'sm-show' : ''}`} role="status" aria-live="polite">
                {status.message}
              </div>
            </div>
          </section>

          <section className="sm-grid">
            <article className="sm-card">
              <h3><b>{daysInForecast > 1 ? daysInForecast-1 + '-Day Price Projection' : 'Price Projection'}</b></h3>

              <div style={{ position: 'relative', height: '360px', width: '100%' }}>
                <canvas ref={chartRef} id="chart"></canvas>
              </div>
              
              <details className="sm-json-wrap">
                <summary>Raw API response</summary>
                <pre id="jsonDump">{apiResponse ? JSON.stringify(apiResponse, null, 2) : '{}'}</pre>
              </details>
            </article>

            <aside className="sm-card">
              <h3><b>Overview</b></h3>
              <div className="sm-meta">
                <div className="sm-kv"><b>Ticker</b><span id="m-ticker">{apiResponse?.ticker || '—'}</span></div>
                <div className="sm-kv"><b>Last Updated</b><span id="m-updated">{lastUpdated}</span></div>
                
                <div className="sm-kv"><b>Next Day Forecast</b><span id="m-nextPrice">{nextPrice}</span></div>

                <div className="sm-kv"><b>Start Price</b><span id="m-start">{startPrice}</span></div>
                <div className="sm-kv"><b>Last Historical Price</b><span id="m-end">{endPrice}</span></div>
                <div className="sm-kv">
                    <b>Forecasted Change ($)</b>
                    <span id="m-change"><span className={priceChangeClass}>{priceDelta}</span></span>
                </div>
                <div className="sm-kv">
                    <b>Forecasted Change (%)</b>
                    <span id="m-changePct"><span className={priceChangeClass}>{pricePct}</span></span>
                </div>
              </div>

              <h4 style={{ marginTop: '14px' }}>Daily Points ({daysInForecast})</h4>
              <ul id="predictionList" className="sm-list">
                {apiResponse?.predictions?.length > 0 ? (
                    apiResponse.predictions.map((p, index) => {
                        const isPrediction = index === apiResponse.predictions.length - 1;
                        const priceStr = `$${fmt(p.predicted_price)}`;
                        return (
                            <li key={p.date} className={isPrediction ? 'sm-highlight' : ''}>
                                <b>{p.date} (Day {index + 1}):</b> {priceStr} {isPrediction && <span className="sm-badge sm-small">Forecast</span>}
                            </li>
                        );
                    })
                ) : (
                    <li className="sm-muted">Results will appear here after a prediction is run.</li>
                )}
              </ul>
            </aside>
          </section>
        </main>
    </div>
  );
}

export default StockManagement;