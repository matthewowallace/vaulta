'use client';

import React, { useState } from 'react';
import DataTable from "@/components/DataTable";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

interface TrendingListProps {
    initialCoins: any[]; // Using any for brevity, use TrendingCoin if type is exported
}

const TrendingList = ({ initialCoins }: TrendingListProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const columns = [
        {
            header: "Name",
            cell: (coin: any) => (
                <Link href={`/coins/${coin.item.id}`} className="flex items-center gap-2 group">
                    <Image
                        src={coin.item.large}
                        alt={coin.item.name}
                        width={36}
                        height={36}
                        className="rounded-full shadow-md"
                    />
                    <p className="group-hover:text-purple-400 transition-colors font-medium">
                        {coin.item.name}
                    </p>
                </Link>
            )
        },
        {
            header: "24h Change",
            cell: (coin: any) => {
                const change = coin.item.data.price_change_percentage_24h.usd;
                const isPositive = change > 0;
                return (
                    <div className={cn('flex items-center gap-1 font-bold', isPositive ? 'text-green-500' : 'text-red-500')}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {change.toFixed(2)}%
                    </div>
                );
            }
        },
        {
            header: "Price",
            cell: (coin: any) => (
                <p className="font-mono font-semibold">
                    {formatCurrency(coin.item.data.price)}
                </p>
            ),
        }
    ];

    // Determine data based on state
    const displayData = isExpanded ? initialCoins : initialCoins.slice(0, 6);

    return (
        <div className="flex flex-col w-full overflow-hidden pl-10 pr-10">
            <h2 className="text-2xl font-bold pl-3 pb-5 text-zinc-100">
                Trending Coins
            </h2>
            <DataTable
                data={displayData}
                columns={columns}
                rowKey={(coin) => coin.item.id}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3!"
                bodyCellClassName="py-2!"
            />

            {initialCoins.length > 6 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-zinc-800 transition-all active:scale-95 font-bold text-sm shadow-sm ",
                        isExpanded
                            ? "bg-[#76da4480] text-white border-[#76da44] hover:bg-[#76da4440] border-[#76da44]"
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                    )}
                >
                    {isExpanded ? (
                        <>Show Less <ChevronUp size={18} /></>
                    ) : (
                        <>Show More Trending Coins <ChevronDown size={18} /></>
                    )}
                </button>
            )}
        </div>
    );
};

export default TrendingList;