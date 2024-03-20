import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {MenuCategory} from "@core/models/menu-category";
import {Observable} from "rxjs";
import {MenuCategoryDashboardData} from "@core/lib/interfaces/menu-category-dashboard-data";

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

  dashboardData(id: number): Observable<MenuCategoryDashboardData>{
    return this.get<MenuCategoryDashboardData>(`${id}/dashboard_data`);
  }
}