import { FileResponse } from "@/interfaces/file-response";
import { axiosClient, toObservable } from "@/lib/axios";
import { Observable } from "rxjs";

export class FilesService {

  uploadProductImage(image: FormData): Observable<FileResponse> {
    return toObservable(() => {
      return axiosClient.post<FileResponse>(`/files/product/upload`, image, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    })
  }

  deleteProductImage(image: string): Observable<void> {
    return toObservable(() => {
      return axiosClient.delete(`/files/product/delete/${image}`)
    })
  }
}