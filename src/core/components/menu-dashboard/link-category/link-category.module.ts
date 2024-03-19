import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {LinkCategoryComponent} from "@core/components/menu-dashboard/link-category/link-category.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      tuiGenerateDialogableRoute(LinkCategoryComponent, {
        path: ``,
        closeable: true,
        dismissible: false,
        size: `l`
      })
    ])
  ],
})
export class LinkCategoryModule { }
