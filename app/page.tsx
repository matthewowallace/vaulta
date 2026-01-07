import CryptoDashboard from "@/components/CryptoDashboard";

"use-client";
import Image from "next/image";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {TrendingDown, TrendingUp} from "lucide-react";
import VisualizationCard from "@/components/VisualizationCard";
import CryptoVisualizationCard from "@/components/CryptoVisualizationCard";
import InteractiveGaugeCard from "@/components/InteractiveGaugeCard";

const columns: DataTableColumn<TrendingCoin>[] = [
    {
        header: "Name",
        cellClassName: "name-cell",
        cell: (coin)=> {
            const item = coin.item;
            return (
                <Link href={`/coins/${item.id}`} className="flex items-center gap-2">
                   <Image src={item.large} alt={item.name} width={36} height={36} />
                    <p>{item.name}</p>
                </Link>
            );
    }},
    {
        header: "24h Change",
        cellClassName: "name-cell",
        cell: (coin)=> {
            const item = coin.item;
            const isTrending = item.data.price_change_percentage_24h.usd > 0;
            return(
                <div className={cn('price-change', isTrending ? 'text-green-500': 'text-red-500' )}>
                    <p className="flex items-center gap-1">
                        {isTrending ? (
                           <TrendingUp width={16} height={16} /> ) :
                            <TrendingDown width={16} height={16} />
                        }
                        {item.data.price_change_percentage_24h.usd.toFixed(2)}%
                    </p>
                </div>
            )
        }
    },
    {
        header: "Price",
        cellClassName: "price-cell",
        cell:(coin)=> {
         return <p>${coin.item.data.price.toLocaleString()}</p>
        },
    }
]

const dummyTrendingCoins: TrendingCoin[] = [
    {
        item: {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            market_cap_rank: 1,
            thumb: "/wired-outline-2588-logo-bitcoin-hover-roll.svg",
            large: "/wired-outline-2588-logo-bitcoin-hover-roll.svg",
            data: {
                price: 89113.00,
                price_change_percentage_24h: {
                    usd: 2.5
                }
            }
        }
    },
    {
        item: {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            market_cap_rank: 2,
            thumb: "/Atlantic-colored.svg",
            large: "/Atlantic-colored.svg",
            data: {
                price: 2543.21,
                price_change_percentage_24h: {
                    usd: -1.2
                }
            }
        }
    }
]

export default function Page() {
  return (
    <div>
      <main className="main-container">
        <section className={"home-grid"}>
            <div id={"coin-overview"}>
                <div className={"header p-3"}>
                    <Image src="/wired-outline-2588-logo-bitcoin-hover-roll.svg" alt="Bitcoinlogo" width={50} height={20}/>
                    <div className={"info"}>
                        <p>BitCoin / BTC</p>
                        <h1>$89,113.00</h1>
                    </div>
                </div>
            </div>
            <p>Trending Coins</p>
            <div id={"trending-coins"}>
                <DataTable
                    data={dummyTrendingCoins}
                    columns={columns}
                    rowKey={(coin) => coin.item.id}
                    tableClassName={"trending-coins-table"}
                />
            </div>
            <div>
                <CryptoDashboard />
            </div>
        </section>
        <section className={"w-full mt-7 space-y-4"}>
            <p>Categories</p>
        </section>
      </main>
    </div>
  );
}
