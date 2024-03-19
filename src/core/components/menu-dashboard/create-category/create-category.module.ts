import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {CreateCategoryComponent} from "@core/components/menu-dashboard/create-category/create-category.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(CreateCategoryComponent, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `l`
      })
    ])
  ],
})
export class CreateCategoryModule { }
