import { Injectable, WritableSignal } from '@angular/core';
import { DomainService } from '../domain.service';
import { isStats, localizeStats, Stats, StatsParams } from '@core/lib/interfaces/stats';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService extends DomainService {

  constructor() {
    super(`/admin/stats`)
  }

  stats(params: Partial<StatsParams> = {}): Observable<Partial<Stats>> {
    return this.http.get<unknown>('', {params}).pipe(
      map((response: unknown): Partial<Stats> => {
        if (isStats(response)) return response;

        console.warn('Invalid stats response', response);
        return {};
      }),
      map((s: Partial<Stats>): Partial<Stats> => localizeStats(s))
    );
  }
}
