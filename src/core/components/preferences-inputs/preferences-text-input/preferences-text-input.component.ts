import { Component } from '@angular/core';
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiTextfieldControllerModule} from "@taiga-ui/core";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-preferences-text-input',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule
  ],
  templateUrl: './preferences-text-input.component.html',
  styleUrl: './preferences-text-input.component.scss'
})
export class PreferencesTextInputComponent extends PreferencesCommonInputComponent<string> {

}
