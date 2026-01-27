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
import { cn } from "@/lib/utils";

const DataTable = <T,>({
                           columns,
                           data,
                           rowKey,
                           tableClassName,
                           headerRowClassName,
                           headerCellClassName,
                           bodyRowClassName,
                           bodyCellClassName,
                           headerClassName
                       }: any) => {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <Table className={cn('custom-scrollbar', tableClassName)}>
                <TableHeader className={headerClassName}>
                    <TableRow className={cn('hover:bg-transparent border-b border-zinc-800', headerRowClassName)}>
                        {columns.map((column: any, i: number) => (
                            <TableHead key={i} className={cn('bg-zinc-800/50 text-purple-100 first:pl-5 last:pr-5 h-12', headerCellClassName)}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.length > 0 ? (
                        data.map((row: T, rowIndex: number) => (
                            <TableRow
                                key={rowKey(row, rowIndex)}
                                className={cn(
                                    'border-b border-white/5 hover:bg-purple-500/5 transition-colors',
                                    bodyRowClassName
                                )}
                            >
                                {columns.map((column: any, columnIndex: number) => (
                                    <TableCell key={columnIndex} className={cn('py-4 first:pl-5 last:pr-5', bodyCellClassName)}>
                                        {column.cell(row, rowIndex)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-10 text-zinc-500">
                                No coins found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default DataTable;