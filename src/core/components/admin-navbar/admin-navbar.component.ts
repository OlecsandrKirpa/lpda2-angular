import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {TuiButtonModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {MatIconModule} from "@angular/material/icon";
import {User} from "../../models/user";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNavbarComponent {
  readonly cu: WritableSignal<User | null> = signal(null);
}
