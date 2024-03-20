import {Component, Inject} from '@angular/core';
import {TuiButtonModule, TuiDialogContext, TuiDialogService} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from "@tinkoff/ng-polymorpheus";
import {FormControl, FormGroup, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {I18nInputComponent} from "@core/components/i18n-input/i18n-input.component";
import {ErrorsComponent} from "@core/components/errors/errors.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-edit-name-desc-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    I18nInputComponent,
    ErrorsComponent,
    TuiButtonModule,
    JsonPipe
  ],
  templateUrl: './edit-name-desc-modal.component.html',
})
export class EditNameDescModalComponent {

  private submitted: boolean = false;
  readonly form: FormGroup = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null),
  })

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<null | {
      name: Record<string, string>,
      description: Record<string, string>
    }, {
      name: Record<string, string>,
      description: Record<string, string>
    }>,
  ) {
    this.form.patchValue(this.context.data)
  }


  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.context.completeWith(this.form.value);
  }

  cancel() {
    this.context.completeWith(null);
  }

  e(controlName: string): ValidationErrors | null {
    const control = this.form.get(controlName);
    if (!(control)) return null;

    return (this.submitted || control.dirty || control.touched) ? control.errors : null;
  }
}
