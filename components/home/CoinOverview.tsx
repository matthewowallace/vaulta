import React from 'react';
import Image from "next/image";
import { fetcher } from "@/lib/coingecko.action";
import { formatCurrency } from "@/lib/utils";
import { CoinOverviewFallback } from "@/components/home/fallback";
import CandlestickChart from "@/components/CandlestickChart"; // Adjust path

const CoinOverview = async () => {
    let data: { coin: CoinDetailsData; ohlc: OHLCData[] } | null = null;

    try {
        const [coin, ohlc] = await Promise.all([
            fetcher<CoinDetailsData>('/coins/bitcoin', { dex_pair_format: 'symbol' }),
            fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
                vs_currency: 'USD',
                days: 1,
                precision: 'full',
            }),
        ]);
        data = { coin, ohlc };
    } catch (error) {
        console.error('Error fetching coin overview:', error);
        return <CoinOverviewFallback />;
    }

    if (!data) return <CoinOverviewFallback />;

    const { coin, ohlc } = data;

    return (
        <div id="coin-overview" className="w-full">
            {/* Pass data to the Client Component */}
            <CandlestickChart data={ohlc} coinId="bitcoin">
                <div className="header p-3 flex items-center gap-3">
                    <Image src={coin.image.large} alt={coin.name} width={50} height={50} />
                    <div className="info">
                        <p className="text-sm text-muted-foreground">{coin.name}</p>
                        <h1 className="text-2xl font-bold">
                            {formatCurrency(coin.market_data.current_price.usd)}
                        </h1>
                    </div>
                </div>
            </CandlestickChart>
        </div>
    );
};

export default CoinOverview;
