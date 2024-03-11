import { TemplateRef } from "@angular/core";
import { CustomValidatorMessages } from "./custom-validator-messages";

export const Messages: CustomValidatorMessages = {
  required: 'Questo campo non può essere vuoto!',
  email: `Questa email non è valida!`,
  numbersOnly: `Solo numeri ammessi!`,
  numberOnly: `Solo numeri ammessi!`,
  numerical: `Solo numeri ammessi!`,

  invalid_http_url: `Collegamento http non valido`,

  minlength: (e: any): string => `Testo troppo corto: Lunghezza minima: ${e.requiredLength}, lunghezza attuale: ${e.actualLength}` ,
  InvalidFormat: (error: { validExample: string; value: string; }) => `"${error.value}" non è un formato valido. Esempio valido: "${error.validExample}"`,
  pattern: (error: { requiredPattern: string | RegExp; actualValue: string; }) =>  `"${error.actualValue}" non è un formato valido. Il formato deve rispettare la seguente espressione regolare (RegExp): "${error.requiredPattern}"`,
  max: (e: { max: number; actual: number; }) => `Il valore inserito è troppo grande! Valore massimo: ${e.max}, valore attuale: ${e.actual}`,
  min: (e: { min: number; actual: number; }) => `Il valore inserito è troppo piccolo! Valore minimo: ${e.min}, valore attuale: ${e.actual}`,
  maxlength: (e: {requiredLength: number, actualLength: number}) => `Il valore inserito è troppo lungo! Lunghezza massima: ${e.requiredLength}, Lunghezza attuale: ${e.actualLength}`,
  phoneIT: `Questo non sembra essere un numero di telefono italiano valido. Esempio: +39 123 456 7890`,
  inclusion: (e: any) => {
    const optionsText = Array.isArray(e) ? `I valori ammessi sono: ${e.join(', ')}.` : ``;
    
    return `Il valore inserito non è valido. ${optionsText}`;
  },
  arrayMinLength: (e: { 'requiredLength': number, 'actualLength': number }) => `Devi inserire almeno ${e.requiredLength} elementi.`,
  passwordConfirmation: `Le password non coincidono!`,
}