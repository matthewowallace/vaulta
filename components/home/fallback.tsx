import React from 'react'
import DataTable from "@/components/DataTable";

export const CoinOverviewFallback = () => {
    return (
        <div id={"coin-overview-fallback"} className={"p-3 h-full"}>
            <div className={"header"}>
                <div className={"header-image skeleton animate-pulse"} />
                <div className={"info"}>
                    <div className={"header-line-sm skeleton animate-pulse"} />
                    <div className={"header-line-lg skeleton animate-pulse"} />
                </div>
            </div>
            <div className={"chart"}>
                <div className={"chart-skeleton skeleton animate-pulse"} />
            </div>
        </div>
    )
}

export const TrendingCoinsFallback = () => {
    const columns: DataTableColumn<any>[] = [
        {
            header: "Name",
            cell: () => (
                <div className="name-link">
                    <div className="name-image skeleton animate-pulse" />
                    <div className="name-line skeleton animate-pulse" />
                </div>
            ),
        },
        {
            header: "24h Change",
            cell: () => (
                <div className="price-change">
                    <div className="change-icon skeleton animate-pulse" />
                    <div className="change-line skeleton animate-pulse" />
                </div>
            ),
        },
        {
            header: "Price",
            cell: () => (
                <div className="price-line skeleton animate-pulse" />
            ),
        }
    ];

    const data = Array(6).fill({});

    return (
        <div id={'trending-coins-fallback'}>
            <h4>Trending Coins</h4>
            <div className={"trending-coins-table"}>
                <DataTable
                    data={data}
                    columns={columns}
                    rowKey={(_, index) => index}
                    tableClassName={"trending-coins-table"}
                    headerCellClassName={"py-3!"}
                    bodyCellClassName={"py-2!"}
                />
            </div>
        </div>
    )
}

export const CryptoDashboardFallback = () => {
    return (
        <div id={"coin-overview-fallback"} className={"p-12 h-full"}>
            <div className="flex justify-between items-start mb-14">
                <div>
                    <div className="h-8 w-48 skeleton animate-pulse mb-2" />
                    <div className="h-4 w-32 skeleton animate-pulse" />
                </div>
                <div className="h-8 w-20 skeleton animate-pulse rounded-full" />
            </div>

            <div className="flex items-baseline gap-4 mb-10">
                <div className="h-20 w-32 skeleton animate-pulse" />
                <div className="h-6 w-40 skeleton animate-pulse" />
            </div>

            <div className="pt-6">
                <div className="flex justify-between items-end h-14 w-full gap-[3px]">
                    {[...Array(60)].map((_, i) => (
                        <div key={i} className="h-full w-[2px] skeleton animate-pulse opacity-40" />
                    ))}
                </div>
                <div className="flex justify-between mt-6">
                    <div className="h-3 w-16 skeleton animate-pulse" />
                    <div className="h-3 w-16 skeleton animate-pulse" />
                    <div className="h-3 w-16 skeleton animate-pulse" />
                </div>
            </div>
        </div>
    )
}
