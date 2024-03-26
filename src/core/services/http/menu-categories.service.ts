import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {MenuCategory} from "@core/models/menu-category";
import {map, Observable} from "rxjs";
import {MenuCategoryDashboardData} from "@core/lib/interfaces/menu-category-dashboard-data";
import {VisibilityParams} from "@core/lib/interfaces/visibility-params";
import { CopyMenuCategoryParams } from '@core/lib/interfaces/copy-menu-category-params';

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

  updateVisibility(id: number, visibility_params: VisibilityParams): Observable<MenuCategory> {
    return this.patch(`${id}/visibility`, visibility_params).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }

  copy(id: number, params: CopyMenuCategoryParams): Observable<MenuCategory> {
    return this.post(`${id}/copy`, params).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }

  move(id: number, toIndex: number): Observable<unknown>{
    return this.patch(`${id}/move/${toIndex}`, { }).pipe(
      map((data: unknown) => this.mapItem(data))
    );
  }
}