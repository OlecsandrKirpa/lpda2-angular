import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {MenuCategoriesService} from "@core/services/http/menu-categories.service";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MenuCategory} from "@core/models/menu-category";
import {distinctUntilChanged, finalize, map, takeUntil} from 'rxjs';
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {
  MenuCategorySelectComponent
} from "@core/components/dynamic-selects/menu-category-select/menu-category-select.component";
import {TuiButtonModule, TuiLinkModule, TuiTooltipModule} from "@taiga-ui/core";
import {UrlToPipe} from "@core/pipes/url-to.pipe";

@Component({
  selector: 'app-link-category',
  standalone: true,
  imports: [
    MenuCategorySelectComponent,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiTooltipModule,
    TuiLinkModule,
    RouterLink,
    UrlToPipe
  ],
  templateUrl: './link-category.component.html',
  styleUrl: './link-category.component.scss',
  providers: [
    TuiDestroyService,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkCategoryComponent implements OnInit {
  private readonly service: MenuCategoriesService = inject(MenuCategoriesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);
  readonly parent: WritableSignal<MenuCategory | null> = signal(null);

  parentId?: number | null = null;

  readonly form: FormGroup = new FormGroup({
    category: new FormControl<MenuCategory | null>(null),
  });

  ngOnInit(): void {
    this.route.parent?.parent?.params.pipe(
      takeUntil(this.destroy$),
      map((params: Params) => params['category_id']),
      distinctUntilChanged(),
    ).subscribe({
      next: (parentId: number | null) => {
        this.parentId = parentId;
        this.loadParent();
      }
    });
  }

  submit(): void {
    const parentId = this.parentId;
    const childId = this.form.value?.category?.id;
    if (!(parentId && childId)) {
      console.error(`something invalid.`, {parentId, childId})
      return;
    }

    if (this.form.invalid) return;

    this.loading.set(true);
    this.service.addCategory(parentId, childId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.navigateBack();
        this.notifications.fireSnackBar($localize`Categoria duplicata e associata.`, $localize`Fatto`, {duration: 3000})
      },
      error: (r: HttpErrorResponse) => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nell'associazione tra i record.`);
      }
    });
  }

  cancel(): void {
    if (!(confirm($localize`Sei sicuro di voler annullare questa azione?`))) return;

    this.navigateBack();
  }

  private navigateBack(): void {
    const afterUrl = this.route.snapshot.queryParams['afterUrl'];
    if (afterUrl) {
      this.router.navigateByUrl(afterUrl);
      return;
    }

    this.router.navigate(['..'], {relativeTo: this.route});
  }

  private loadParent(): void {
    this.parent.set(null);

    if (!(this.parentId)) {
      return;
    }

    this.service.show(this.parentId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (record: MenuCategory): void => {
        this.parent.set(record);
      },
      error: (r: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(r) || $localize`Qualcosa è andato storto nel caricamento della categoria padre.`);
      }
    });
  }
}
