export interface Product {
  id: string
  name: string
  description: string
  unit: string
  sku: string
  created_at: string
  updated_at: string
}

export interface CreateProductDto {
  name: string
  description: string
  unit: string
  sku: string
}

export type UpdateProductDto = Partial<CreateProductDto>
