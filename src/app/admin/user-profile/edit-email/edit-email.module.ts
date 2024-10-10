import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { tuiGenerateDialogableRoute } from "@taiga-ui/kit";
import { EditEmailPage } from "./edit-email.page";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(EditEmailPage, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `m`
      })
    ])
  ]
})
export class EditEmailModule { }
