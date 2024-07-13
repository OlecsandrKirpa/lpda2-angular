import {Component, forwardRef} from '@angular/core';
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {SubmitExpandComponent} from "@core/components/submit-expand/submit-expand.component";

@Component({
  selector: 'app-preferences-text-input',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    SubmitExpandComponent
  ],
  templateUrl: './preferences-text-input.component.html',
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesTextInputComponent),
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
export class PreferencesTextInputComponent extends PreferencesCommonInputComponent<string> {

}
