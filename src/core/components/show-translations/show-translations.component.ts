import {Component, computed, Input, Signal, signal} from '@angular/core';
import {CommonTranslatePipe} from "@core/pipes/common-translate.pipe";

@Component({
  selector: 'app-show-translations',
  standalone: true,
  imports: [
    CommonTranslatePipe
  ],
  templateUrl: './show-translations.component.html'
})
export class ShowTranslationsComponent {
  /**
   * Input will look like this:
   * {
   *   'en': 'Hello',
   *   'es': 'Hola'
   * }
   */
  readonly translations$ = signal<Record<string, string> | null>(null);
  @Input() set translations(value: Record<string, string> | null | undefined) {
    this.translations$.set(value ?? null);
  }

  get translations(): Record<string, string> | null {
    return this.translations$();
  }

  readonly values$: Signal<[string, string][]> = computed(() => Object.entries(this.translations$() ?? {}));

  // readonly keys$ = computed(() => Object.keys(this.translations$() ?? {}));
  // readonly values$ = computed(() => Object.values(this.translations$() ?? {}));
}
