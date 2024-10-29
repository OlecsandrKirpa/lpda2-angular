import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import { ExportReservationsModalComponent } from "./export-reservations-modal.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(ExportReservationsModalComponent, {
        path: ``,
        closeable: true,
        dismissible: true,
        size: `m`
      })
    ])
  ],
})
export class ExportReservationsModalModule { }
