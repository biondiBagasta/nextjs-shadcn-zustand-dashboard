import { ResponseMessage } from "@/interfaces/response-message";
import { RestockBody, RestockPaginate } from "@/interfaces/restocks";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";

export class RestockService {
  searchPaginate(page: number, fromDate: Date, toDate: Date): Observable<RestockPaginate> {
    return toObservable(() => {
      return axiosClient.post<RestockPaginate>(`/restock/search-paginate`, {
        page,
        from_date: fromDate,
        to_date: toDate
      })
    })
  }

  create(body: RestockBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.post<ResponseMessage>(`/restock/create`, body)
    })
  }

  update(id: number, body: RestockBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.put<ResponseMessage>(`/restock/update/${id}`, body)
    })
  }

  delete(id: number): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.delete<ResponseMessage>(`/restock/delete/${id}`)
    })
  }
}