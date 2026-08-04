"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Paginate } from "@/interfaces/paginate"


interface PaginationComponentProps {
  data: Paginate;
  onChangePage: (page: number) => void
} 

export function PaginationComponent(props: PaginationComponentProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={
            (e) => {
              if(props.data.current_page > 1) {
                e.preventDefault();
                props.onChangePage(props.data.current_page - 1)
              }
            }
          } />
        </PaginationItem>
        {Array.from(
          { length: props.data.total_page },
          (_, index) => index + 1
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={props.data.current_page === page}
              onClick={(e) => {
                e.preventDefault();
                props.onChangePage(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={
            (e) => {
              if(props.data.current_page < props.data.total_page) {
                e.preventDefault();
                props.onChangePage(props.data.current_page + 1)
              }
            }
          } />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
