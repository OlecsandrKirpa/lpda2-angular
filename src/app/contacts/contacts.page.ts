import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TuiHintModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import {ConfigsService} from "@core/services/configs.service";
import { PublicPagesDataService } from '@core/services/http/public-pages-data.service';
import { PublicData } from '@core/lib/interfaces/public-data';
import { KeyPipe } from "../../core/pipes/key.pipe";
import { IconComponent } from "../../core/components/icon/icon.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TuiLinkModule,
    TuiHintModule,
    KeyPipe,
    IconComponent,
    TuiLoaderModule,
],
  templateUrl: './contacts.page.html',
  styleUrl: './contacts.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPage {
  public readonly config: ConfigsService = inject(ConfigsService);
  private readonly publicData = inject(PublicPagesDataService);

  readonly contacts: WritableSignal<PublicData["contacts"] | null> = this.publicData.contacts;
}
