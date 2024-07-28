import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {EditPublicMessageComponent} from "./edit-public-message.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(EditPublicMessageComponent, {
        path: ``,
        closeable: true,
        dismissible: true,
        size: `m`
      })
    ])
  ]
})
export class EditPublicMessageModule {
}
