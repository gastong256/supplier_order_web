import type { Supplier } from '@/features/suppliers/types/supplier.types'
import type { Product } from '@/features/products/types/product.types'

export type OrderState = 'DRAFT' | 'CONFIRMED'

export interface Order {
  id: string
  notes: string
  supplier_id: string
  supplier?: Supplier
  status: OrderState
  total: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  subtotal: number
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface CreateOrderDto {
  supplier_id: string
}

export interface AddOrderItemDto {
  product_id: string
  quantity: number
}

export interface UpdateOrderItemDto {
  quantity: number
}

export interface ConfirmOrderDto {
  status: OrderState
}