import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {SessionService} from "@core/services/admin-session.service";
import {inject} from "@angular/core";
import {Observable} from "rxjs";

export const addLanguageHeaderInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const session = inject(SessionService);

  const cl = req.clone({ setHeaders: { 'Accept-Language': session.language() } });

  return next(cl);
};
