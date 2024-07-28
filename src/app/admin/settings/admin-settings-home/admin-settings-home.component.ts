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
    {
      name: $localize`Preferenze`,
      description: $localize`Modifica impostazioni per il tuo utente`,
      path: `preferences`,
      icon: {
        source: `material`,
        name: `manage_accounts`
      }
    },
    {
      name: $localize`Impostazioni`,
      description: $localize`Modifica impostazioni al livello di sistema`,
      path: `settings`,
      icon: {
        source: `material`,
        name: `settings`
      }
    },
    {
      name: $localize`Comunicazioni pubbliche`,
      description: $localize`Mostra messaggi personalizzati nelle pagine pubbliche`,
      path: `public_messages`,
      icon: {
        source: `material`,
        name: `chat`
      }
    },
  ];
}
