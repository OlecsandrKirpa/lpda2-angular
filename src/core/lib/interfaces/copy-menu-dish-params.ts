export type CopyDishParams = {
  copy_images: "full" | "link" | "none";
  copy_ingredients: "link" | "none";
  copy_tags: "link" | "none";
  copy_allergens: "link" | "none";
  category_id: number;
}
