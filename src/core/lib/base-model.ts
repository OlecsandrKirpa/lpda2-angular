import { BaseModelData } from "./interfaces/base-model-data";

export class BaseModel {
  id?: number;
  data?:BaseModelData;

  updated_at?: Date;
  created_at?: Date;

  constructor(data: BaseModelData){
    if (!(data && data != null && data != undefined && typeof data == 'object' && Object.keys(data).length > 0)) return;

    this.id = data.id;
    this.data = data;
    if (data.updated_at) this.updated_at = new Date(data.updated_at);
    if (data.created_at) this.created_at = new Date(data.created_at);
  }

  updateData(data: BaseModelData): BaseModel {
    return this;
  }
}