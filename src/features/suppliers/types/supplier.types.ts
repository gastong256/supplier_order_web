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
