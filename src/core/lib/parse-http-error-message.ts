import {HttpErrorResponse} from "@angular/common/http";

type error = { attribute: string, message: string | string[] };

type configs = { joinChar?: string };

export function parseHttpErrorMessage(response: HttpErrorResponse, configs?: configs): string | null {
  const joinChar: string = configs?.joinChar ?? ', ';

  if (response.error?.message) return response.error.message;

  if (response.status == 500) {
    return `${response.error.error} ${response.error.exception}`.replace(/\</gm, '').replace(/\>+/gm, '');
  }

  if (response.status == 504) {
    return $localize`Server irraggiungibile, controlla la tua connessione e riprova.`;
  }


  return parseHttpErrorMessageFromErrors(extractErrors(response), configs);
}

export function parseHttpErrorMessageFromErrors(errors: error[], configs?: configs): string | null {
  if (errors.length == 0) return null;

  const joinChar: string = configs?.joinChar ?? ', ';

  const msg: string[] = errors.map((detail: {
    attribute: string,
    message: string | string[]
  }): string => `${detail['attribute']} ${detail['message']}`);

  if (msg.length) return uniq(msg).join(joinChar);

  return null;
}

export function uniq(array: string[]): string[] {
  return [...new Set(array)];
}

export function extractErrors(response: HttpErrorResponse): error[] {
  if (typeof response.error === 'object') {

    if (typeof response.error.details == 'object' && Array.isArray(response.error.details) && response.error.details.length > 0) {
      const errors: error[] = response.error.details.filter((detail: unknown): detail is Record<string, unknown> => typeof detail === 'object' && detail != null && detail instanceof Object && Object.keys(detail).length > 0).filter(
        (detail: Record<string, unknown>): detail is { attribute: string, message: string } =>
          typeof detail['attribute'] === 'string' && detail['attribute'].length > 0 &&
          ((typeof detail['message'] == 'string' && detail['message'].length > 0) || (Array.isArray(detail['message']) && detail['message'].length > 0))
      );

      if (errors.length > 0) return errors;
    }
  }

  return [];
}