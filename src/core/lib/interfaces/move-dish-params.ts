export type MoveDishParams = {
  category_id: number;
  to_index: number; // >= 0
} | {
  to_index: number;
}