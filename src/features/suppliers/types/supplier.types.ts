export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export interface CreateSupplierDto {
  name: string
  email: string
  phone: string
  address: string
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>

import type { Product } from '@/features/products/types/product.types'

export interface SupplierProduct extends Product {
  minimum_quantity: number
  optimal_quantity: number
  unit_price: number
}

export interface LinkProductDto {
  product_id: string
  minimum_quantity: number
  optimal_quantity: number
  unit_price: number
}
