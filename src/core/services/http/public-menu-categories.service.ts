import { Injectable } from '@angular/core';
import { MenuCategory } from '@core/models/menu-category';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMenuCategoriesService extends CommonHttpService<MenuCategory> {

  constructor() {
    super(MenuCategory, `menu/categories`);
  }
}