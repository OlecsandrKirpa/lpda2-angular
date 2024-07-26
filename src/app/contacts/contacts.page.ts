import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TuiHintModule, TuiLinkModule } from '@taiga-ui/core';
import {ConfigsService} from "@core/services/configs.service";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TuiLinkModule,
    TuiHintModule,
  ],
  templateUrl: './contacts.page.html',
  styleUrl: './contacts.page.scss'
})
export class ContactsPage {
  public readonly config: ConfigsService = inject(ConfigsService);

}
