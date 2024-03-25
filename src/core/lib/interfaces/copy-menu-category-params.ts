
export interface CopyMenuCategoryParams {
  copy_children: "full" | "none";
  copy_dishes: "full" | "link" | "none";
  copy_images: "full" | "link" | "none";
  parent_id: number | null;
}