import { ResponseMessage } from "@/interfaces/response-message";
import { SupplierBody, SupplierData } from "@/interfaces/supplier";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";


export class SupplierService {
  findMany(): Observable<SupplierData[]> {
    return toObservable(() => {
      return axiosClient.get<SupplierData[]>(`/supplier/many`)
    })
  }

  create(body: SupplierBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.post<ResponseMessage>(`/supplier/create`, body)
    })
  }

  update(id: number, body: SupplierBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.put<ResponseMessage>(`/supplier/update/${id}`, body)
    })
  }

  delete(id: number): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.delete<ResponseMessage>(`/supplier/delete/${id}`)
    })
  }
}