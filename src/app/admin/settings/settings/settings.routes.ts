import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: ``,
    loadComponent: () => import(`./list-settings/list-settings.component`).then(m => m.ListSettingsComponent)
  },
];