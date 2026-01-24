"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    CartesianGrid,
    Brush,
} from "recharts";
import { ChevronDown, Activity } from "lucide-react";

const AnalyticsDashboard = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [range, setRange] = useState({ startIndex: 0, endIndex: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily"
                );

                const formatted = res.data.prices.map((price: any) => ({
                    time: price[0],
                    val: Math.round(price[1]),
                    month: new Date(price[0]).toLocaleString("default", {
                        month: "long",
                    }),
                    displayDate: new Date(price[0]).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                    }),
                }));

                setData(formatted);
                setRange({
                    startIndex: 0,
                    endIndex: formatted.length - 1,
                });
                setLoading(false);
            } catch (err) {
                console.error("CoinGecko Error:", err);
            }
        };

        fetchData();
    }, []);

    const dynamicLabels = useMemo(() => {
        if (!data.length) return [];
        const getMonthAt = (percent: number) =>
            data[Math.floor((data.length - 1) * percent)].month;

        return [
            { label: "Oversold", type: "sentiment" },
            { label: getMonthAt(0.25), type: "month" },
            { label: "Neutral", type: "sentiment" },
            { label: getMonthAt(0.75), type: "month" },
            { label: "Overbought", type: "sentiment" },
        ];
    }, [data]);

    const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

    if (loading) {
        return (
            /* Standardizing loader to match responsive height */
            <div className="flex min-h-[400px] h-full w-full items-center justify-center rounded-[2rem] bg-[#161616] text-zinc-500">
                <Activity className="mr-2 animate-spin" size={20} />
                Updating Market...
            </div>
        );
    }

    return (
        /* RESPONSIVE HEIGHT LOGIC:
           - min-h-[500px]: sets a floor for usability.
           - h-full: instructs the div to fill the parent container.
           - flex-col: allows us to distribute vertical space between header, chart, and footer.
        */
        <div className="relative flex min-h-[500px] h-full w-full flex-col overflow-hidden rounded-[2rem] p-4 sm:p-8  text-white">

            {/* Header - Fixed Height */}
            <div className="relative z-20 mb-6 flex items-center justify-between shrink-0">
                <button className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-500 hover:text-white transition-colors">
                    <ChevronDown size={16} />
                    Bitcoin Analytics: Q1 | 2026
                </button>

                <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF5A1F]" />
                    Live
                </div>
            </div>

            {/* Chart - Dynamic Height (fills remaining space) */}
            <div className="relative z-10 flex-1 min-h-0 w-full group">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        onMouseMove={(e) => {
                            if (e?.activeTooltipIndex !== undefined) {
                                setHoverIndex(e.activeTooltipIndex);
                            }
                        }}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF5A1F" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#FF5A1F" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            stroke="#ffffff"
                            strokeDasharray="3 3"
                            vertical={false}
                            opacity={0.05}
                        />

                        {activePoint && (
                            <>
                                <ReferenceLine x={activePoint.time} stroke="#fff" strokeDasharray="4 4" opacity={0.4} />
                                <ReferenceLine y={activePoint.val} stroke="#fff" strokeDasharray="4 4" opacity={0.4} />
                            </>
                        )}

                        <XAxis dataKey="time" hide />
                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            width={45}
                            mirror
                            tick={{ fill: "#71717a", fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                        />

                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) =>
                                active && payload?.length ? (
                                    <div className="rounded-xl border border-white/10 bg-black/90 p-3 text-[10px] sm:text-xs backdrop-blur-md shadow-2xl">
                                        <p className="mb-1 text-zinc-500">{payload[0].payload.displayDate}</p>
                                        <p className="text-sm font-black text-[#FF5A1F]">
                                            ${payload[0].value.toLocaleString()}
                                        </p>
                                    </div>
                                ) : null
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke="#FF5A1F"
                            strokeWidth={2}
                            fill="url(#chartGradient)"
                            activeDot={{ r: 5, fill: "#fff", stroke: "#161616", strokeWidth: 2 }}
                        />

                        <Brush
                            height={30}
                            stroke="#FF5A1F"
                            fill="#161616"
                            gap={10}
                            travellerWidth={8}
                            onChange={(e) => {
                                if (e?.startIndex !== undefined) {
                                    setRange(e as any);
                                }
                            }}
                        >
                            <AreaChart data={data}>
                                <Area type="monotone" dataKey="val" fill="#FF5A1F" fillOpacity={0.1} stroke="none" />
                            </AreaChart>
                        </Brush>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Slider Value Display - Fixed Height */}
            <div className="mt-4 flex justify-between text-[9px] sm:text-[11px] font-semibold text-zinc-500 shrink-0 border-t border-white/5 pt-4">
                <span>{data[range.startIndex]?.displayDate}</span>
                <span className="text-[#FF5A1F] font-black tracking-wider">
                    ${data[range.startIndex]?.val.toLocaleString()} <span className="text-zinc-700 px-1">→</span> $
                    {data[range.endIndex]?.val.toLocaleString()}
                </span>
                <span>{data[range.endIndex]?.displayDate}</span>
            </div>

            {/* Footer Labels - Fixed Height */}
            <div className="pointer-events-none mt-4 flex justify-between px-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 shrink-0">
                {dynamicLabels.map((item, i) => (
                    <span key={i} className={item.type === "month" ? "italic text-zinc-500/30" : ""}>
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;