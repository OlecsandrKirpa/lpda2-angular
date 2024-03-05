import { BaseModelData } from "./base-model-data";

export interface UserData extends BaseModelData{
  fullname?: string;
  email?: string;
  status?: UserStatus;
}

export const UserStatuses = [`active`, `deleted`] as const;
export type UserStatus = typeof UserStatuses[number];

// export const UserDataSchema = Joi.object({
//   id: Joi.number().required(),
//   email: Joi.string().required().email({tlds: { allow: false }}),
//   fullname: Joi.string(),
//   status: Joi.string().valid(...UserStatuses).required(),
// });