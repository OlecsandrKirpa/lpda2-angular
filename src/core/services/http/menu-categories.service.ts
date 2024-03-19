import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {MenuCategory} from "@core/models/menu-category";

@Injectable({
  providedIn: 'root'
})
export class MenuCategoriesService extends CommonHttpService<MenuCategory> {

  constructor() {
    super(MenuCategory, `admin/menu/categories`);
  }
}