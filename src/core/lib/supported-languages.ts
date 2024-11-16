
import { TuiCountryIsoCode } from '@taiga-ui/i18n';

export interface LangData {
  name: string;
  code: string;
  iso: TuiCountryIsoCode;
}

export const supportedLanguages: LangData[] = [
  {
    name: "Italiano",
    code: "it",
    iso: TuiCountryIsoCode.IT
  },
  {
    name: "English",
    code: "en",
    iso: TuiCountryIsoCode.US
  },
];