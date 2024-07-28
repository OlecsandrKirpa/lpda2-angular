import { Injectable } from '@angular/core';
import {DomainService} from "@core/services/domain.service";
import {CommonHttpService} from "@core/services/http/common-http.service";
import {PublicMessage} from "@core/models/public-message";

@Injectable({
  providedIn: 'root'
})
export class PublicMessagesService extends CommonHttpService<PublicMessage> {

  constructor() {
    super(PublicMessage, `admin/public_messages`);
  }
}
