import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TuiRoutableDialogModule} from "@taiga-ui/kit";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(TuiRootModule, BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideAnimationsAsync(),
    importProvidersFrom(TuiRoutableDialogModule),
]
};
