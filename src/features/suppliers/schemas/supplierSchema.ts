import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>
