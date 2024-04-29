import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable, tap} from "rxjs";
import {AuthService} from "@core/services/http/auth.service";
import {inject, Injector} from "@angular/core";
import {redirectUnauthorized} from "@core/lib/redirect-unauthorized";

export const adminRoutesGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const auth: AuthService = inject(AuthService);
  const injector: Injector = inject(Injector);

  return auth.refreshTokenIfNotCalled().pipe(
    tap((success: boolean) => success || redirectUnauthorized(injector))
  )
};
