/**
 * This is a pased error of ActiveRecord
 */
export interface ActiveError{
  /**
   * The invalid field.
   */
  attribute: string;

  /**
   * The message to show to the user
   */
  message: string;

  /**
   * The types of the error.
   */
  type: string;
  raw_type: string;

  options: {[key: string]: any};
}