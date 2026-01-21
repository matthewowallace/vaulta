'use server';

// const dummyTrendingCoins: TrendingCoin[] = [
//     {
//         item: {
//             id: "bitcoin",
//             name: "Bitcoin",
//             symbol: "BTC",
//             market_cap_rank: 1,
//             thumb: "/wired-outline-2588-logo-bitcoin-hover-roll.svg",
//             large: "/wired-outline-2588-logo-bitcoin-hover-roll.svg",
//             data: {
//                 price: 89113.00,
//                 price_change_percentage_24h: {
//                     usd: 2.5
//                 }
//             }
//         }
//     },
//     {
//         item: {
//             id: "ethereum",
//             name: "Ethereum",
//             symbol: "ETH",
//             market_cap_rank: 2,
//             thumb: "/Atlantic-colored.svg",
//             large: "/Atlantic-colored.svg",
//             data: {
//                 price: 2543.21,
//                 price_change_percentage_24h: {
//                     usd: -1.2
//                 }
//             }
//         }
//     }
// ]

import React, {Suspense} from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import {CoinOverviewFallback, CryptoDashboardFallback, TrendingCoinsFallback} from "@/components/home/fallback";
import CryptoDashboard from "@/components/CryptoDashboard";
import BitcoinLiquidationChart from "@/components/AnalyticsCard";
import AnalyticsCard from "@/components/AnalyticsCard";
import Dashboard from "@/components/AnalyticsCard";

const Page = async () => {

  return (
    <div>
      <main className="main-container">
        <section className={"home-grid"}>
            <Suspense fallback={<CoinOverviewFallback />}>
                <CoinOverview />
            </Suspense>
            <Suspense fallback={<TrendingCoinsFallback />}>
                <TrendingCoins />
            </Suspense>
        </section>
          <section className={"home-grid"}>
              <Suspense fallback={<CryptoDashboardFallback />}>
                  <CryptoDashboard />
              </Suspense>
              <div id={"coin-overview"}>
                  <AnalyticsCard />
              </div>
          </section>

        <section className={"w-full mt-7 space-y-4"}>
            <p>Categories</p>
        </section>
      </main>
    </div>
  );
}

export default Page;