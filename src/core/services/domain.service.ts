import { Injectable, inject } from '@angular/core';
import { ConfigsService } from './configs.service';
import { cleanUrl } from '../lib/clean-url';
import { Observable, combineLatest, filter, forkJoin, map, switchMap, tap } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { HttpCustomDomain } from '../lib/http-custom-domain';

/**
 * This service will manage the domain of the API.
 * You can call backend endpoints with:
 * - this.domain.get(`/path/to/endpoint`)
 * and subscribe to the result.
 * The domain, the protocol, che version of the api, and the base path of the APIs
 * will be added automatically.
 */
@Injectable({
  providedIn: 'root',
})
export class DomainService extends HttpCustomDomain {
  protected readonly version: number = 1;

  private readonly configs: ConfigsService = inject(ConfigsService);

  constructor(){
    super((path: string) => this.url(path));
  }

  url(path: string | number = ``): Observable<string> {
    return this.baseUrl().pipe(
      map(baseUrl => cleanUrl(`${baseUrl}/${path}`)),
    )
  }

  private baseUrl(): Observable<string> {
    return combineLatest(
      this.configs.get(`api.domain`),
      this.configs.get(`api.secure`),
      this.configs.get(`api.path`),
    ).pipe(
      filter(([d, s, p]) => d !== null && s !== null && p !== null),
      map(([d, s, p]) => {
        const domain = d as string;
        const secure: boolean = s ? s === `true` : false;
        const apiPath = p as string;
        const protocol = `http${secure ? `s` : ``}://`;
        const versionNamespace = `/v${this.version}/`;

        return `${protocol}${domain}${apiPath}${versionNamespace}`;
      }),
    );
  }
}
