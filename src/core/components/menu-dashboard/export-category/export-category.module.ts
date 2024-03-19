import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {ExportCategoryComponent} from "@core/components/menu-dashboard/export-category/export-category.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(ExportCategoryComponent, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `l`
      })
    ])
  ],
})
export class ExportCategoryModule { }
