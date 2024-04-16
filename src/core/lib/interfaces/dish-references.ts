export interface DishReferences {
  // categories: [{id: number, name: string}][]
  categories: {id: number, name: string, breadcrumb: [{id: number, name: string}]}[]
}