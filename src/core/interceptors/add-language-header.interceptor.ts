import { HttpInterceptorFn } from '@angular/common/http';
import {SessionService} from "@core/services/admin-session.service";
import {inject} from "@angular/core";

export const addLanguageHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);

  const cl = req.clone({ setHeaders: { 'Accept-Language': session.language() } });

  return next(cl);
};
