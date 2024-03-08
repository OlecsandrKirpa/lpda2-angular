import {Component, Input} from '@angular/core';
import {User} from "../../models/user";
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-navbar-user-badge',
  standalone: true,
  imports: [
    NgClass,
    TuiHostedDropdownModule,
    TuiButtonModule,
    MatIcon,
    TuiDataListModule,
    RouterLink
  ],
  templateUrl: './navbar-user-badge.component.html',
  styleUrl: './navbar-user-badge.component.scss'
})
export class NavbarUserBadgeComponent {
  @Input({required: true}) user?: User | null;

  logout(): void {
    console.warn("TODO: implement logout.");
  }
}
