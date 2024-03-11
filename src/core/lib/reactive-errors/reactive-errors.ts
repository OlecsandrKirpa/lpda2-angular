import { HttpErrorResponse } from "@angular/common/http";
import { TemplateRef } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, ValidationErrors } from "@angular/forms";
import { ActiveError } from "../interfaces/active-error";
import { CustomValidatorMessages } from "./messages/custom-validator-messages";
import { Messages as MessagesIt } from './messages/it';
import { ReactiveErrorsParams, ReactiveErrorsParamsDefaults } from "./reactive-errors-params";

export class ReactiveErrors {
  static formatErrors(errors: ValidationErrors|null, customErrorMessages?: any): (string | TemplateRef<any>)[] {
    if (errors == null || errors == undefined) return [];

    return new ReactiveErrors(errors, customErrorMessages).formatErrors();
  }

  static assignErrorsToForm(form: UntypedFormGroup, error: HttpErrorResponse, userParams: Partial<ReactiveErrorsParams> = {}): void {
    // const params: Required<ReactiveErrorsParams> = { ...ReactiveErrorsParamsDefaults, ...userParams };
    const errors: ActiveError[] = error.error?.details;
    if (!(errors && Array.isArray(errors))) return;

    this.assignErrorsToFormFromArray(form, errors, userParams);
  }


  static assignErrorsToFormFromArray(form: UntypedFormGroup, errors: ActiveError[], userParams: Partial<ReactiveErrorsParams> = {}): void{
    const params: Required<ReactiveErrorsParams> = { ...ReactiveErrorsParamsDefaults, ...userParams };

    errors.forEach((e: ActiveError) => {
      const control: UntypedFormControl = form.controls[e.attribute] as UntypedFormControl;
      if (control) {
        control.setErrors({ [e.attribute]: e.message });
        return;
      }

      if (params.assignToFormUnlessControl) form.setErrors({ [e.attribute]: e.message });
    });
  }

  private errors: { [error: string]: any };
  private readonly defaultMessages: CustomValidatorMessages = MessagesIt;
  private messages: CustomValidatorMessages = {};

  constructor(errors: { [error: string]: any }, customMessages: CustomValidatorMessages = MessagesIt) {
    this.errors = errors;

    if (customMessages) this.mergeMessages(customMessages);
    else this.assignDefaults();
  }

  private assignDefaults(): void {
    this.messages = {};

    Object.keys(this.defaultMessages).forEach((key: string) => {
      this.messages[key] = this.defaultMessages[key];
    })
  }

  private mergeMessages(messages: CustomValidatorMessages): void {
    const keys = [
      ...Object.keys(this.defaultMessages),
      ...Object.keys(messages)
    ];

    keys.forEach((key: string) => {
      if (messages[key]) {
        this.messages[key] = messages[key];
      } else {
        this.messages[key] = this.defaultMessages[key];
      }
    });
  }

  formatErrors(): (string | TemplateRef<any>)[] {
    const result: (string | TemplateRef<any>)[] = [
      ...this.errorMsgFromControl()
    ];

    /**
     * TODO write here your custom logic of parsing errors.
     */

    return result;
  }

  private enableLogging: boolean = false;

  private warn(...args: any[]): void {
    if (!(this.enableLogging)) return;

    console.warn(...args);
  }

  errorMsgFromControl(): string[] {
    if (this.errors == undefined || this.errors == null) return [];
    var messages: string[] = [];

    Object.keys(this.errors).filter((key: string): any => {
      if (typeof this.errors[key] == 'string' && this.errors[key].length > 0) return messages.push(this.errors[key]);

      if (this.messages.hasOwnProperty(key) && this.messages[key] && this.messages[key] != undefined) {
        const field: ((e?: any) => string) | string = this.messages[key] as string | ((e?: any) => string);
        switch (typeof field) {
          case 'string':
            messages.push(field);
            break;
          case 'function':
            messages.push(field(this.errors![key]));
            break;
          default:
            messages.push(field);
            break;
        }
        return;
      }

      this.warn(`ReactiveFormsErrors missing error message of "${key}". Parser error with your custom logic.`);

      const value: any = this.errors![key];
      if ([true, false].includes(value)) {
        var msg: any = {};
        msg[key] = this.errors[key];
        if (!(typeof msg == 'string')) msg = JSON.stringify(msg);
        messages.push(msg);
      } else {
        messages.push(this.errors![key]);
      }
    });

    return messages;
  }
}