"use client";
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, ReferenceLine, CartesianGrid, Brush
} from 'recharts';
import { ChevronDown, Activity } from 'lucide-react';

const AnalyticsDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily'
                );
                const formatted = res.data.prices.map((price) => ({
                    time: price[0],
                    val: Math.round(price[1]),
                    // Extract full month name for the footer labels
                    month: new Date(price[0]).toLocaleString('default', { month: 'long' }),
                    displayDate: new Date(price[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                }));
                setData(formatted);
                setLoading(false);
            } catch (err) {
                console.error("CoinGecko Error:", err);
            }
        };
        fetchData();
    }, []);

    /**
     * DYNAMIC LABEL LOGIC
     * This creates a spread of labels (Oversold -> Month -> Neutral -> Month -> Overbought)
     * based on the actual months present in your fetched data.
     */
    const dynamicLabels = useMemo(() => {
        if (data.length === 0) return [];

        // Helper to get month at specific percentage of the data array
        const getMonthAt = (percent) => data[Math.floor((data.length - 1) * percent)].month;

        return [
            { label: "Oversold", type: "sentiment" },
            { label: getMonthAt(0.25), type: "month" },
            { label: "Neutral", type: "sentiment" },
            { label: getMonthAt(0.75), type: "month" },
            { label: "Overbought", type: "sentiment" }
        ];
    }, [data]);

    const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

    if (loading) return (
        <div className="flex h-[600px] md:h-full w-full items-center justify-center rounded-[2rem] bg-[#161616] text-zinc-500">
            <Activity className="mr-2 animate-spin" size={20} /> Updating Market...
        </div>
    );

    return (
        <div className="relative flex h-[600px] md:h-full w-full flex-col overflow-hidden p-6 sm:p-8 font-sans text-white  rounded-[2rem]">

            {/* Header Section */}
            <div className="relative z-20 mb-4 flex shrink-0 items-center justify-between">
                <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
                    <ChevronDown size={16} />
                    Bitcoin Analytics: Q1 | 2026
                </button>
                <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
                    Live
                </div>
            </div>

            {/* Background Watermark */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.02]">
                <h1 className="select-none text-[25vw] font-black tracking-tighter text-white">
                    analytics
                </h1>
            </div>

            {/* Main Chart Area */}
            <div className="relative z-10 flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        onMouseMove={(e) => {
                            if (e && e.activeTooltipIndex !== undefined) setHoverIndex(e.activeTooltipIndex);
                        }}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF5A1F" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#FF5A1F" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#ffffff" strokeDasharray="3 3" vertical={false} opacity={0.05} />

                        {activePoint && (
                            <>
                                <ReferenceLine x={activePoint.time} stroke="#ffffff" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
                                <ReferenceLine y={activePoint.val} stroke="#ffffff" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
                            </>
                        )}

                        <XAxis dataKey="time" hide />

                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            width={60}
                            mirror
                            tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => `$${Math.round(val/1000)}k`}
                        />

                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-white/10 bg-black/90 p-3 text-xs backdrop-blur-md shadow-2xl ring-1 ring-white/10">
                                            <p className="text-zinc-500 mb-1">{payload[0].payload.displayDate}</p>
                                            <p className="text-[#FF5A1F] text-sm font-black tracking-tight">
                                                ${payload[0].value.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke="#FF5A1F"
                            strokeWidth={2}
                            fill="url(#chartGradient)"
                            activeDot={{ r: 6, fill: '#fff', stroke: '#161616', strokeWidth: 3 }}
                        />

                        <Brush
                            dataKey="time"
                            height={40}
                            stroke="#FF5A1F"
                            fill="transparent"
                            gap={10}
                            travellerWidth={10}
                            tickFormatter={() => ""}
                        >
                            <AreaChart data={data}>
                                <Area type="monotone" dataKey="val" fill="#FF5A1F" fillOpacity={0.1} stroke="none" />
                            </AreaChart>
                        </Brush>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* --- FIX: Dynamic Month/Sentiment Labels --- */}
            <div className="pointer-events-none relative z-20 mt-6 flex justify-between px-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-700">
                {dynamicLabels.map((item, index) => (
                    <span
                        key={index}
                        className={item.type === 'month' ? "text-zinc-500/50 italic" : "text-zinc-700"}
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;