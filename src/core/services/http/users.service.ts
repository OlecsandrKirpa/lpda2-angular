import { Injectable } from '@angular/core';
import {CommonHttpService} from "@core/services/http/common-http.service";
import {User} from "@core/models/user";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends CommonHttpService<User> {

  constructor() {
    super(User, `admin/users`);
  }
}
