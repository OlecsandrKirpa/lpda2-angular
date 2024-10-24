import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ReactiveErrors } from '@core/lib/reactive-errors/reactive-errors';
import { TuiErrorModule } from '@taiga-ui/core';

/**
 * @description
 * This component is used to display errors for a form control.
 * 
 * @example
 * ```html
 *  <app-errors [errors]="form.controls['name']?.errors"></app-errors>
 * ```
 */
@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TuiErrorModule
]
})
export class ErrorsComponent {

  /**
   * ISSUE:
   * if you add errors to the form control after the component is initialized, the component will not display the errors.
   */
  // @Input() set control(control: FormGroup | AbstractControl | FormControl | null | undefined) {
  //   if (!control) {
  //     console.error("Control not found", control);
  //     throw new Error("Control not found");
  //   }

  //   this.errors = control.errors;

  //   control.valueChanges.subscribe(() => {
  //     this.errors = control.errors;
  //   });
  // }

  private _errors?: ValidationErrors | null = null;

  get errors(): ValidationErrors | undefined | null {
    return this._errors;
  }

  @Input()
  set errors(v: ValidationErrors | undefined | null) {
    this._errors = v;
  }

  allErrors(): ValidationErrors | null {
    return this.errors || null;
  }

  errorsToTemplates(): TemplateRef<any>[] {
    return ReactiveErrors.formatErrors(this.errors || null).filter((s: string | TemplateRef<any>) => s && s instanceof TemplateRef) as TemplateRef<any>[];
  }

  errorsToStr(): string[] {
    return ReactiveErrors.formatErrors(this.errors || null).filter((s: string | TemplateRef<any>) => s && typeof s === 'string') as string[];
  }
}
