import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { tuiGenerateDialogableRoute } from "@taiga-ui/kit";
import { ContactsPage } from "./contacts.page";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(ContactsPage, {
        path: ``,
        closeable: true,
        dismissible: true,
        size: `m`
      })
    ])
  ]
})
export class ContactsPageModule { }
