import {Injectable, effect, inject, isDevMode} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHandlerFn, HttpInterceptorFn
} from '@angular/common/http';
import {Observable, of, throwError, timer} from 'rxjs';
import {delay, filter, map, switchMap, takeUntil, timeout, timeoutWith} from 'rxjs/operators';
import {AuthService} from '@core/services/http/auth.service';
import {randomIntFromInterval} from '@core/lib/random-int-from-interval';

/**
 * Include this param as get param to skip jwt interceptor for this request.
 * Interceptor will skip the request and remove the param from url.
 *
 * Example:
 * http://localhost:4200/v1/clients?JWT_INTERCEPTOR_SKIP_REQUEST_PARAM
 */
export const JWT_INTERCEPTOR_SKIP_REQUEST_PARAM: string = "JWT_INTERCEPTOR_SKIP_REQUEST_PARAM";

/**
 * Ignore all other rules. Don't skip request.
 */
export const JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM: string = "JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM";

const SKIP_URLS: RegExp[] = [
  `v.*/auth/*`,
  `^\/assets/*`,
  /v\d{1}\/public.*/,
  /v\d{1}\/reservations.*/,
  /v\d{1}\/menu.*/,
].map((url: any) => new RegExp(url));

function shouldSkipByUrl(url: string): boolean {
  return SKIP_URLS.some((skipUrl: RegExp) => skipUrl.test(url) || skipUrl.test(`${url}/`) || skipUrl.test(`/${url}`));
}

function delayTime(): number {
  return isDevMode() ? randomIntFromInterval(500, 750) : 0;
}


/**
 * ************************** ACTUAL REQUEST PROCESSING **************************
 */

function skipAndProcess(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(request).pipe(delay(delayTime()));
}

function processWithJwt(request: HttpRequest<any>, next: HttpHandlerFn, auth: AuthService): Observable<HttpEvent<unknown>> {

  /**
   * If jwt is already set, just use it.
   */
  if (auth.jwt()) {
    return next(
      request.clone({setHeaders: {Authorization: `Bearer ${auth.jwt()}`}})
    ).pipe(delay(delayTime()));
  }

  /**
   * If jwt is not set but is needed for request:
   * - wait for the jwt to be set
   * - if jwt is not set in 15 seconds, just skip it and make the request
   * - when jwt is set, make the request
   */
  return auth.refreshTokenIfNotCalled().pipe(
    map(() => auth.jwt()),
    filter((jwt: string | null) => !!jwt),
    timeout({
      first: 1000 * 15,
      with: (a: any) => {
        console.warn(`jwt$.timeout for ${request.url}`, {request});
        return of(null);
      }
    }),
    switchMap((jwt: string | null) => {
      if (!(jwt)) return throwError(`jwt is null`);

      return next(
        request.clone({setHeaders: {Authorization: `Bearer ${jwt}`}})
      );
    }),
  ).pipe(delay(delayTime()));
}

/**
 * ACTUAL INTERCEPTOR
 * @param request the Http request.
 * @param next request handler
 */
export function jwtInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth: AuthService = inject(AuthService);

  /**
   * Necessary in case back-end and front-end are running in different origins.
   * 
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials
   */
  request = request.clone({
    withCredentials: true
  });

  /**
   * Force add jwt.
   */
  if (request.url.includes(JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM)) {
    return processWithJwt(request.clone({url: request.url.replace(`?${JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM}`, "").replace(`&${JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM}`, "")}), next, auth);
  }

  /**
   * Skip adding jwt, request has get param to skip jwt.
   */
  if (request.url.includes(JWT_INTERCEPTOR_SKIP_REQUEST_PARAM)) {
    return skipAndProcess(request.clone({url: request.url.replace(`?${JWT_INTERCEPTOR_SKIP_REQUEST_PARAM}`, "").replace(`&${JWT_INTERCEPTOR_SKIP_REQUEST_PARAM}`, "")}), next);
  }

  /**
   * If request doesn't need jwt, just skip it.
   */
  if (shouldSkipByUrl(request.url)) return next(request).pipe(delay(delayTime()));

  /**
   * By default, add jwt.
   */
  return processWithJwt(request, next, auth);
}
