import {Injector} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {NotificationsService} from "@core/services/notifications.service";

export function redirectUnauthorized(injector: Injector, fireNotification: boolean = true): void {
  const router: Router = injector.get(Router);

  if (fireNotification) {
    const notifications: NotificationsService = injector.get(NotificationsService);

    notifications.error($localize`Accedi per proseguire.`);
  }

  const url = window.location.pathname.indexOf(`/auth`) === -1 ? window.location.href.replace(window.location.origin, ``) : null;

  router.navigateByUrl(redirectUnauthorizedUrl(injector));
}

export function redirectUnauthorizedUrl(injector: Injector): UrlTree {
  const router: Router = injector.get(Router);

  const url: string | null = window.location.pathname.indexOf(`/auth`) === -1 ? window.location.href.replace(window.location.origin, ``) : null;

  return router.createUrlTree([`/auth`], { queryParams: { url } });
}