import React, {Suspense} from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import {
    CategoriesFallback,
    CoinOverviewFallback,
    CryptoDashboardFallback,
    TrendingCoinsFallback
} from "@/components/home/fallback";
import CryptoDashboard from "@/components/CryptoDashboard";
import AnalyticsCard from "@/components/AnalyticsCard";
import Categories from "@/components/Categories";

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
              {/*<div>*/}
              {/*    <ReliableTradingGraph data={tradingData} coinName="bitcoin"/>*/}
              {/*</div>*/}
          </section>

        <section className={"w-full mt-7 space-y-4"}>
            <Suspense fallback={<CategoriesFallback />}>
                <Categories />
            </Suspense>
        </section>
      </main>
    </div>
  );
}

export default Page;