import {Component, Input, effect, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '@core/services/http/profile.service';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { User } from '@core/models/user';
import { AuthService } from '@core/services/http/auth.service';
import { nue } from '@core/lib/nue';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-already-logged-in',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiLinkModule,
    TuiButtonModule,
    RouterModule
],
  templateUrl: './already-logged-in.component.html',
  styleUrls: ['./already-logged-in.component.scss']
})
export class AlreadyLoggedInComponent {
  private readonly auth = inject(AuthService);
  private readonly profile = inject(ProfileService);
  @Input() redirectUrl: string = `/admin`;

  user = this.profile.cu;

  constructor(){}

  logout(): void {
    this.auth.logout().subscribe(nue());
  }
}
