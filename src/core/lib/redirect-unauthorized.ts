import {Injector} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";
import { supportedLanguages } from "./supported-languages";

export function redirectUnauthorized(injector: Injector, fireNotification: boolean = true): void {
  const router: Router = injector.get(Router);

  if (fireNotification) {
    const notifications: NotificationsService = injector.get(NotificationsService);

    notifications.error($localize`Accedi per proseguire.`);
  }

  router.navigateByUrl(redirectUnauthorizedUrl(injector));
}

export function redirectUnauthorizedUrl(injector: Injector): UrlTree {
  const router: Router = injector.get(Router);

  if (window.location.pathname.indexOf(`/auth`) != -1) return router.createUrlTree([`/auth`]);

  let url = window.location.href.replace(window.location.origin, ``).replace(`/#/`, ``);
  supportedLanguages.forEach((lang) => {
    if (url.indexOf(`/${lang.code}`) === 0) url = url.replace(`/${lang.code}`, ``);
  });

  return router.createUrlTree([`/auth`], { queryParams: { url } });
}