import { toast } from "@/components/ui/toast";
import { AxiosErrorObject } from "@/interfaces/axios-error-object";
import axios, { AxiosError, AxiosResponse } from "axios";
import { defer, map, Observable } from "rxjs";

export const baseUrl = "http://localhost:3000/api";

export const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const jwt = localStorage.getItem("jwt");

      if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export function toObservable<T>(
  request: () => Promise<AxiosResponse<T>>
): Observable<T> {
  return defer(request).pipe(
    map((response) => response.data)
  )
}

export function showHttpErrorToast(e: AxiosError): void {
  console.log(e.response?.data as AxiosErrorObject)
  toast.add({
    type: "error",
    title: "ERROR",
    description: (e.response?.data as AxiosErrorObject).message,
    
  })
}