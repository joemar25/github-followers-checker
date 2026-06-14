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
        <Card className="border border-border/50 bg-card/45 backdrop-blur-sm shadow-xl rounded-2xl flex flex-col h-full transition-all duration-300 hover:border-border/80">
            <CardHeader className="pb-3 border-b border-border/40">
                <h2 className="text-base font-semibold tracking-tight text-center text-foreground">{title}</h2>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4">
                <ul className="flex-1 overflow-y-auto max-h-[350px] min-h-[250px] space-y-1.5 pr-1.5 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map(renderItem)
                    ) : (
                        <li className="text-center text-muted-foreground py-8 text-sm">No items available</li>
                    )}
                </ul>
                <Pagination className="mt-4 pt-3 border-t border-border/30 flex justify-center">
                    <PaginationContent className="gap-2">
                        <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={`rounded-full transition-all duration-200 hover:bg-accent ${page === 1 || totalPages <= 1
                                ? "opacity-30 pointer-events-none"
                                : "cursor-pointer"
                                }`}
                        />
                        <span className="text-xs text-muted-foreground font-medium px-2">
                            Page {page} of {totalPages || 1}
                        </span>
                        <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={`rounded-full transition-all duration-200 hover:bg-accent ${page === totalPages || totalPages <= 1
                                ? "opacity-30 pointer-events-none"
                                : "cursor-pointer"
                                }`}
                        />
                    </PaginationContent>
                </Pagination>
            </CardContent>
        </Card>
    );
};

export default PaginatedList;
