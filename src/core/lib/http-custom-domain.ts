import { HttpHandler, HttpRequest, HttpEvent, HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, switchMap } from "rxjs";

/**
 * This class, when extended, allows you to use a custom domain for your http requests.
 */
export abstract class HttpCustomDomain {
  private readonly originalHandler: HttpHandler = inject(HttpHandler);
  private readonly handler: HttpHandler = {
    handle: (request: HttpRequest<any>): Observable<HttpEvent<any>> => {
      return this.getUrlFn(request.url).pipe(
        switchMap(url => {
          const req = request.clone({ url });
          return this.originalHandler.handle(req);
        })
      );
    }
  };

  private readonly http: HttpClient = new HttpClient(this.handler);

  public readonly request = this.http.request;
  public readonly get = this.http.get;
  public readonly post = this.http.post;
  public readonly put = this.http.put;
  public readonly delete = this.http.delete;

  constructor(
    /**
     * This function takes the path of the endpoint as parameter
     * and returns the full url to be used in the http request.
     */
    private readonly getUrlFn: (path: string) => Observable<string>
  ){}
}