import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { tuiGenerateDialogableRoute } from "@taiga-ui/kit";
import { ConfirmDeletePage } from "./confirm-delete.page";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(ConfirmDeletePage, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `m`
      })
    ])
  ]
})
export class ConfirmDeleteModule { }
