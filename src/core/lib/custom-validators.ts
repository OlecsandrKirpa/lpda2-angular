import { AbstractControl, UntypedFormControl, ValidationErrors, Validators } from "@angular/forms";

const hasValue = (v: any): boolean => v !== undefined && v !== null && `${v}` !== '';

const validatePhoneIT = (value: string): boolean => {
  const maxLength: number = 10 + 2 + 2 ; // Number of digits + 2 for the prefix + 2 for the country code

    if (value.length < 9) return false;

    if (isNaN(Number(value))) return false;

    if (value.length > maxLength) return false;

  return true;
};

export class CustomValidators extends Validators {

  static listOfEmails(control: AbstractControl | UntypedFormControl): ValidationErrors | null {
    const value = control.value;
    if (!(value && typeof value === 'string' && value.length)) return null;

      const regex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$', 'i');
    value.split(/\,|\s+/gm).map((email: string) => email.trim()).filter((email: string) => email.length).forEach((email: string): ValidationErrors | void => {
      if (!regex.test(email)) return { listOfEmails: true };
    });

    return null;
  }

  static mustBeArray(control: AbstractControl | UntypedFormControl): ValidationErrors | null {
    if (!Array.isArray(control.value)) {
      return { 'mustBeArray': true };
    }

    return null;
  }

  static arrayMinLength(minLength: number): (c: AbstractControl | UntypedFormControl) => ValidationErrors | null {
    return (control: AbstractControl | UntypedFormControl) => {
      if (!Array.isArray(control.value)) return null;
      if (control.value.length < minLength) {
        return { 'arrayMinLength': { 'requiredLength': minLength, 'actualLength': control.value?.length ?? 0 } };
      }
      
      return null;
    };
  }

  static validateArray(validator: (c: AbstractControl | UntypedFormControl) => ValidationErrors | null): (c: AbstractControl | UntypedFormControl) => ValidationErrors | null {
    return (control: AbstractControl | UntypedFormControl) => {
      if (!Array.isArray(control.value)) return null;
      const errors: ValidationErrors = {};
      for (const item of control.value) {
        const result = validator(new UntypedFormControl(item));
        if (result) {
          Object.assign(errors, result);
        }
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  static percentage(control: AbstractControl | UntypedFormControl): ValidationErrors | null {
    if (hasValue(control.value) && (isNaN(control.value) || control.value < 0 || control.value > 100)) {
      return { 'percentage': true };
    }

    return null;
  }

  static phoneIT(control: AbstractControl | UntypedFormControl): ValidationErrors | null {
    const final = (valid: boolean): ValidationErrors|null => valid ? null : { 'phoneIT': true };
    const value = `${control.value}`.trim().replace(/\s+/gm, '').replace(/^\+39/gm, '');
    if (!(hasValue(value))) return final(true);

    return final(validatePhoneIT(value));
    // const maxLength: number = 10 + 2 + 2 ; // Number of digits + 2 for the prefix + 2 for the country code

    // if (value.length < 9) return final(false);

    // if (isNaN(Number(value))) return final(false);

    // if (value.length > maxLength) return final(false);

    // return final(true);
  }

  static instanceof(item: any): (c: AbstractControl | UntypedFormControl) => ValidationErrors | null{
    return (control: AbstractControl | UntypedFormControl) => {
      if (hasValue(control.value) && !(control.value instanceof item)) {
        return { 'instanceof': true };
      }

      return null;
    }
  }

  static instanceOf = this.instanceof;

  static numerical(control: AbstractControl | UntypedFormControl): ValidationErrors | null {
    if (hasValue(control.value) && isNaN(control.value)) {
      return { 'numerical': true };
    }

    return null;
  }

  static moreThan(expected: number):(c: AbstractControl | UntypedFormControl) => ValidationErrors | null {
    return (control: AbstractControl | UntypedFormControl ): ValidationErrors | null => {
      const value = control.value;
      if (value <= expected) return { moreThan: true };

      return null;
    }
  }

  static in(options: any[]): (c: AbstractControl | UntypedFormControl) => ValidationErrors | null {
    return this.inclusion(options);
  }

  static inclusion(options: readonly any[] | any[]): (c: AbstractControl | UntypedFormControl) => ValidationErrors | null {
    return (control: AbstractControl | UntypedFormControl) => {
      if (hasValue(control.value) && !options.includes(control.value)) {
        return { 'inclusion': true };
      }

      return null;
    }
  }
}
