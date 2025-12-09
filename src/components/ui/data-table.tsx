"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRowClick?: (row: TData) => void
    emptyState?: {
        title?: string
        description?: string
    }
}

const DEFAULT_EMPTY_STATE = {
    title: "No data",
    description: "No data available"
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    emptyState = DEFAULT_EMPTY_STATE
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            {table.getRowModel().rows?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {table.getRowModel().rows.map((row, index) => (
                        <div
                            key={row.id}
                            onClick={() => onRowClick?.(row.original)}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-background via-background to-muted/20 p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards',
                            }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content Grid */}
                            <div className="relative grid md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-start md:items-center">
                                {row.getVisibleCells().map((cell) => (
                                    <div key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Subtle corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 rounded-2xl border border-dashed border-border/50 bg-muted/10">
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground text-sm md:text-base">{emptyState.title}</p>
                        <p className="text-xs text-muted-foreground/60">{emptyState.description}</p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
