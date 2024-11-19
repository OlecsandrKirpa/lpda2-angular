import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject, LOCALE_ID} from "@angular/core";
import {Observable} from "rxjs";
import { ConfigsService } from '@core/services/configs.service';

export const addLanguageHeaderInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const locale = inject(LOCALE_ID);
  const cl = req.clone({ setHeaders: { 'Accept-Language': locale } });

  return next(cl);
};
