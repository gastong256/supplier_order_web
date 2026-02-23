import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  sku: z.string().min(1, 'SKU is required'),
  unit: z.string().min(1, 'Unit is required'),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
})

export type ProductFormValues = z.infer<typeof productSchema>
