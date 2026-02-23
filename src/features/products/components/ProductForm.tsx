import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components/ui'
import { productSchema, type ProductFormValues } from '../schemas/productSchema'
import type { Product } from '../types/product.types'

interface ProductFormProps {
  defaultValues?: Product
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  onCancel: () => void
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description,
          sku: defaultValues.sku,
          unit: defaultValues.unit,
        }
      : { name: '', description: '', sku: '', unit: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
        <Input label="Unit" error={errors.unit?.message} {...register('unit')} />
        <div className="sm:col-span-2">
          <Input
            label="Description"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isPending ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  )
}
