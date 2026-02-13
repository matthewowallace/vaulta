'use client';

import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useRouter} from "next/dist/client/router";
import {buildPageNumbers} from "@/lib/utils";

const CoinsPagination = ({currentPage, totalPages, hasMorePages} : Pagination) => {
    const rounter = useRouter();
    const handlePageChange = (page: number) => {
        rounter.push(`/coins?page=${page}`);
    }
    const pageNumber = buildPageNumbers(currentPage, totalPages)
    const isLastPage = !hasMorePages || currentPage === totalPages;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
export default CoinsPagination
