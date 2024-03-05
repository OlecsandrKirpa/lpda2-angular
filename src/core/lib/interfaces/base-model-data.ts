// import * as Joi from "joi";

/**
 * Interface for base model data.
 * All models data should implement this interface.
 */
export interface BaseModelData {
  id: number;
  created_at: string;
  updated_at: string;
}

// export const BaseModelDataSchema = {
//   id: Joi.number().required(),
//   created_at: Joi.string().required(),
//   updated_at: Joi.string().required(),
// }