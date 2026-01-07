"use client";
import React, { useState, useEffect } from 'react';

const CryptoVisualizationCard = () => {
    const [percentage, setPercentage] = useState(0);
    const [coinData, setCoinData] = useState({ name: "Loading...", price: 0 });
    const [isLive, setIsLive] = useState(true);

    // Fetch live Bitcoin data from CoinGecko
    const fetchCryptoData = async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h'
            );
            const data = await response.json();
            const btc = data[0];

            setCoinData({
                name: btc.name,
                price: btc.current_price.toLocaleString(),
            });

            // We'll normalize the 24h change to a 0-100 scale for the bar
            // (Assuming -10% is 0 and +10% is 100 for visual effect)
            const change = btc.price_change_percentage_24h;
            const normalized = Math.min(Math.max((change + 10) * 5, 0), 100);

            if (isLive) setPercentage(Math.round(normalized));
        } catch (error) {
            console.error("Error fetching crypto data:", error);
        }
    };

    useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [isLive]);

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-xl bg-[#F9F9F7] rounded-xl p-10 shadow-lg border border-gray-200">

                {/* Header with Live Status */}
                <div className="flex justify-between items-start mb-12">
                    <h2 className="text-2xl font-light text-gray-800 leading-tight">
                        <span className="font-semibold text-black">Live Market:</span> {coinData.name}
                        <br /> <span className="text-sm text-gray-500">Current Price: ${coinData.price}</span>
                    </h2>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isLive ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                        {isLive ? '● Live' : 'Paused'}
                    </button>
                </div>

                {/* Dynamic Percentage Display */}
                <div className="flex items-baseline gap-3 mb-8">
          <span className="text-7xl font-light text-gray-900 tracking-tighter">
            {percentage}%
          </span>
                    <span className="text-2xl text-gray-400 font-light italic">/ 24h Momentum</span>
                </div>

                {/* Interactive Visual Bar Section */}
                <div className="relative w-full group">

                    {/* Tick Marks Layer */}
                    <div className="flex justify-between items-end h-12 w-full gap-[2px]">
                        {[...Array(60)].map((_, i) => {
                            const threshold = (i / 60) * 100;
                            const isActive = threshold <= percentage;
                            return (
                                <div
                                    key={i}
                                    className={`h-full w-[3px] transition-all duration-300 ${
                                        isActive ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-gray-300 opacity-30'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {/* Transparent Range Input (The "Invisible" Slider) */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => {
                            setIsLive(false);
                            setPercentage(e.target.value);
                        }}
                        className="absolute top-0 left-0 w-full h-12 opacity-0 cursor-pointer z-10"
                    />

                    {/* Floating Indicator Square */}
                    <div
                        className="absolute -top-4 w-4 h-4 bg-orange-600 border-2 border-white shadow-md transition-all duration-300 pointer-events-none"
                        style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                    />

                    {/* X-Axis and Legend */}
                    <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Extreme Bear</span>
                        <span>Neutral</span>
                        <span>Extreme Bull</span>
                    </div>
                    <div className="h-[2px] w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                <p className="mt-8 text-xs text-gray-400 text-center italic">
                    {isLive ? "Data refreshes every 30 seconds." : "Manual mode: Click 'Paused' to resume live tracking."}
                </p>
            </div>
        </div>
    );
};

export default CryptoVisualizationCard;