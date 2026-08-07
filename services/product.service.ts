import { ProductBody, ProductPaginate } from "@/interfaces/product";
import { ResponseMessage } from "@/interfaces/response-message";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";

export class ProductService {
  searchPaginate(page: number, term: string): Observable<ProductPaginate> {
    return toObservable(() => {
      return axiosClient.post<ProductPaginate>(`/product/search-paginate`, {
        page,
        term
      })
    })
  }

  searchPaginateLimitFive(page: number, term: string): Observable<ProductPaginate> {
    return toObservable(() => {
      return axiosClient.post<ProductPaginate>(`/product/search-paginate-limit-five`, {
        page,
        term
      })
    })
  }

  create(body: ProductBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.post<ResponseMessage>(`/product/create`, body)
    })
  }

  update(id: number, body: ProductBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.put<ResponseMessage>(`/product/update/${id}`, body)
    })
  }

  delete(id: number): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.delete<ResponseMessage>(`/product/delete/${id}`)
    })
  }
}