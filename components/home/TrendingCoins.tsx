import React from 'react'
import { fetcher } from "@/lib/coingecko.action";
import { TrendingCoinsFallback } from "@/components/home/fallback";
import TrendingList from "@/components/TrendingCoinsList";

const TrendingCoins = async () => {
    let trendingData;

    try {
        // Fetching 20 coins to have enough data for "Show More"
        trendingData = await fetcher<{ coins: any[] }>('/search/trending', undefined, 300);
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        return <TrendingCoinsFallback />;
    }

    // Safety check to prevent .slice errors
    const coins = trendingData?.coins || [];

    return (
        <section id="trending-coins" className="w-full">
            <h2 className="text-2xl font-bold pl-3 pb-5 text-zinc-100">
                Trending Coins
            </h2>
            <TrendingList initialCoins={coins} />
        </section>
    );
}

export default TrendingCoins;