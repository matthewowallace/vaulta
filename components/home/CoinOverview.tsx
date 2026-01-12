import React from 'react'
import {fetcher} from "@/lib/coingecko.action";
import {formatCurrency} from "@/lib/utils";
import Image from "next/image";
import {CoinOverviewFallback} from "@/components/home/fallback";

const CoinOverview = async () => {
let coin;

try{
    coin = await fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol'
    });
} catch (error) {
    console.error('Error fetching coin overview not found', error);
    return <CoinOverviewFallback/>;
}

    return (
        <div id={"coin-overview"}>
            <div className={"header p-3"}>
                <Image src={coin.image.large} alt={coin.name} width={50} height={20}/>
                <div className={"info"}>
                    <p>{coin.name}</p>
                    <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                </div>
            </div>
        </div>
    );
}
export default CoinOverview
