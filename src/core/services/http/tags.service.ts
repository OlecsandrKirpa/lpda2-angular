import { Injectable } from '@angular/core';
import {CommonHttpService} from "./common-http.service";
import {Allergen} from "../../models/allergen";
import {Tag} from "@core/models/tag";

@Injectable({
  providedIn: 'root'
})
export class TagsService extends CommonHttpService<Tag> {

  constructor() {
    super(Tag, `admin/menu/tags`);
  }
}
