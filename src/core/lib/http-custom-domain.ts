import { HttpHandler, HttpRequest, HttpEvent, HttpClient } from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Observable, switchMap, tap} from "rxjs";
import {DomainService} from "../services/domain.service";

/**
 * TODO:
 * may try to create a custom http client that uses the domain service to get the domain.
 * This way, you could do something like this:
 * ```typescript
 * private readonly http: HttpClientWithDomain = inject(HttpClientWithDomain);
 *
 * search: this.http.get<SearchResult<Allergen>>(`/allergens/`, { params: this.filters() });
 * ```
 */

/**
 * This class, when extended, allows you to use a custom domain for your http requests.
 */
export abstract class HttpCustomDomain {
  private readonly originalHandler: HttpHandler = inject(HttpHandler);
  private readonly handler: HttpHandler = {
    handle: (request: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return this.getUrlFn(request.url).pipe(
        switchMap((url: string) => this.originalHandler.handle(request.clone({ url }))),
      );
    }
  };

  protected readonly http: HttpClient = new HttpClient(this.handler);

  public readonly request = this.http.request;
  public readonly get = this.http.get;
  public readonly post = this.http.post;
  public readonly put = this.http.put;
  public readonly delete = this.http.delete;
  public readonly patch = this.http.patch;

  protected constructor(
    /**
     * This function takes the path of the endpoint as parameter
     * and returns the full url to be used in the http request.
     */
    private readonly getUrlFn: (path: string) => Observable<string>
  ){}
}

// @Injectable()
// export class BackendHttpHandler extends HttpHandler {
//   constructor(private httpHandler: HttpHandler) {
//     super();
//   }
//
//   private readonly domain: DomainService = inject(DomainService);
//
//   override handle(req: HttpRequest<any>) {
//     return this.domain.get(``).pipe(
//       switchMap((url: string) => this.httpHandler.handle(req.clone({ url }))),
//     )
//   }
// }
//
// @Injectable()
// export class BackendHttpClient extends HttpClient {
//   constructor(handler: BackendHttpHandler) {
//     super(handler);
//   }
// }