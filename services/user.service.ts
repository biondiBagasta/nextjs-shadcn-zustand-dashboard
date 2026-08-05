import { ResponseMessage } from "@/interfaces/response-message";
import { UserBody, UserData } from "@/interfaces/user";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";


export class UserService {
  findMany(): Observable<UserData[]> {
    return toObservable(() => {
      return axiosClient.get<UserData[]>(`/user/many`)
    })
  }

  create(body: UserBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.post<ResponseMessage>(`/user/create`, body)
    })
  }

  update(id: number, body: UserBody): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.put<ResponseMessage>(`/user/update/${id}`, body)
    })
  }

  delete(id: number): Observable<ResponseMessage> {
    return toObservable(() => {
      return axiosClient.delete<ResponseMessage>(`/user/delete/${id}`)
    })
  }
}