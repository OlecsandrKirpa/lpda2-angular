import {inject, Injectable} from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {exportFilenameFromContentDisposition} from "@core/lib/export-filename-from-content-disposition";
import {catchError, Observable, Observer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportMenuService extends DomainService {
  // private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    super(`admin/menu`);
  }

  export(): Observable<void> {
    return new Observable<void>((observer: Observer<void>): void => {
      this.get(`export`, {
        responseType: "blob",
        observe: "response",
      }).pipe(
        catchError((error: any): Observable<never> => {
          console.error(`ExportMenuService.export() error:`, error);
          observer.error(error);
          return new Observable<never>();
        }),
      ).subscribe(
        (response: any): void => {

          if (response instanceof HttpResponse && response.body) {
            const filename: string = exportFilenameFromContentDisposition(response.headers?.get(`Content-Disposition`)) ?? `gigi-menu.xlsx`;
            const contentType: string = response.headers?.get(`Content-Type`) ?? `application/octet-stream`;
            const downloadURL: string = window.URL.createObjectURL(new Blob([response.body], {type: contentType}));

            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename;
            link.click();
            observer.complete();
          }

        });
    });
  }
}
