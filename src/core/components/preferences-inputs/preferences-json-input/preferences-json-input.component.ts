import {Component, forwardRef, Input, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {SubmitExpandComponent} from "@core/components/submit-expand/submit-expand.component";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {takeUntil} from "rxjs";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {CommonTranslatePipe} from "@core/pipes/common-translate.pipe";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-preferences-json-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SubmitExpandComponent,
    TuiInputModule,
    FormsModule,
    TuiTextfieldControllerModule,
    CommonTranslatePipe,
    JsonPipe,
  ],
  templateUrl: './preferences-json-input.component.html',
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesJsonInputComponent),
      multi: true
    },
  ],
  outputs: [
    ...PreferencesCommonInputComponent.outputs
  ],
  inputs: [
    ...PreferencesCommonInputComponent.inputs,
  ]
})
export class PreferencesJsonInputComponent extends PreferencesCommonInputComponent<Record<string, unknown>> {

  readonly keys: WritableSignal<string[]> = signal([]);

  override ngOnInit() {
    super.ngOnInit();

    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (value: Record<string, unknown> | null): void => {
        this.keys.set(value ? Object.keys(value) : []);
      }
    });
  }

  updateValue(key: string, value: unknown) {
    this.control.setValue(
      {
        ...this.control.value,
        [key]: value
      }
    )
  }
}
