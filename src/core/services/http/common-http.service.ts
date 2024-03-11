import {map, Observable} from "rxjs";
import {HttpCustomDomain} from "../../lib/http-custom-domain";
import {Injectable} from "@angular/core";
import {SearchResult, validSearchResultData} from "../../lib/search-result.model";
import {DomainService} from "../domain.service";

@Injectable({
  providedIn: 'root'
})
export abstract class CommonHttpService<T> extends DomainService {

  protected constructor(
    protected type: new (...args: any) => T,
    basePath: string,
  ) {
    super(basePath);
  }

  show(id: number): Observable<T> {
    return this.get(`${id}`).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }

  search(params: Record<string, string|number>): Observable<SearchResult<T>> {
    return this.get(``, {params: params}).pipe(
      map((data: any): SearchResult<T> => this.mapItems(data)),
    );
  }

  create(params: Record<string, any>): Observable<T> {
    return this.post(``, params).pipe(
      map((data: unknown): T => this.mapItem(data))
    )
  }

  // createWithFormData(params: Record<string, any>): Observable<T> {
  //   return this.postWithFormData(``, params).pipe(
  //     map((data: unknown): T => this.mapItem(data))
  //   )
  // }

  update(id: number, params: Record<string, any>): Observable<T> {
    return this.patch(`${id}`, params).pipe(
      map((data: unknown): T => this.mapItem(data))
    )
  }

  destroy(id: number): Observable<unknown> {
    return this.delete<any>(`${id}`);
  }

  protected mapItem(data: unknown): T {
    if (!this.type) throw new Error(`this.type is not defined for ${this.constructor.name}!`);
    if (!(typeof data === 'object' && data != null)) throw new Error(`Invalid data type for ${this.constructor.name}!`);
    if (!(typeof (data as any)['item'] === 'object' && (data as any)['item'] != null)) console.error(`Invalid data type for ${this.constructor.name}!`, data);

    return new this.type((data as any)['item']);
  }

  protected mapItems(data: unknown): SearchResult<T> {
    if (!this.type) throw new Error(`this.type is not defined for ${this.constructor.name}!`);
    if (!(validSearchResultData(data))) throw new Error(`Invalid data type for ${this.constructor.name}!`);

    return new SearchResult<T>(data, this.type);
  }

  // private postWithFormData(path: string, params: Record<string, any>) {
  //   let formData = new FormData();
  //   for (let key in params) {
  //     if (params.hasOwnProperty(key)) {
  //       let value = params[key];
  //
  //       if (typeof value === 'object' && value != null) {
  //         value = JSON.stringify(value);
  //       }
  //
  //       formData.append(key, value);
  //     }
  //   }
  //
  //   return this.post(path, formData);
  // }
}
