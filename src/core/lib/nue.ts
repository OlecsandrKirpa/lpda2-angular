import { isDevMode } from "@angular/core";

/**
 * NUE stands for Notify User Error.
 * Use this to log errors to the console for those requests where you don't want to manage the error yourself.
 */
export function nue(verbose: boolean = false): NueType {
  const errorFn = (...args: any) => {
    console.error(`[NUE]`, ...args);
    // TODO: send notification to user interface.
  }

  if (verbose === false || !isDevMode()) return { error: errorFn };

  return {
    error: errorFn,
    next: (...args: any) => console.log(`[NUE next]`, ...args),
    complete: (...args: any) => console.log(`[NUE complete]`, ...args),
  }
}

export interface NueType {
  error: (...args: any) => void;
  next?: (...args: any) => void;
  complete?: (...args: any) => void;
}