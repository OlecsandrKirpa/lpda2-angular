import { TemplateRef } from "@angular/core";
import { CustomValidatorMessages } from "./custom-validator-messages";

export const Messages: CustomValidatorMessages = {
  required: $localize`Questo campo non può essere vuoto!`,
  email: $localize`Questa email non è valida!`,
  numbersOnly: $localize`Solo numeri ammessi!`,
  numberOnly: $localize`Solo numeri ammessi!`,
  numerical: $localize`Solo numeri ammessi!`,

  invalid_http_url: $localize`Collegamento http non valido`,

  minlength: (e: any): string => $localize`Testo troppo corto: Lunghezza minima: ${e.requiredLength}, lunghezza attuale: ${e.actualLength}` ,
  InvalidFormat: (error: { validExample: string; value: string; }) => $localize`"${error.value}" non è un formato valido. Esempio valido: "${error.validExample}"`,
  pattern: (error: { requiredPattern: string | RegExp; actualValue: string; }) =>  $localize`"${error.actualValue}" non è un formato valido. Il formato deve rispettare la seguente espressione regolare (RegExp): "${error.requiredPattern}"`,
  max: (e: { max: number; actual: number; }) => $localize`Il valore inserito è troppo grande! Valore massimo: ${e.max}, valore attuale: ${e.actual}`,
  min: (e: { min: number; actual: number; }) => $localize`Il valore inserito è troppo piccolo! Valore minimo: ${e.min}, valore attuale: ${e.actual}`,
  maxlength: (e: {requiredLength: number, actualLength: number}) => $localize`Il valore inserito è troppo lungo! Lunghezza massima: ${e.requiredLength}, Lunghezza attuale: ${e.actualLength}`,
  phoneIT: $localize`Questo non sembra essere un numero di telefono italiano valido. Esempio: +39 123 456 7890`,
  inclusion: (e: any) => {
    const optionsText = Array.isArray(e) ? $localize`I valori ammessi sono: ${e.join(', ')}.` : ``;
    
    return $localize`Il valore inserito non è valido. ${optionsText}`;
  },
  arrayMinLength: (e: { 'requiredLength': number, 'actualLength': number }) => $localize`Devi inserire almeno ${e.requiredLength} elementi.`,
  passwordConfirmation: $localize`Le password non coincidono!`,
  formWeeklyFromTo: $localize`L'orario di inizio deve essere inferiore a quello di fine!`,
}