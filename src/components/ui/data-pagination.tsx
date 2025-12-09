"use client";

import { Button } from "@/components/ui/button";

interface IDataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const DataPagination = ({
    page,
    totalPages,
    onPageChange
}: IDataPaginationProps) => {
    return (
        <div className="flex items-center justify-between">

            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}