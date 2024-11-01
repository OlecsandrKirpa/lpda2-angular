import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, catchError, of, forkJoin, switchMap, timeout, tap } from 'rxjs';
import {DomainService} from "@core/services/domain.service";
import { Contact, Contacts, ContactValue } from '@core/lib/interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends DomainService {

  constructor() {
    super(`/admin/contacts`);
  }

  search(): Observable<{ items: Contact[] }> {
    return this.http.get<{ items: Contact[] }>(`/`);
  }

  show(key: string): Observable<Contact | null> {
    return this.http.get<Contact>(`/${key}`);
  }

  update(key: string, value: ContactValue): Observable<Contact> {
    if (typeof value === 'object' && value != null) value = JSON.stringify(value);

    return this.http.patch<Contact>(`/${key}`, { value });
  }
}
