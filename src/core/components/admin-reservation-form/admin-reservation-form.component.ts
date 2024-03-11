import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {TuiButtonModule} from "@taiga-ui/core";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";
import {Allergen} from "@core/models/allergen";
import {Reservation} from "@core/models/reservation";

@Component({
  selector: 'app-admin-reservation-form',
  standalone: true,
  imports: [
    ErrorsComponent,
    ReactiveFormsModule,
    I18nInputComponent,
    TuiButtonModule,
    ImageInputComponent,
  ],
  templateUrl: './admin-reservation-form.component.html',
})
export class AdminReservationFormComponent {
  @Output() formSubmit: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  @Input() set item(value: Reservation | null) {
    if (!(value)) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      // TODO
    })
  }

  readonly form: FormGroup = new FormGroup({
    // TODO
  });

  @Input() loading: boolean = false;

  private submitted: boolean = false;

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.formSubmit.emit(this.formVal());
  }

  private formVal(): Record<string, any> {
    const json = this.form.value;

    // TODO remove unchanged fields, ...

    return json;
  }

  e = this.errorsFor;

  private errorsFor(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    if (control.dirty || control.touched || this.submitted) {
      return control.errors;
    }

    return null;
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
