import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { RequireRootModalComponent } from '@core/components/require-root-modal/require-root-modal.component';
import { TuiDialogService } from '@taiga-ui/core';
import { catchError, map, Observable, of, take, tap, throwError } from 'rxjs';
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";

function isRequireRootError(e: HttpErrorResponse): boolean {
  return e.status === 403 &&
          e.error?.details?.root_required === true &&
          e.error?.details?.can_root === true;
}

/**
 * This interceptor: Will catch the require root error and show a modal where user can enter the root mode.
 */
export const catchRequireRootInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const dialogs = inject(TuiDialogService);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpEvent<unknown>): Observable<HttpEvent<unknown>> => {
      if (!(error instanceof HttpErrorResponse)) return throwError(error);

      if (!isRequireRootError(error)) return throwError(error);

      return new Observable<HttpEvent<unknown>>((observer) => {
        dialogs.open<boolean>(
          new PolymorpheusComponent(RequireRootModalComponent, injector),
        ).pipe(
          tap((res: boolean) => {
            if (res) {
              next(req).subscribe(observer);
            } else {
              observer.error(error);
            }
          }),
        )
        .subscribe({
          error: (e: unknown) => observer.error(e),
        });
      });

    })
  )
};
