import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {MatIconModule} from "@angular/material/icon";
import {User} from "../../models/user";
import {AdminNavbarSidenavService} from "../../services/admin-navbar-sidenav.service";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    MatIconModule,
    TuiDataListModule,
  ],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNavbarComponent {
  readonly cu: WritableSignal<User | null> = signal(new User({fullname: 'Gigi', email: 'gigi@example.como', id: 2, created_at: '', updated_at: ''}));

  private readonly service = inject(AdminNavbarSidenavService);

  logout(): void {
    console.warn("TODO: implement logout.");
  }

  triggerSidenav() {
    this.service.sidenavOpen$.next(!this.service.sidenavOpen$.value);
  }
}
