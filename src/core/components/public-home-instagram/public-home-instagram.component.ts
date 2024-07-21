import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {BypassSecurityTrustResourceUrlPipe, SafeUrlPipe} from "@core/pipes/safe-url.pipe";
import {AutosizeIframeDirective} from "@core/directives/autosize-iframe.directive";
import {PublicIconComponent} from "@core/components/public-icon/public-icon.component";

@Component({
  selector: 'app-public-home-instagram',
  standalone: true,
  imports: [
    SafeUrlPipe,
    BypassSecurityTrustResourceUrlPipe,
    AutosizeIframeDirective,
    PublicIconComponent
  ],
  templateUrl: './public-home-instagram.component.html',
  styleUrl: './public-home-instagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicHomeInstagramComponent {
  readonly instagramPostUrl: WritableSignal<string | null> = signal("https://www.instagram.com/reel/CrbaJ6ksLUr/embed");
}
