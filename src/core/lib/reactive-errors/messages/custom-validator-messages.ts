import { TemplateRef } from "@angular/core";

export type CustomValidatorMessagesValue<inputType = any> = ((e?: any) => string | TemplateRef<any>) | string | TemplateRef<any>;

export interface CustomValidatorMessages {
  /**
   * The message to show when the input is required but empty.
   */
  required?: CustomValidatorMessagesValue;

  /**
   * Angular min length validator error
   */
  minlength?: CustomValidatorMessagesValue<{ requiredLength: number, actualLength: number }>;

  /**
   * Angular max length validator error
   */
  maxlength?: CustomValidatorMessagesValue<{ requiredLength: number, actualLength: number }>;

  /**
   * Angular emails validator error.
   */
  email?: CustomValidatorMessagesValue<{ email: boolean }>;

  /**
   * Invalid http url
   * @example https://www.google.com
   */
  invalid_http_url?: CustomValidatorMessagesValue;

  /**
   * Invalid format with example
   */
  InvalidFormat?: CustomValidatorMessagesValue<{ validExample: string, value: string }>;

  /**
   * Angular pattern validator
   * ```ts
   * Validators.pattern(/^[0-9]*$/)
   * ```
   */
  pattern?: CustomValidatorMessagesValue<{ requiredPattern: string | RegExp, actualValue: string }>;

  /**
   * Numbers only are allowed.
   */
  numberOnly?: CustomValidatorMessagesValue;

  /**
   * Alias of numberOnly
   */
  numbersOnly?: CustomValidatorMessagesValue;

  /**
   * Max numeric value
   */
  max?: CustomValidatorMessagesValue<{ max: number, actual: number }>;

  [key: string]: CustomValidatorMessagesValue | undefined;
}