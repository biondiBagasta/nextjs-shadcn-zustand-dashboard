import { CategoryData } from "@/interfaces/category";
import { ResponseMessage } from "@/interfaces/response-message";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";

interface CategoryBody {
  name: string
}

export class CategoryService {
  findMany(): Observable<CategoryData[]> {
    return toObservable(() => {
      return axiosClient.get<CategoryData[]>(`/category/many`)
    })
  }

  create(body: CategoryBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.post<ResponseMessage>(`/category/create`, body)
    })
  }

  update(id: number, body: CategoryBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.put<ResponseMessage>(`/category/update/${id}`, body)
    })
  }

  delete(id: number): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.delete<ResponseMessage>(`/category/delete/${id}`)
    })
  }
}