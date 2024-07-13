import {Component, forwardRef, Input} from '@angular/core';
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {TuiInputNumberModule} from "@taiga-ui/kit";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {SubmitExpandComponent} from "@core/components/submit-expand/submit-expand.component";

@Component({
  selector: 'app-preferences-number-input',
  standalone: true,
  imports: [
    TuiInputNumberModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    SubmitExpandComponent
  ],
  templateUrl: './preferences-number-input.component.html',
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesNumberInputComponent),
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
export class PreferencesNumberInputComponent extends PreferencesCommonInputComponent<number> {
  @Input() postfix: string = ``;
}
