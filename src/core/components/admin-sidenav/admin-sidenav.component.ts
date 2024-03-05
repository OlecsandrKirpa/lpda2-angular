import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {AdminNavbarSidenavService} from "../../services/admin-navbar-sidenav.service";

export const COLLAPSE_SIDENAV_TRESHOLD = 768;

@Component({
  selector: 'app-admin-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatIcon,
  ],
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss'],
})
export class AdminSidenavComponent implements OnInit {
  private readonly service: AdminNavbarSidenavService = inject(AdminNavbarSidenavService);

  isOpen: boolean = false;

  ngOnInit(): void {
    this.service.sidenavOpen$.subscribe(open => {
      this.isOpen = open;
    });

    this.onResize();
  }

  onResize(): void {
    if (window.innerWidth < COLLAPSE_SIDENAV_TRESHOLD) {
      this.service.sidenavOpen$.next(false);
    }
  }
}
