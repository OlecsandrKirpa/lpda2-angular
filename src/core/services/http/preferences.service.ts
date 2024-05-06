import {Injectable} from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {filter, map, Observable} from "rxjs";
import {isPreferences, Preference, Preferences, PreferenceValue} from "@core/lib/preferences";

@Injectable({
  providedIn: 'root'
})
export class PreferencesService extends DomainService {

  constructor() {
    super(`/admin/preferences`);
  }

  search(query: Record<string, string|number> = {}): Observable<{ items: Preference[] }> {
    return this.http.get<{ items: Preference[] }>(`/`);
  }

  show(key: string): Observable<Preference> {
    return this.http.get<Preference>(`/${key}`);
  }

  value(key: string): Observable<PreferenceValue> {
    return this.http.get<PreferenceValue>(`/${key}/value`);
  }

  update(key: string, value: PreferenceValue): Observable<Preference> {
    return this.http.patch<Preference>(`/${key}`, { value });
  }
}
