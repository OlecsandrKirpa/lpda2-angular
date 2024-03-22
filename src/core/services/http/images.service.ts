import {Injectable} from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {map, Observable} from "rxjs";
import {CommonHttpService} from "@core/services/http/common-http.service";
import {Image} from '@core/models/image';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends CommonHttpService<Image> {

  constructor() {
    super(Image, `images`);
  }

  removeFromRecord(imageId: number, record_data: { record_type: string, record_id: number }): Observable<unknown> {
    return this.patch(`${imageId}/remove_from_record`, {record_type: record_data.record_type, record_id: record_data.record_id});
  }

  updateRecord(record_data: { record_type: string, record_id: number }, imageIds: number[]): Observable<unknown> {
    return this.patch(`record`, {
      image_ids: imageIds,
      record_type: record_data.record_type,
      record_id: record_data.record_id
    });
  }

  downloadUrl(id: number): Observable<string> {
    return this.url(`${id}/download`);
  }
}
