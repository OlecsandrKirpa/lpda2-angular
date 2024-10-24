import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import { Title } from '@angular/platform-browser';


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
  readonly _ = inject(Title).setTitle($localize`Impostazioni | La Porta D'Acqua`);

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
      name: $localize`Pagamenti alla prenotazione`,
      description: $localize`Definisci quando è richiesto un pagamento per una prenotazione e di quanto.`,
      path: `preorder_reservation_groups`,
      icon: {
        source: `material`,
        name: `price_change`
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
    {
      name: $localize`Chiusure`,
      description: $localize`Modifica giorni di ferie e chiusure settimanali`,
      path: `holidays`,
      icon: {
        source: `material`,
        name: `beach_access`
      }
    },
  ];
}
