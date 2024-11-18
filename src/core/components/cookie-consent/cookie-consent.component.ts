import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { TuiButtonModule } from '@taiga-ui/core';
import { ConfigsService } from '@core/services/configs.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    NgOptimizedImage,
  ],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {
  public readonly cookieName: string = 'lpda2-cookie-consent';
  public accepted: boolean = false;
  public config: ConfigsService = inject(ConfigsService);
  public cookie: CookieService = inject(CookieService);

  @HostBinding('class.accepted')
  get hidden(): boolean {
    return this.accepted;
  }

  constructor() {
    this.accepted = this.cookie.check(this.cookieName);

    if (this.accepted) this.updateExpiry();
  }

  accept(choice: string): void {
    this.cookie.set(this.cookieName, choice, { expires: 365, path: '/' });
    this.accepted = true;
  }

  updateExpiry(): void {
    const choice = this.cookie.get(this.cookieName);
    if(choice) {
      this.cookie.set(this.cookieName, choice, { expires: 365, path: '/' });
    }
  }
}
