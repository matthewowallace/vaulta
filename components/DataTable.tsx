import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import React from 'react'
import {cn} from "@/lib/utils";

const DataTable = <T,> ({ columns, data, rowKey, tableClassName, headerRowClassName, headerCellClassName, bodyRowClassName, bodyCellClassName, headerClassName} : DataTableProps<T>) => {
    return (
        <Table className={cn('custom-scrollbar', tableClassName)}>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader className={headerClassName}>
                <TableRow className={cn( 'hover:bg-transparent' ,headerRowClassName)}>
                    {columns.map((column, i) => (
                        <TableHead key={i} className={cn('dark:bg-zinc-800 text-purple-100 first:pl-5 last:pr-5' )}>
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((row, rowIndex) => (
                    <TableRow key={rowKey(row, rowIndex)} className={cn( 'overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-[#FF5A1F]/20! relative dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800' ,bodyRowClassName )}>
                        {columns.map((column, columnIndex) => (
                            <TableCell key={columnIndex} className={cn('py-4 first:pl-5 last:pr-5',)}>{column.cell(row, rowIndex)}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
export default DataTable
