import { AuthService } from "@/services/auth.service";
import { CategoryService } from "@/services/category.service";
import { FilesService } from "@/services/files.service";
import { ProductService } from "@/services/product.service";
import { RestockService } from "@/services/restock.service";
import { SupplierService } from "@/services/supplier.service";
import { UserService } from "@/services/user.service";
import { create } from "zustand";

interface ServiceState {
  authService: AuthService
  categoryService: CategoryService
  productService: ProductService
  filesService: FilesService
  supplierService: SupplierService
  userService: UserService
  restockService: RestockService
}

export const useServiceStore = create<ServiceState>(() => ({
  authService: new AuthService(),
  categoryService: new CategoryService(),
  productService: new ProductService(),
  filesService: new FilesService(),
  supplierService: new SupplierService(),
  userService: new UserService(),
  restockService: new RestockService()
}))