import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly storage: Storage = localStorage;
  private readonly prefix: string = 'lpda2';

  get(key: string): Record<string, any> | null {
    const item = this.storage.getItem(`${this.prefix}.${key}`);
    let value;
    try {
      value = item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localStorage key ${key}:`, error);
      value = null;
    }

    return value;
  }

  set(key: string, value: Record<string, any>): void {
    this.storage.setItem(`${this.prefix}.${key}`, JSON.stringify(value));
  }

  delete(key: string): void {
    this.storage.removeItem(`${this.prefix}.${key}`);
  }
}
