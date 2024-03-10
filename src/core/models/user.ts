import { BaseModel } from "../lib/base-model";
import { UserData, UserStatus } from "../lib/interfaces/user-data";

export class User extends BaseModel {
  fullname?: string;
  email?: string;
  status?: UserStatus;

  constructor(data: UserData){
    super(data);

    this.fullname =  data.fullname;
    this.email =  data.email;
    this.status = data.status;
  }
}