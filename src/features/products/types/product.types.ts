export interface Product {
  id: string
  name: string
  description: string
  unit: string
  sku: string
  stock: number
  created_at: string
  updated_at: string
}

export interface CreateProductDto {
  name: string
  description: string
  unit: string
  sku: string
  stock: number
}

export type UpdateProductDto = Partial<CreateProductDto>
