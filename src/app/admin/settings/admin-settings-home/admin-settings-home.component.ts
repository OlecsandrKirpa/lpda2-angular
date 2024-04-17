import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";


export type Setting = {
  name: string;
  description: string;
  path: string;

  icon: {
    source: "material";
    name: string;
  }
};

@Component({
  selector: 'app-admin-settings-home',
  standalone: true,
  imports: [
    MatIcon,
    NgClass,
    NgForOf,
    RouterLink
  ],
  templateUrl: './admin-settings-home.component.html',
  styleUrl: './admin-settings-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSettingsHomeComponent {
  readonly settings: Setting[] = [
    {
      name: $localize`Utenti`,
      description: $localize`Aggiungi o elimina utenti`,
      path: 'users',
      icon: {
        source: 'material',
        name: 'group'
      }
    },
  ];
}
