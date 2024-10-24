import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HolidayFormComponent } from '@core/components/holiday-form/holiday-form.component';
import { parseHttpErrorMessage } from '@core/lib/parse-http-error-message';
import { ReactiveErrors } from '@core/lib/reactive-errors/reactive-errors';
import { SOMETHING_WENT_WRONG_MESSAGE } from '@core/lib/something-went-wrong-message';
import { Holiday } from '@core/models/holiday';
import { HolidaysService } from '@core/services/http/holidays.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';
import { takeUntil, finalize, filter, map, switchMap, Observable, distinct, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    HolidayFormComponent,
    TuiLoaderModule,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ],
})
export class UpdateComponent implements OnInit {
  private readonly service = inject(HolidaysService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notifications: NotificationsService = inject(NotificationsService);
  // private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private id: number | null = this.route.snapshot.params["id"];

  readonly holiday: WritableSignal<Holiday | null> = signal(null);

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map((params: Params): unknown => Number(params["id"])),
      distinctUntilChanged(),
      filter((id: unknown): id is number => typeof id == "number" && id > 0 && !isNaN(id)),
      tap((id: number) => this.id = id),
      switchMap((id: number): Observable<Holiday> => this.service.show(id)),
    ).subscribe({
      next: (params: Holiday) => {
        this.holiday.set(params);
      }
    })
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  readonly loading: WritableSignal<boolean> = signal(false);

  @ViewChild(HolidayFormComponent) form?: HolidayFormComponent;

  submit(data: Record<string, unknown>): void {
    if (!this.id) throw new Error('ID not provided');
    if (this.loading()) return;

    this.loading.set(true);
    this.service.update(this.id, data).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e: HttpErrorResponse) => {
        this.manageErrors(e);
      }
    })
  }

  private manageErrors(e: HttpErrorResponse): void {
    this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);

    const form: FormGroup | null | undefined = this.form?.findForm();
    if (!form) throw new Error('Form not found');

    if (e.status == 422) {
      ReactiveErrors.assignErrorsToForm(form, e);
      // this.cd.detectChanges();
    }

  }
}
