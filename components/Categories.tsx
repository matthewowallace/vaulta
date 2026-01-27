import React from 'react'
import {fetcher} from "@/lib/coingecko.action";
import DataTable from "@/components/DataTable";
import Image from "next/image";
import {cn, formatCurrency, formatPercentage} from "@/lib/utils";
import {TrendingDown, TrendingUp} from "lucide-react";

const Categories = async () => {
    const categories = await fetcher<Category[]>('/coins/categories').catch(() => []);

    const columns: DataTableColumn<Category>[] = [
        {
            header: 'Categories',
            cellClassName: 'category-cell',
            cell: (category) => category.name
        },
        {
            header: 'Top Gainers',
            cellClassName: 'top-gainers-cell',
            cell: (category) => (
                <div className="flex items-center gap-1">
                    {category.top_3_coins.map((coin) => (
                        <Image
                            src={coin}
                            alt="coin logo"
                            key={coin}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ))}
                </div>
            )
        },
        {
            header: '24h Change',
            cellClassName: 'change-header-cell',
            cell: (category) => {
                const change = category.market_cap_change_24h ?? 0;
                const isTrendingUp = change > 0;

                return (
                    <div className={cn('change-cell flex items-center gap-1', isTrendingUp ? 'text-[#76da44]' : 'text-[#ff5a1f]')}>
                        {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {formatPercentage(change)}
                    </div>
                );
            },
        },
        {
            header: 'Market Cap',
            cellClassName: 'market-cap-cell',
            cell: (category) => formatCurrency(category.market_cap),
        },
        {
            header: '24h Volume',
            cellClassName: 'volume-cell',
            cell: (category) => formatCurrency(category.volume_24h),
        }
    ];

    return (
        <div id="categories" className="custom-scrollbar ">
            <div className={"flex flex-col w-full overflow-hidden pl-10 pr-10 mb-20"}>
                <h4 className="text-2xl font-bold pl-3 pb-5 text-zinc-100">Top Categories</h4>
                <DataTable
                    columns={columns}
                    data={categories?.slice(0, 10)}
                    rowKey={(_,index) => index}
                    tableClassName="mt-3 p-4"
                />
            </div>
        </div>
    )
}

export default Categories;
