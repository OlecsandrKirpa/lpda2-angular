import { Injectable } from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends DomainService {

  constructor() {
    super(`images`)
  }

  downloadUrl(id: number): Observable<string> {
    return this.url(`${id}/download`);
  }
}
