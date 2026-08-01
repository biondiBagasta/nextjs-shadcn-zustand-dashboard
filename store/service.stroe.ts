import { AuthService } from "@/services/auth.service";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { create } from "zustand";

interface ServiceState {
  authService: AuthService
  categoryService: CategoryService
  productService: ProductService
}

export const useServiceStore = create<ServiceState>(() => ({
  authService: new AuthService(),
  categoryService: new CategoryService(),
  productService: new ProductService()
}))