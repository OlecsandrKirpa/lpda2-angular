import {ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterModule, RouterOutlet} from "@angular/router";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {User} from "../../models/user";
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule} from "@taiga-ui/core";
import {NavbarUserBadgeComponent} from "../navbar-user-badge/navbar-user-badge.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {takeUntil} from "rxjs";

export const COLLAPSE_SIDENAV_TRESHOLD = 768;
export const SHOW_MENU_BUTTON_TRESHOLD = 1024;

@Component({
  selector: 'app-admin-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatIcon,
    TuiHostedDropdownModule,
    TuiButtonModule,
    MatIconModule,
    TuiDataListModule,
    NavbarUserBadgeComponent,
  ],
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss'],
  providers: [
    TuiDestroyService
  ]
})
export class AdminSidenavComponent implements OnInit {
  readonly cu: WritableSignal<User | null> = signal(new User({
    fullname: 'Gigi',
    email: 'gigi@example.como',
    id: 2,
    created_at: '',
    updated_at: ''
  }));

  isOpen: boolean = false;
  showMenuButton: boolean = false;
  isMobile: boolean = false;
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  constructor() {
    /**
     * When navigating, close sidenav on mobile
     */
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event: any): void => {
      if (event instanceof NavigationStart && this.isMobile) {
        this.closeSidenav();
      }
    });
  }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.showMenuButton = window.innerWidth < SHOW_MENU_BUTTON_TRESHOLD;
    this.isMobile = window.innerWidth < SHOW_MENU_BUTTON_TRESHOLD;
    this.isOpen = !this.isMobile;
  }

  triggerSidenav(): void {
    this.isOpen = !this.isOpen;
  }

  overlayClick(event: unknown): void {
    this.closeSidenav();
  }

  closeSidenav(): void {
    this.isOpen = false;
  }
}
