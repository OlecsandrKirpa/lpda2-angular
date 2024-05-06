import { BaseModel } from "../lib/base-model";
import { UserData, UserStatus } from "../lib/interfaces/user-data";

export class User extends BaseModel {
  fullname?: string;
  username?: string;
  email?: string;
  status?: UserStatus;
  root_at?: Date;
  can_root?: boolean;

  constructor(data: UserData){
    super(data);

    this.fullname = data.fullname;
    this.username = data.username;
    this.email = data.email;
    this.status = data.status;
    this.root_at = data.root_at ? new Date(data.root_at) : undefined;
    this.can_root = data.can_root;
  }
}