import {NewUserComponent} from "./new-user.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(NewUserComponent, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `l`
      })
    ])
  ],
})
export class NewUserModule { }
