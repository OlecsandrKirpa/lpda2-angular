import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {AdminNavbarComponent} from "../../../core/components/admin-navbar/admin-navbar.component";
import {AdminSidenavComponent} from "../../../core/components/admin-sidenav/admin-sidenav.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavbarComponent, AdminSidenavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

}
