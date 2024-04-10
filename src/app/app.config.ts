import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import {ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TuiRoutableDialogModule} from "@taiga-ui/kit";
import { of } from 'rxjs';
import {TUI_LANGUAGE, TUI_ITALIAN_LANGUAGE} from '@taiga-ui/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeIT from '@angular/common/locales/it';
import {addLanguageHeaderInterceptor} from "@core/interceptors/add-language-header.interceptor";
import {SessionService} from "@core/services/admin-session.service";

registerLocaleData(localeIT);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(TuiRootModule, BrowserAnimationsModule),
    DatePipe,
    provideHttpClient(withInterceptors([addLanguageHeaderInterceptor])),
    provideAnimations(),
    provideAnimationsAsync(),
    importProvidersFrom(TuiRoutableDialogModule),
    { provide: TUI_LANGUAGE, useValue: of(TUI_ITALIAN_LANGUAGE) },
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
]
};
