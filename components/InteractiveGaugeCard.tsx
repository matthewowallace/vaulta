'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveGaugeCard = () => {
    const [activeTab, setActiveTab] = useState('Group 1');
    const [data, setData] = useState({ percentage: 0, question: "", label: "" });
    const [loading, setLoading] = useState(true);

    // Simulated live data mapping for different crypto "Groups"
    const fetchGroupData = async (group) => {
        setLoading(true);
        try {
            // Using CoinGecko or similar live endpoint logic
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3');
            const coins = await response.json();

            const groupMapping = {
                'Group 1': { coin: coins[0], question: "Did the mobile design support better team coordination?", label: "Improved collaboration" },
                'Group 2': { coin: coins[1], question: "Has the network decentralization increased significantly?", label: "Network Security" },
                'Group 3': { coin: coins[2], question: "Is the current adoption rate outpacing the quarterly projection?", label: "User Adoption" },
            };

            const selected = groupMapping[group];
            // Normalize price change for the gauge (0-100 scale)
            const normalizedValue = Math.min(Math.max((selected.coin.price_change_percentage_24h + 5) * 10, 10), 95);

            setData({
                percentage: Math.round(normalizedValue),
                question: selected.question,
                label: selected.label
            });
        } catch (error) {
            console.error("Error fetching live data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData(activeTab);
    }, [activeTab]);

    // SVG Gauge Calculations
    const radius = 80;
    const circumference = Math.PI * radius; // Half circle
    const strokeDashoffset = circumference - (data.percentage / 100) * circumference;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5] p-6">
            <div className="w-full max-w-4xl bg-[#F9F9F7] rounded-sm p-8 shadow-sm border border-gray-100">

                {/* Header: Tabs and Dropdown */}
                <div className="flex justify-between items-start mb-16">
                    <div className="flex gap-2">
                        {['Group 1', 'Group 2', 'Group 3'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                                    activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500" />
                                )}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* Semi-Circle Gauge */}
                    <div className="relative flex flex-col items-center">
                        <svg width="220" height="120" viewBox="0 0 200 110">
                            {/* Background Path */}
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            {/* Progress Path */}
                            <motion.path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#FF9500"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: strokeDashoffset }}
                                style={{ strokeDasharray: circumference }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="text-center mt-[-40px]">
                            <motion.h3
                                key={data.percentage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl font-light text-gray-900"
                            >
                                {loading ? "..." : `${data.percentage}%`}
                            </motion.h3>
                            <p className="text-gray-400 text-sm mt-1">{data.label}</p>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div className="max-w-md">
                        <motion.h2
                            key={data.question}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-light text-gray-800 leading-tight"
                        >
                            {data.question.split(' ').map((word, i) => (
                                <span key={i} className={i === 2 || i === 3 ? "text-gray-400 font-light" : "font-semibold"}>
                  {word}{' '}
                </span>
                            ))}
                        </motion.h2>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InteractiveGaugeCard;