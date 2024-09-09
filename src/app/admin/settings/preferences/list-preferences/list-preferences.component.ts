import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {PreferencesService} from "@core/services/http/preferences.service";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {finalize, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationsService} from "@core/services/notifications.service";
import {ActivatedRoute, Router} from "@angular/router";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {SOMETHING_WENT_WRONG_MESSAGE} from "@core/lib/something-went-wrong-message";
import {Preference, Preferences, PreferenceValue} from "@core/lib/preferences";
import {
  AdminLanguageSwitcherComponent
} from "@core/components/admin-language-switcher/admin-language-switcher.component";
import {TuiDataListWrapperModule, TuiMultiSelectModule} from "@taiga-ui/kit";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {LanguageNames} from "@core/lib/language-names";
import {LanguagePipe} from "@core/pipes/language.pipe";
import {TuiDropdownModule, TuiSizeL, TuiSizeS} from "@taiga-ui/core";
import {
  PreferencesMultipleSelectComponent
} from "@core/components/preferences-inputs/preferences-multiple-select/preferences-multiple-select.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-preferences',
  standalone: true,
  imports: [
    AdminLanguageSwitcherComponent,
    TuiMultiSelectModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    LanguagePipe,
    TuiDropdownModule,
    PreferencesMultipleSelectComponent
  ],
  templateUrl: './list-preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    LanguagePipe
  ]
})
export class ListPreferencesComponent implements OnInit {
  private readonly service: PreferencesService = inject(PreferencesService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);
  private readonly notifications: NotificationsService = inject(NotificationsService);

  readonly _ = inject(Title).setTitle($localize`Preferenze | La porta d'acqua`);

  readonly inputSize: TuiSizeS | TuiSizeL = 'l';

  readonly languagePipe: LanguagePipe = inject(LanguagePipe)

  readonly allLanguages: string[] = Object.keys(LanguageNames);

  readonly form: FormGroup = new FormGroup({
    known_languages: new FormControl([])
  });

  private readonly saving: WritableSignal<boolean> = signal(false);
  private readonly searching: WritableSignal<boolean> = signal(false);

  readonly loading = computed(() => this.saving() || this.searching());

  ngOnInit(): void {
    this.reload();
  }

  save(key: string, value: PreferenceValue): void {
    this.saving.set(true);
    if (Array.isArray(value)) value = value.join(",")

    this.service.update(key, value).pipe(
      finalize(() => this.saving.set(false)),
      finalize(() => this.reload())
    ).subscribe({
      error: (e: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    });
  }

  applyPipeFunction(languagePipe: { transform: (value: unknown) => string }): (value: string) => string {
    return languagePipe.transform;
  }

  private reload(): void {
    this.searching.set(true);
    this.service.search().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.searching.set(false)),
    ).subscribe({
      next: (data: { items: Preference[] }): void => {
        this.updateFormByData(data.items);
      },
      error: (e: HttpErrorResponse): void => {
        this.notifications.error(parseHttpErrorMessage(e) || SOMETHING_WENT_WRONG_MESSAGE);
      }
    })
  }

  private updateFormByData(preferences: Preference[]): void {
    const data: Record<string, any> = {};

    /**
     * ARRAYS
     */
    [
      `known_languages`
    ].forEach((key: string): void => {
      const pref = preferences.find((preference: Preference) => preference.key === key);

      if (pref && Array.isArray(pref.value)) data[key] = pref.value;
      else if (pref && typeof pref.value == 'string') data[key] = pref.value.split(",");
      else if (!pref) console.warn(`Preference ${key} not found`);
      else console.warn(`Preference ${key} not found or invalid`, pref.value);
    });

    this.form.patchValue(data);
  }
}
