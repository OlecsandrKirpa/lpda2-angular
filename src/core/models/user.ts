import { BaseModel } from "../lib/base-model";
import { UserData, UserStatus } from "../lib/interfaces/user-data";

export class User extends BaseModel {
  fullname?: string;
  email?: string;
  status?: UserStatus;

  constructor(data: UserData){
    super(data);

    this.updateData(data);
  }

  override updateData(data: UserData): User {
    if (data.hasOwnProperty('fullname'))   this.fullname =  data.fullname;
    if (data.hasOwnProperty('email'))      this.email =  data.email;
    if (data.hasOwnProperty('status'))     this.status = data.status;

    return super.updateData(data);
  }
}