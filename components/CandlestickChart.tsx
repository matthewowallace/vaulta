'use client';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries } from "lightweight-charts";
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constants";
import { fetcher } from "@/lib/coingecko.action";
import { convertOHLCData } from "@/lib/utils";

const CandlestickChart = ({ children, data, coinId, height = 360, initialPeriod = 'daily' }: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const [period, setPeriod] = useState(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
            const { days, interval } = PERIOD_CONFIG[selectedPeriod];
            const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
                vs_currency: 'USD',
                days,
                interval,
                precision: 'full',
            });
            if (newData) setOhlcData(newData);
        } catch (error) {
            console.error('FetchOHLCData Error:', error);
        }
    };

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;
        startTransition(async () => {
            setPeriod(newPeriod);
            await fetchOHLCData(newPeriod);
        });
    };

    // Initialize and Cleanup Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);
        const chart = createChart(chartContainerRef.current, {
            ...getChartConfig(height, showTime),
            width: chartContainerRef.current.clientWidth,
        });

        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
        series.setData(convertOHLCData(ohlcData));

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [ohlcData, height]); // Re-run when data changes

    return (
        <div id="candlestick-chart-wrapper" className="flex flex-col">
            <div className="chart-header flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex-1">{children}</div>
                <div className="button-group flex gap-1">
                    <span className="text-sm mx-2 font-medium text-purple-100/50 flex items-center">
                        Period:
                    </span>
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
                </div>
            </div>

            {/* THE CHART CONTAINER */}
            <div ref={chartContainerRef} className="w-full" style={{ height }} />
        </div>
    );
};

export default CandlestickChart;