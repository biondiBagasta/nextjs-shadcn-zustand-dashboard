import { CategoryData } from "./category"
import { Paginate } from "./paginate"

export interface ProductData {
  id: number
  code: string
  name: string
  purchase_price: number
  selling_price: number
  stock: number
  discount: number
  category_id: number;
  category: CategoryData;
  image: string
  created_at: Date
  updated_at: Date
}

export interface ProductPaginate {
  data: ProductData
  paginate: Paginate
}