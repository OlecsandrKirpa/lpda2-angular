import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, catchError, of, forkJoin, switchMap, timeout, tap } from 'rxjs';
import {Setting, SettingValue} from "@core/lib/settings";
import {DomainService} from "@core/services/domain.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends DomainService {

  constructor() {
    super(`/admin/settings`);
  }

  search(query: Record<string, string|number> = {}): Observable<{ items: Setting[] }> {
    return this.http.get<{ items: Setting[] }>(`/`);
  }

  show(key: string): Observable<Setting> {
    return this.http.get<Setting>(`/${key}`);
  }

  value(key: string): Observable<SettingValue> {
    return this.http.get<SettingValue>(`/${key}/value`);
  }

  update(key: string, value: SettingValue): Observable<Setting> {
    if (typeof value === 'object' && value != null) value = JSON.stringify(value);

    return this.http.patch<Setting>(`/${key}`, { value });
  }
}
