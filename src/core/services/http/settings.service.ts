import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, catchError, of, forkJoin, switchMap, timeout, tap } from 'rxjs';
import { DomainService } from './domain.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly configs$ = new BehaviorSubject<Record<string, any> | null>(null);
  private readonly http = inject(HttpClient);
  private readonly domain = inject(DomainService);

  get(key: string): Observable<any | null> {
    this.loadSettings();

    return this.configs$.pipe(
      filter(
        (configs: unknown): configs is Record<string, any> =>
          configs !== null && typeof configs === `object`
      ),
      map((configs: Record<string, any>) => configs[key] ?? null),
      timeout({
        first: 1000 * 5,
        with: (details: any) => {
          console.warn(`ConfigsService.get timeout for key ${key}`, { details });
          return of(null);
        }
      }),
    );
  }

  set(key: string, value: any): Observable<boolean> {
    return this.domain.post<{ success: boolean }>(`/settings/`, { key, value }).pipe(
      map((response: { success: boolean }) => response?.success === true),
      catchError(() => of(false)),
    );
  }

  private loaded = false;
  private loadSettings(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.domain.get(`/settings/`).subscribe((data: any) => {
      this.configs$.next(data);
    });
  }
}
