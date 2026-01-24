'use client';

import React, { useEffect, useRef, useState, useTransition, useMemo } from 'react';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    CandlestickSeries,
} from 'lightweight-charts';
import {
    BarChart, Bar, XAxis, ResponsiveContainer,
    Cell, Tooltip, YAxis
} from "recharts";
import {
    TrendingUp, TrendingDown,
    ChevronLeft, Maximize2, Info
} from "lucide-react";

import {
    getCandlestickConfig,
    getChartConfig,
    PERIOD_BUTTONS,
    PERIOD_CONFIG,
} from '@/constants';

import { fetcher } from '@/lib/coingecko.action';
import { convertOHLCData } from '@/lib/utils';

/* ================= TYPES ================= */
type HourStat = {
    hour: number;
    avgMove: string;
    volatility: string;
    bullishRate: string;
    score: number;
    confidence: number;
};

type CandlestickChartProps = {
    children?: React.ReactNode;
    data?: OHLCData[];
    coinId: string;
    height?: number;
    initialPeriod?: Period;
};

/* ================= SUB-COMPONENT: FULL-WIDTH DARK DASHBOARD ================= */
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#18181b] text-[#a1a1a1] p-4 rounded-xl shadow-2xl border border-slate-700 text-xs backdrop-blur-md">
                <p className="font-bold text-[#ff5a1f] mb-2 border-b border-slate-700 pb-1">{data.hour}:00 UTC</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4"><span>Reliability:</span> <span className="font-mono">{data.confidence}%</span></div>
                    <div className="flex justify-between gap-4"><span>Avg Move:</span> <span className="font-mono">{data.avgMove}%</span></div>
                    <div className="flex justify-between gap-4"><span>Bullish:</span> <span className="font-mono text-[#ff5a1f]">{data.bullishRate}%</span></div>
                </div>
            </div>
        );
    }
    return null;
};

