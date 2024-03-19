import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {
  DuplicateCategoryComponent
} from "@core/components/menu-dashboard/duplicate-category/duplicate-category.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(DuplicateCategoryComponent, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `l`
      })
    ])
  ],
})
export class DuplicateCategoryModule { }
