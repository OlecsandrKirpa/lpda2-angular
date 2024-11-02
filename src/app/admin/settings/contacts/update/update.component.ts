import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '@core/lib/interfaces/contact';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { ReactiveErrors } from '@core/lib/reactive-errors/reactive-errors';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { ContactsService } from '@core/services/http/contacts.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiAutoFocusModule, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { distinctUntilChanged, filter, finalize, map, takeUntil, tap } from 'rxjs';
import { HumanizeContactKeyPipe } from "../../../../../core/pipes/humanize-contact-key.pipe";
import { NoItemsComponent } from "../../../../../core/components/no-items/no-items.component";
import { NoItemComponent } from "../../../../../core/components/no-item/no-item.component";
import { TuiInputModule } from '@taiga-ui/kit';
import { ErrorsComponent } from "../../../../../core/components/errors/errors.component";

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButtonModule,
    TuiLoaderModule,
    HumanizeContactKeyPipe,
    NoItemsComponent,
    NoItemComponent,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    ErrorsComponent
],
  templateUrl: './update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class UpdateComponent implements OnInit {
  private readonly service = inject(ContactsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly item: WritableSignal<Contact | null> = signal<Contact | null>(null);
  readonly key: WritableSignal<string | null> = signal<string | null>(null);

  readonly downloading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly loading = computed(() => this.downloading() || this.saving());

  readonly valueControl = new FormControl<string | null>(null);
  readonly form = new FormGroup<{value: AbstractControl<string | null>}>({
    value: this.valueControl
  });

  private readonly formDefaultValue = this.form.value;

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy),
      map((p: Params) => p["key"]),
      filter((v: unknown): v is string => typeof v === "string" && v.length > 0),
      distinctUntilChanged(),
      tap((key: string) => this.key.set(key)),
      tap(() => this.reload()),
    ).subscribe()
  }

  submit(): void  {
    const key = this.key();
    if (this.form.invalid || !key) return;
    const value: string = this.valueControl.value || ``;

    this.saving.set(true);
    this.service.update(key, value).pipe(
      takeUntil(this.destroy),
      finalize(() => this.saving.set(false))
    ).subscribe({
      next: () => this.close(),
      error: (e: unknown) => {
        if (e instanceof HttpErrorResponse) {
          ReactiveErrors.assignErrorsToForm(this.form, e);
          // this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
        } else {
          this.notifications.error();
        }
      }
    })
  }

  cancel(): void {
    if (!(confirm($localize`Sei sicuro di voler annullare? Tutte le modifiche non salvate andranno perse.`))) return;

    this.close();
  }

  close(): void {
    this.router.navigate([`..`], { relativeTo:this.route });
  }

  private reload(): void {
    this.item.set(null);
    const key: string | null = this.key();
    if (!key) {
      console.error(`invalid key`);
      return;
    }

    this.downloading.set(true);
    this.service.show(key).pipe(
      takeUntil(this.destroy),
      finalize(() => this.downloading.set(false))
    ).subscribe({
      next: (v: Contact | null) => this.itemLoaded(v),
      error: (e: unknown) => this.notifications.error(e instanceof HttpErrorResponse ? parseHttpErrorMessage(e) : SOMETHING_WENT_WRONG_MESSAGE)
    })
  }

  private itemLoaded(contact: Contact | null): void {
    this.item.set(contact);

    if (contact){
      this.form.patchValue({
        value: contact.value ?? null
      })
    } else {
      this.form.reset(this.formDefaultValue);
    }
  }
}