const ReliabilityDashboard = ({ data, strongestHour, coinId }: { data: HourStat[], strongestHour: HourStat, coinId: string }) => {
    const { displayData, trend } = useMemo(() => {
        const peakIdx = data.findIndex(d => d.hour === strongestHour.hour);
        const slice = data.slice(Math.max(0, peakIdx - 3), peakIdx + 1);
        const prevIdx = (peakIdx - 1 + data.length) % data.length;
        const prevHour = data[prevIdx];
        const trendDir = prevHour && Number(strongestHour.bullishRate) >= Number(prevHour.bullishRate) ? "up" : "down";

        return { displayData: slice, trend: trendDir };
    }, [data, strongestHour]);

    return (
        <div className="w-full rounded-3xl bg-[#18181b] p-8 border border-white/5 backdrop-blur-sm mb-8 transition-all hover:border-[#76da44]">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Left: Hero Stats */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6 text-[#A3AED0] uppercase text-[10px] font-bold tracking-[0.2em]">
                        <Info size={14} className="text-[#76da44]" />
                        AI Reliability Index
                    </div>

                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-8xl font-black tracking-tighter text-white">
                            {strongestHour.confidence}%
                        </span>
                        <div className={`flex items-center gap-1 font-bold text-sm ${trend === 'up' ? 'text-[#ff5a1f]' : 'text-rose-400'}`}>
                            {trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            <span>{trend === 'up' ? 'Rising' : 'Cooling'}</span>
                        </div>
                    </div>

                    <p className="text-[#A3AED0] text-lg mb-8">
                        The <span className="text-white font-semibold">{strongestHour.hour}:00 UTC</span> window shows peak price predictability for {coinId}.
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1] mb-1">Avg Volatility</p>
                            <p className="text-2xl font-bold text-white">{strongestHour.avgMove}%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1] mb-1">Bullish Conviction</p>
                            <p className="text-2xl font-bold text-[#ff5a1f]">{strongestHour.bullishRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Right: Full Width Graph */}
                <div className="flex-[1.5] flex flex-col justify-end">
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                {/*<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />*/}
                                <Bar dataKey="confidence" radius={[8, 8, 4, 4]} barSize={80}>
                                    {displayData.map((entry, index) => {
                                        const isPeak = entry.hour === strongestHour.hour;
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={isPeak ? "#76da4490" : "#1e293b"}
                                                // className={isPeak ? "filter drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "cursor-pointer"}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between px-6 mt-4">
                        {displayData.map((d) => (
                            <span key={d.hour} className={`text-[11px] font-bold tracking-widest ${d.hour === strongestHour.hour ? "text-[#ff5a1f]" : "text-slate-600"}`}>
                                {d.hour}:00
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ================= MAIN COMPONENT ================= */
const CandlestickChart = ({
                              children,
                              data,
                              coinId,
                              height = 360,
                              initialPeriod = 'daily',
                          }: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [period, setPeriod] = useState<Period>(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    const [showOverview, setShowOverview] = useState(false);
    const [hourStats, setHourStats] = useState<HourStat[]>([]);

    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
            const { days } = PERIOD_CONFIG[selectedPeriod];
            const response = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, { vs_currency: 'usd', days, precision: 'full' });
            if (Array.isArray(response)) setOhlcData(response);
        } catch (err) { console.error('Fetch OHLC Error:', err); }
    };

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;
        startTransition(() => {
            setPeriod(newPeriod);
            fetchOHLCData(newPeriod);
        });
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const showTime = ['daily', 'weekly', 'monthly'].includes(period);
        const chart = createChart(chartContainerRef.current, {
            ...getChartConfig(height, showTime),
            width: chartContainerRef.current.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (!chartContainerRef.current) return;
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (!seriesRef.current || !ohlcData.length) return;
        const normalized = ohlcData.map((item) => [
            Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4],
        ]) as OHLCData[];
        seriesRef.current.setData(convertOHLCData(normalized));
        chartRef.current?.timeScale().fitContent();
    }, [ohlcData]);

    const analyzeHourlyBehavior = (data: OHLCData[]) => {
        const hours: Record<number, any> = {};
        data.forEach((d) => {
            const date = new Date(d[0]);
            const hour = date.getUTCHours();
            const open = d[1], high = d[2], low = d[3], close = d[4];
            const movePct = ((close - open) / open) * 100;
            const range = high - low;
            const bullish = close > open ? 1 : 0;

            if (!hours[hour]) {
                hours[hour] = { count: 0, totalMove: 0, totalRange: 0, bullishCount: 0 };
            }
            hours[hour].count++;
            hours[hour].totalMove += movePct;
            hours[hour].totalRange += range;
            hours[hour].bullishCount += bullish;
        });

        const stats = Object.entries(hours).map(([hour, s]: any) => {
            const avgMove = s.totalMove / s.count;
            const volatility = s.totalRange / s.count;
            const bullishRate = (s.bullishCount / s.count) * 100;
            const consistency = Math.abs(bullishRate - 50) / 50;
            const score = Math.abs(avgMove) * consistency * (volatility > 0 ? 1 : 0);
            return {
                hour: Number(hour),
                avgMove: avgMove.toFixed(2),
                volatility: volatility.toFixed(2),
                bullishRate: bullishRate.toFixed(0),
                score,
            };
        });

        const maxScore = Math.max(...stats.map((s) => s.score), 1);
        return stats.map((s) => ({
            ...s,
            confidence: Math.round((s.score / maxScore) * 100),
        })).sort((a, b) => a.hour - b.hour);
    };

    useEffect(() => {
        if (!ohlcData.length) return;
        setHourStats(analyzeHourlyBehavior(ohlcData));
    }, [ohlcData]);

    const strongestHour = useMemo(() =>
            hourStats.reduce((best, h) => (h.confidence > (best?.confidence || 0) ? h : best), null as HourStat | null),
        [hourStats]);

    return (
        <div id="candlestick-chart" className="flex flex-col w-full">
            <div className="chart-header flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex-1">{children}</div>
                <div className="button-group flex gap-1 items-center">
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={period === value ? 'config-button-active' : 'config-button'}
                            onClick={() => handlePeriodChange(value as Period)}
                            disabled={isPending}
                        >
                            {label}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowOverview((p) => !p)}
                        className={`config-button ml-3 border transition-colors ${showOverview ? 'bg-[#76da4480] text-white border-[#76da44]' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                    >
                        {showOverview ? 'Hide Analysis' : 'Show Analysis'}
                    </button>
                </div>
            </div>

            <div ref={chartContainerRef} className="w-full mb-8" style={{ height }} />

            {showOverview && strongestHour && (
                <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ReliabilityDashboard
                        data={hourStats}
                        strongestHour={strongestHour}
                        coinId={coinId}
                    />

                    {/* Full Width Grid for All Hours */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {hourStats.map((h) => {
                            const isBest = strongestHour?.hour === h.hour;
                            return (
                                <div key={h.hour} className={`rounded-2xl p-4 border transition-all ${isBest ? 'bg-[#ff5a1f20] border-[#ff5a1f] shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-[#18181b] border-white/5 hover:border-white/20'}`}>
                                    <p className="text-[10px] font-bold text-[#a1a1a1] uppercase">Hour</p>
                                    <p className="text-lg font-bold text-white">{h.hour}:00</p>
                                    <div className="mt-4 space-y-1">
                                        <div className="flex justify-between text-[10px] text-[#A3AED0]"><span>Bullish</span> <span className="text-[#ff5a1f]">{h.bullishRate}%</span></div>
                                        <div className="flex justify-between text-[10px] text-[#A3AED0]"><span>Conf.</span> <span className="text-white font-bold">{h.confidence}%</span></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandlestickChart;