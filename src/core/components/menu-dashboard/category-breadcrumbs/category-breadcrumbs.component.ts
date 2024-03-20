import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MenuCategoryDashboardData} from "@core/lib/interfaces/menu-category-dashboard-data";
import {UrlToPipe} from "@core/pipes/url-to.pipe";
import {TuiBreadcrumbsModule, TuiInputNumberModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiLinkModule} from "@taiga-ui/core";
import {TuiRepeatTimesModule} from "@taiga-ui/cdk";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-category-breadcrumbs',
  standalone: true,
  imports: [
    TuiBreadcrumbsModule,
    TuiDataListModule,
    TuiRepeatTimesModule,
    RouterLink,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiInputNumberModule,
    FormsModule,
    UrlToPipe
  ],
  templateUrl: './category-breadcrumbs.component.html',
  styleUrl: './category-breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UrlToPipe,
  ]
})
export class CategoryBreadcrumbsComponent {
  private readonly urlTo: UrlToPipe = inject(UrlToPipe);

  items: { url: string, name: string }[] = [];

  @Input() set breadcrumbs(value: MenuCategoryDashboardData['breadcrumbs'] | null) {
    this.parseBreadcrumbs(value ?? []);
    this.max = this.items.length;
  }

  max: number  = 1;

  @Input() includeRoot: boolean = true;

  private parseBreadcrumbs(breadcrumbs: MenuCategoryDashboardData['breadcrumbs']): void {
    this.items = [];

    if (this.includeRoot) {
      this.items.push({url: '/admin/menu/', name: $localize`Menu`});
    }

    if (breadcrumbs) {
      breadcrumbs.forEach((item) => {
        const url = this.urlTo.transform(item.id, `menuCategory.show`);
        if (!(url)) {
          console.error(`Invalid url for category`, {item, url});
          return;
        }

        this.items.push({url, name: item.name ?? `no-name #${item.id}`});
      });
    }
  }
}
