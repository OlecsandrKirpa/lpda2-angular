import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {TuiButtonModule, TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {JsonPipe} from "@angular/common";
import {TuiInputModule, TuiTextareaModule} from "@taiga-ui/kit";
import {TagFormComponent} from "@core/components/tag-form/tag-form.component";
import {TagsService} from "@core/services/http/tags.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {NotificationsService} from "@core/services/notifications.service";
import {Tag} from "@core/models/tag";
import {BehaviorSubject, distinctUntilChanged, filter, finalize, Observable, switchMap, takeUntil, tap} from "rxjs";
import {nue} from "@core/lib/nue";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";


@Component({
  selector: 'app-edit-tag',
  standalone: true,
  imports: [
    RouterLink,
    TuiLinkModule,
    MatIcon,
    ReactiveFormsModule,
    I18nInputComponent,
    ErrorsComponent,
    ImageInputComponent,
    TuiButtonModule,
    JsonPipe,
    TuiInputModule,
    TuiTextareaModule,
    TagFormComponent,
  ],
  templateUrl: './edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
  private readonly service: TagsService = inject(TagsService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(TagFormComponent) formComponent?: TagFormComponent;

  readonly item: WritableSignal<Tag | null> = signal(null);

  readonly id$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  readonly item$: Observable<Tag> = this.id$.pipe(
    takeUntil(this.destroy$),
    filter((id): id is number => id !== null),
    distinctUntilChanged(),
    switchMap((id: number) => this.service.show(id)),
    tap(() => this.loading.set(false)),
    tap((item: Tag) => this.item.set(item))
  )

  ngOnInit(): void {
    this.item$.pipe(takeUntil(this.destroy$)).subscribe(nue());

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (params: Params) => {
        this.id$.next(params['id']);
      }
    })
  }

  submit(formVal: FormData): void {
    // console.log(`EditTagComponent.submit`, formVal);
    const id = this.id$.value;

    if (!(id)) throw new Error(`Tag ID is not set`);

    this.loading.set(true);
    this.service.update(id, formVal).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (item: Tag): void => {
        this.notifications.fireSnackBar($localize`Modifiche salvate.`);
        this.router.navigate([`..`], {relativeTo: this.route});
      },
      error: (errors: HttpErrorResponse): void => {
        if (this.formComponent) ReactiveErrors.assignErrorsToForm(this.formComponent.form, errors);
        this.notifications.error(parseHttpErrorMessage(errors) || $localize`Qualcosa è andato storto nel salvataggio.`);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
