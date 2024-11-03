import { Injectable, Injector, WritableSignal, effect, inject, signal } from '@angular/core';
import { DomainService } from '../domain.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, catchError, map, of, tap, Subject} from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../notifications.service';
import {ProfileService} from "@core/services/http/profile.service";
import {JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM, JWT_INTERCEPTOR_SKIP_REQUEST_PARAM} from "@core/interceptors/jwt.interceptor";

export type AuthRootResponse = {
  sucess: true,
  // root_at: current_user.root_at,
  duration: number // in seconds, how many time the root mode will be active.
}
@Injectable({
  providedIn: 'root'
})
export class AuthService extends DomainService {
  private readonly storage: LocalStorageService = inject(LocalStorageService);
  private readonly profile: ProfileService = inject(ProfileService);
  private readonly router: Router = inject(Router);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  private readonly injector: Injector = inject(Injector);

  readonly jwt: WritableSignal<string | null> = signal(null);
  private timeout: NodeJS.Timeout | undefined;

  constructor() {
    super(`/auth`);
  }

  root(password: string): Observable<AuthRootResponse> {
    return this.http.post<AuthRootResponse>(`/root?${JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM}`, { password: password });
  }

  login(params: { email: string, password: string }): Observable<true> {
    return this.post(`/login`, params).pipe(
      map((data: unknown) => data as { jwt: string }),
      tap(data => this.updateJWT(data.jwt)),
      tap(() => this.profile.reload().subscribe()),
      map(() => true),
    )
  }

  logout(): Observable<boolean> {
    return this.http.post(`/logout?${JWT_INTERCEPTOR_DONT_SKIP_REQUEST_PARAM}`, {}).pipe(
      tap(() => this.clearRefreshTimeout()),
      tap(() => this.jwt.set(null)),
      tap(() => this.profile.reload().subscribe()),
      map(() => true),
      catchError((error) => {
        console.error("logout() error", {error});

        return of(false);
      })
    );
  }

  refreshToken(): Observable<boolean> {
    return this.http.post<any>(`/refresh_token`, {}).pipe(
      map((data: unknown) => data as { token: string }),
      tap(data => this.updateJWT(data.token)),
      tap(() => this.profile.loadIfNotLoaded()),
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        console.error(`error on refreshToken()`, error);
        return of(false);
      }),
    );
  }

  requireOtp(email: string): Observable<boolean> {
    return this.http.post(`/require_otp`, { email }).pipe(
      map((data: unknown) => data as { success: boolean }),
      map((data) => data.success),
    )
  }

  resetPassword(params: {code: string, password: string}): Observable<boolean> {
    return this.http.post(`/reset_password`, params).pipe(
      map((data: unknown) => data as { success: boolean }),
      map((data) => data.success),
    )
  }

  requireResetPassword(email: string): Observable<boolean> {
    return this.http.post(`/require_reset_password`, { email }).pipe(
      map((data: unknown) => data as { success: boolean }),
      map((data) => data.success),
    )
  }

  private readonly cachedRefreshToken: Subject<boolean> = new Subject<boolean>;
  private refreshTokenSubscription: Observable<boolean> | undefined;
  refreshTokenIfNotCalled(): Observable<boolean> {
    if (this.refreshTokenSubscription) return this.cachedRefreshToken;

    return this.refreshTokenSubscription = this.refreshToken().pipe(
      catchError(() => of(false)), // redundant but it's ok.
      tap(() => this.refreshTokenSubscription = undefined),
      tap((value: boolean) => this.cachedRefreshToken.next(value)),
    )
  }

  private updateJWT(jwt: string): void {
    this.jwt.set(jwt);

    if (this.jwt()) {
      const data = JSON.parse(atob(jwt.split(".")[1]));
      this.storage.set(`userData`, data);
      this.setTokenExpireTimeout(data.ttl * 1000);
    } else {
      this.clearRefreshTimeout();
      console.error("AuthService updateJWT(), Invalid jwt", this.jwt())
    }
  }

  private clearRefreshTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  private setTokenExpireTimeout(ttl: number): void {
    this.clearRefreshTimeout();

    if (ttl > 15000) {
      this.timeout = setTimeout(() => {
        this.refreshToken().subscribe(
          (data: any) => {
            // this.currentUser = new User(data);
          });
      }, ttl - 10000);
    }
  }
}
