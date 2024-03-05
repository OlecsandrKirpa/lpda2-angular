import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule} from "@taiga-ui/cdk";
import {TuiButtonModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-admin-allergens-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    MatIcon,
  ],
  templateUrl: './admin-allergens-home.component.html',
  styleUrl: './admin-allergens-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAllergensHomeComponent {
  readonly loading: WritableSignal<boolean> = signal(false);

  readonly form: FormGroup = new FormGroup({
    query: new FormControl(null),
    offset: new FormControl(0, [Validators.min(0), Validators.required]),
    per_page: new FormControl(10, [Validators.min(1), Validators.required]),
    // status: new FormControl(this.statusOptions),
    // value_type: new FormControl(`any`),
    // allowed_value: new FormControl(null, [
    //   Validators.min(1),
    //   () => (control: FormControl) => {
    //     const v = control.value;
    //     return Number(v) === v && v % 1 === 0 ? null : { integer: true };
    //   },
    // ]),
  });
}
