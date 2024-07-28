import {BaseModel} from "@core/lib/base-model";
import {PublicMessageData, PublicMessageKey} from "@core/lib/interfaces/public-message";

export class PublicMessage extends BaseModel {
  key?: PublicMessageKey;
  text?: string;

  translations?: {
    text?: Record<string, string>;
  }

  constructor(data: PublicMessageData) {
    super(data);

    this.key = data.key;
    this.text = data.text;
    this.translations = data.translations;
  }
}

