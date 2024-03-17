import {Component, EventEmitter, inject, Input, Output, signal, WritableSignal} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {takeUntil} from "rxjs";
import {Allergen} from "@core/models/allergen";
import {HttpErrorResponse} from "@angular/common/http";
import {ReactiveErrors} from "@core/lib/reactive-errors/reactive-errors";
import {parseHttpErrorMessage} from "@core/lib/parse-http-error-message";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {TuiButtonModule} from "@taiga-ui/core";
import {ImageInputComponent} from "@core/components/image-input/image-input.component";

@Component({
  selector: 'app-allergen-form',
  standalone: true,
  imports: [
    ErrorsComponent,
    ReactiveFormsModule,
    I18nInputComponent,
    TuiButtonModule,
    ImageInputComponent,
  ],
  templateUrl: './allergen-form.component.html',
})
export class AllergenFormComponent {
  @Output() formSubmit: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();

  @Input() set item(value: Allergen | null) {
    if (!(value)) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      name: value.translations.name,
      description: value.translations.description,
      image: value.image,
    })
  }

  readonly form: FormGroup = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null),
    image: new FormControl(null),
  });

  @Input() loading: boolean = false;

  private submitted: boolean = false;

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.formSubmit.emit(this.formData());
  }

  private formData(): FormData {
    const formData: FormData = new FormData();

    if (this.form.get(`image`)?.dirty || this.form.get(`image`)?.touched)
      formData.append('image', this.form.get('image')?.value);

    if (this.form.get(`name`)?.dirty || this.form.get(`name`)?.touched)
      formData.append('name', JSON.stringify(this.form.get('name')?.value));

    if (this.form.get(`description`)?.dirty || this.form.get(`description`)?.touched)
      formData.append(`description`, JSON.stringify(this.form.get(`description`)?.value));

    return formData;
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
