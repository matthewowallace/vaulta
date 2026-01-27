"use client";
import React, { useState, useEffect } from 'react';
import {ChevronDown} from "lucide-react";

const CryptoDashboard = () => {
  const [data, setData] = useState({ percentage: 0, price: '0.00', name: 'Bitcoin' });
  const [isLive, setIsLive] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Theme Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchCryptoData = async () => {
    if (!isLive) return;
    try {
      const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h'
      );
      const [btc] = await response.json();
      const change = btc.price_change_percentage_24h;
      const normalized = Math.min(Math.max((change + 10) * 5, 0), 100);

      setData({
        percentage: Math.round(normalized),
        price: btc.current_price.toLocaleString(),
        name: btc.name
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const timer = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(timer);
  }, [isLive]);

  return (
      // Outer Container Background
      <div className="w-full h-full flex flex-col justify-center transition-colors duration-500 bg-gray-50 dark:bg-zinc-950">

        {/* Theme Toggle Button */}
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>

        {/* Card Container */}
        <div className="h-full flex flex-col transition-colors duration-500 bg-[#F9F9F7] dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-zinc-800">

          {/* Header Section */}
          <div className="flex justify-between items-start mb-14">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">Live Market: {data.name} Current: ${data.price}</div>
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-gray-100 dark:border-zinc-700 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
              {isLive ? 'Live' : 'Manual'}
            </span>
            </div>
          </div>

          {/* Hero Data */}
          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-8xl font-light text-gray-900 dark:text-zinc-50 tracking-tighter">{data.percentage}%</span>
            <span className="text-2xl text-gray-400 dark:text-zinc-500 font-light italic">/ 24h Momentum</span>
          </div>

          {/* Interactive Gauge */}
          <div className="relative pt-6">
            {/* Tick Marks Layer */}
            <div className="flex justify-between items-end h-14 w-full gap-[3px]">
              {[...Array(60)].map((_, i) => {
                const pos = (i / 60) * 100;
                const isActive = pos <= data.percentage;
                return (
                    <div
                        key={i}
                        className={`h-full w-[2px] transition-all duration-500 ${
                            isActive ? 'bg-[#FF5A1F] scale-y-110' : 'bg-gray-200 dark:bg-zinc-800 opacity-40'
                        }`}
                    />
                );
              })}
            </div>

            <input
                type="range"
                min="0"
                max="100"
                value={data.percentage}
                onChange={(e) => {
                  setIsLive(false);
                  setData({ ...data, percentage: parseInt(e.target.value) });
                }}
                className="absolute inset-0 w-full h-14 opacity-0 cursor-pointer z-10"
            />

            <div
                className="absolute top-0 w-4 h-4 bg-[#FF5A1F] shadow-lg border-2 border-white dark:border-zinc-900 transition-all duration-300 ease-out"
                style={{ left: `${data.percentage}%`, transform: 'translateX(-50%)' }}
            />

            {/* Labels & Legend */}
            <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              <span>Oversold</span>
              <span>Neutral</span>
              <span>Overbought</span>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                  onClick={() => setIsLive(true)}
                  className={`text-[11px] font-bold uppercase py-2 px-6 rounded border transition-all ${
                      isLive ? 'opacity-0 pointer-events-none' : 'opacity-100 border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white dark:hover:text-zinc-900'
                  }`}
              >
                Resume Live Feed
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CryptoDashboard;

