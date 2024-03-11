export interface ReactiveErrorsParams{
  /**
   * If the control does not exist in this form, should the error be assigned directly to the form?
   */
  assignToFormUnlessControl: boolean,
}

export const ReactiveErrorsParamsDefaults: ReactiveErrorsParams = {
  assignToFormUnlessControl: true,
}