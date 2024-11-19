import {computed, inject, Injectable, LOCALE_ID, Signal, signal, WritableSignal} from '@angular/core';
import {LocalStorageService} from "@core/services/local-storage.service";

const session_key = `lpda2-e5d03c044b1729d3c4bf2975423c8eea`

/**
 * Share current session data between components
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly storage: LocalStorageService = inject(LocalStorageService);

  readonly language: Signal<string> = computed(() => this.writableLanguage());
  private readonly defaultLanguage = inject(LOCALE_ID);
  private writableLanguage: WritableSignal<string> = signal(this.defaultLanguage);

  constructor() {
    this.loadSession();
  }

  setLanguage(language: string): void {
    this.writableLanguage.set(language);
    this.saveSession();
  }

  private saveSession(): void {
    this.storage.set(session_key, this.encodeSession());
  }

  private loadSession(): void {
    const session = this.storage.get(session_key);
    if (session) {
      this.decodeSession(session);
    }
  }

  private encodeSession(): Record<string, any> {
    return {
      language: this.language()
    }
  }

  private decodeSession(session: Record<string, any>): void {
    if (session['language'] && session['language'].length > 0) this.setLanguage(session['language']);
  }
}
