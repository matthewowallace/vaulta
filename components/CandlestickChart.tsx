'use client';

import React, {
    useEffect,
    useRef,
    useState,
    useTransition,
} from 'react';

import {
    createChart,
    IChartApi,
    ISeriesApi,
    CandlestickSeries,
} from 'lightweight-charts';

import {
    getCandlestickConfig,
    getChartConfig,
    PERIOD_BUTTONS,
    PERIOD_CONFIG,
} from '@/constants';

import { fetcher } from '@/lib/coingecko.action';
import { convertOHLCData } from '@/lib/utils';

type CandlestickChartProps = {
    children?: React.ReactNode;
    data?: OHLCData[];
    coinId: string;
    height?: number;
    initialPeriod?: Period;
};

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

    /* ================================
       Fetch OHLC Data (CoinGecko Safe)
    ================================= */
    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
            const { days } = PERIOD_CONFIG[selectedPeriod];

            const response = await fetcher<OHLCData[]>(
                `/coins/${coinId}/ohlc`,
                {
                    vs_currency: 'usd',
                    days,
                    precision: 'full',
                }
            );

            if (Array.isArray(response)) {
                setOhlcData(response);
            }
        } catch (error) {
            console.error('Fetch OHLC Error:', error);
        }
    };

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;

        startTransition(() => {
            setPeriod(newPeriod);
            fetchOHLCData(newPeriod);
        });
    };

    /* ================================
       Initialize Chart (ONCE)
    ================================= */
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(chartContainerRef.current, {
            ...getChartConfig(height, showTime),
            width: chartContainerRef.current.clientWidth,
        });

        const series = chart.addSeries(
            CandlestickSeries,
            getCandlestickConfig()
        );

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (!chartContainerRef.current) return;
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    /* ================================
       Update Series Data
    ================================= */
    useEffect(() => {
        if (!seriesRef.current || !ohlcData.length) return;

        const normalized = ohlcData.map((item) => [
            Math.floor(item[0] / 1000), // ms → seconds
            item[1],
            item[2],
            item[3],
            item[4],
        ]) as OHLCData[];

        seriesRef.current.setData(convertOHLCData(normalized));
        chartRef.current?.timeScale().fitContent();
    }, [ohlcData]);

    return (
        <div id="candlestick-chart" className="flex flex-col">
            {/* Header */}
            <div className="chart-header flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex-1">{children}</div>

                <div className="button-group flex gap-1">
                    <span className="text-sm mx-2 font-medium text-purple-100/50 flex items-center">
                        Period:
                    </span>

                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={
                                period === value
                                    ? 'config-button-active'
                                    : 'config-button'
                            }
                            onClick={() =>
                                handlePeriodChange(value as Period)
                            }
                            disabled={isPending}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container */}
            <div
                ref={chartContainerRef}
                className="w-full"
                style={{ height }}
            />
        </div>
    );
};

export default CandlestickChart;
