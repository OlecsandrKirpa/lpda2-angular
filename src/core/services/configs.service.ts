import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, forkJoin, map, of, switchMap, tap, timeout } from 'rxjs';
import { DomainService } from './domain.service';

const AvaliableLocalConfigs = [
  `api.domain`,
  `api.secure`,
  `api.path`,
  `contact.email`,
  `contact.phone`,
  `contact.phone.prefix`,
  `locale`,
  `minPasswordLength`
] as const;

type ConfigKey = typeof AvaliableLocalConfigs[number];

type Configs = Partial<Record<ConfigKey, any>>;

/**
 * Service used to read local configs from files.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  private readonly configs$ = new BehaviorSubject<Configs | null>(null);
  private readonly http = inject(HttpClient);

  readonly locale$: Observable<string> = this.configs$.pipe(
    map((configs: Configs | null) => (configs || {})["locale"] ?? `it`),
  )

  get(key: ConfigKey): Observable<any | null> {
    this.loadConfigs();

    return this.configs$.pipe(
      filter((configs: unknown): configs is Configs => configs !== null && typeof configs === `object`),
      map((configs: Configs) => configs[key] ?? null),
      timeout({
        first: 1000 * 5,
        with: (details: any) => {
          console.warn(`ConfigsService.get timeout for key ${key}`, { details });
          return of(null);
        }
      }),
    )
  }

  private loaded = false;
  private loadConfigs(): void {
    if (this.loaded) return;
    this.loaded = true;

    const load = (filename: string): Observable<Configs> => this.http.get(`assets/config/${filename}`).pipe(
      catchError(() => of({})),
    );

    forkJoin(
      load('config.example.json'),
      load('config.json'),
    ).subscribe(([example, configs]) => {
      this.configs$.next({ ...example, ...configs });
    });
  }
}
