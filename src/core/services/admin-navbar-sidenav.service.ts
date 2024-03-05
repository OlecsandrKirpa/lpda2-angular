import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

/**
 * Service to control admin navbar and sidenav.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminNavbarSidenavService {

  sidenavOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }
}
