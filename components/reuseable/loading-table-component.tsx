"use client"

import { Skeleton } from "../ui/skeleton"
import { TableCell, TableRow } from "../ui/table"

export default function LoadingTableComponent() {
  return (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      </TableRow>
    ))
  )
}