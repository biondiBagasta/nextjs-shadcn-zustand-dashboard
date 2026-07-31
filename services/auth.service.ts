import { LoginResponse } from "@/interfaces/login-response";
import { User } from "@/interfaces/user";
import { axiosClient, toObservable } from "@/lib/axios";
import { defer, map, Observable } from "rxjs";

export class AuthService {
  login(username: string, password: string): Observable<LoginResponse> {
    return toObservable(() => {
      return axiosClient.post("/auth/login", {
        username,
        password
      })
    })
  }

  authenticated(): Observable<User> {
    return toObservable(() => {
      return axiosClient.post("/auth/authenticated")
    })
  }
}