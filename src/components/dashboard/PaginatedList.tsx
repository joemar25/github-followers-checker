// src\components\dashboard\PaginatedList.tsx
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface PaginatedListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    itemsPerPage?: number;
    title: string;
}

const PaginatedList = <T extends { id: string | number }>({
    items,
    renderItem,
    itemsPerPage = 10,
    title,
}: PaginatedListProps<T>) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = items.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Card className="shadow-sm flex flex-col h-full">
            <CardHeader className="pb-2">
                <h2 className="text-base font-medium text-center">{title}</h2>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <ul className="flex-1 overflow-y-auto space-y-2">
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map(renderItem)
                    ) : (
                        <li className="text-center text-gray-500">No items available</li>
                    )}
                </ul>
                <Pagination className="mt-4 flex justify-center">
                    <PaginationContent>
                        <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={`${page === 1 || totalPages <= 1
                                ? "opacity-50 pointer-events-none"
                                : ""
                                }`}
                        />
                        <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={`${page === totalPages || totalPages <= 1
                                ? "opacity-50 pointer-events-none"
                                : ""
                                }`}
                        />
                    </PaginationContent>
                </Pagination>
            </CardContent>
        </Card>
    );
};

export default PaginatedList;
