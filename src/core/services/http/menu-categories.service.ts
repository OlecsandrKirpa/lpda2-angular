import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {MenuCategory} from "@core/models/menu-category";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuCategoriesService extends CommonHttpService<MenuCategory> {

  constructor() {
    super(MenuCategory, `admin/menu/categories`);
  }

  addCategory(parentId: number, childId: number, params: Record<string | number, any> = {}): Observable<unknown> {
    return this.post(`${parentId}/add_category/${childId}`, params);
  }
}