"use client";
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { ChevronLeft, Maximize2, TrendingUp, TrendingDown } from "lucide-react";

type HourStat = {
    hour: number;
    confidence: number;
    avgMove: string;
    bullishRate: number;
};

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black text-white p-3 rounded-xl shadow-xl border border-gray-800 text-[11px]">
                <p className="font-bold mb-1">{data.hour}:00 UTC</p>
                <div className="space-y-0.5 opacity-80">
                    <p>Reliability: {data.confidence}%</p>
                    <p>Avg Move: {data.avgMove}%</p>
                    <p>Bullish: {data.bullishRate}%</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function ReliableTradingGraph({ data, coinName = "Bitcoin" }: { data: HourStat[], coinName?: string }) {
    const { strongestHour, displayData, trend } = useMemo(() => {
        if (!data?.length) return { strongestHour: null, displayData: [], trend: "neutral" };

        const strongest = data.reduce((a, b) => (b.confidence > a.confidence ? b : a), data[0]);
        const peakIdx = data.findIndex(d => d.hour === strongest.hour);

        // Slice 4-hour window
        const slice = data.slice(Math.max(0, peakIdx - 3), peakIdx + 1);

        const prevHour = data[peakIdx - 1];
        const trendDir = prevHour && strongest.bullishRate > prevHour.bullishRate ? "up" : "down";

        return { strongestHour: strongest, displayData: slice, trend: trendDir };
    }, [data]);

    if (!strongestHour) return null;

    return (
        <div className="w-full max-w-md rounded-[40px] bg-white p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] text-black border border-gray-50">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-8 text-gray-300">
                <ChevronLeft size={24} className="cursor-pointer hover:text-black transition-colors" />
                <Maximize2 size={22} className="cursor-pointer hover:text-black transition-colors" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-8">
                Trading Reliability
            </h3>

            {/* Hero Stats */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-8xl font-light tracking-tighter leading-none">
                        {strongestHour.confidence}%
                    </p>
                    <p className="text-gray-400 font-medium mt-4 text-sm">
                        Peak reliability at {strongestHour.hour}:00
                    </p>
                </div>

                <div className="text-right flex flex-col gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Avg Move</p>
                        <p className="text-lg font-bold">{strongestHour.avgMove}%</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bullish Rate</p>
                        <div className={`flex items-center justify-end gap-1 font-bold text-lg ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            <span>{strongestHour.bullishRate}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-44 w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'transparent' }} // Removes the default gray background on hover
                        />
                        <Bar
                            dataKey="confidence"
                            radius={[10, 10, 2, 2]}
                            barSize={64}
                            isAnimationActive={true}
                        >
                            {displayData.map((entry, index) => {
                                const isPeak = entry.hour === strongestHour.hour;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isPeak ? "#4ade80" : "#F3F4F6"}
                                        // "Pass bars" are greyed out by using a lighter fill or lower opacity
                                        fillOpacity={isPeak ? 1 : 0.4}
                                        className={`${isPeak ? "filter drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]" : "cursor-help"} transition-all duration-300`}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-4 mb-10">
                {displayData.map((d) => (
                    <span key={d.hour} className={`text-[13px] font-bold ${d.hour === strongestHour.hour ? "text-black" : "text-gray-200"}`}>
            {d.hour}:00
          </span>
                ))}
            </div>

            <p className="text-[15px] leading-relaxed text-gray-500">
                <span className="text-gray-900 font-semibold">Stability detected.</span> Hover over past intervals to compare historical confidence levels for {coinName}.
            </p>
        </div>
    );
}