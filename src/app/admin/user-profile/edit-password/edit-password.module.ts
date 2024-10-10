import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { tuiGenerateDialogableRoute } from "@taiga-ui/kit";
import { EditPasswordPage } from "./edit-password.page";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(EditPasswordPage, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `s`
      })
    ])
  ]
})
export class EditPasswordModule { }
