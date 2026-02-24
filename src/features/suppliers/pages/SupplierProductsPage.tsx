import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select } from '@/components/ui'
import { useSuppliers } from '../hooks/useSuppliers'
import { useSupplierProducts, useLinkProduct, useUnlinkProduct } from '../hooks/useSupplierProducts'
import { useProducts } from '@/features/products/hooks/useProducts'

const linkSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  minimum_quantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  optimal_quantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  unit_price: z.coerce.number().positive('Must be greater than 0'),
})

type LinkFormValues = z.infer<typeof linkSchema>

export function SupplierProductsPage() {
  const { supplierId = '' } = useParams<{ supplierId: string }>()
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null)

  const { data: suppliers = [] } = useSuppliers()
  const supplier = suppliers.find((s) => s.id === supplierId)

  const { data: linkedProducts = [], isLoading, isError } = useSupplierProducts(supplierId)
  const { data: allProducts = [] } = useProducts()

  const linkMutation = useLinkProduct(supplierId)
  const unlinkMutation = useUnlinkProduct(supplierId)

  const linkedIds = new Set(linkedProducts.map((p) => p.id))
  const availableProducts = allProducts.filter((p) => !linkedIds.has(p.id))
  const selectOptions = availableProducts.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { product_id: '', minimum_quantity: 0, optimal_quantity: 0, unit_price: 0 },
  })

  function handleLink(values: LinkFormValues) {
    linkMutation.mutate(values, { onSuccess: () => reset() })
  }

  function handleUnlink(productId: string) {
    setUnlinkingId(productId)
    unlinkMutation.mutate(productId, { onSettled: () => setUnlinkingId(null) })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <Link
          to="/suppliers"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Suppliers
        </Link>
        <h1 className="text-xl font-semibold text-foreground">
          {supplier ? `Products for ${supplier.name}` : 'Supplier Products'}
        </h1>
        <p className="text-sm text-muted-foreground">Manage which products this supplier sells</p>
      </div>

      {/* Link product form */}
      <form
        onSubmit={handleSubmit(handleLink)}
        className="rounded-md border border-border bg-card p-4"
        noValidate
      >
        <h2 className="mb-4 text-sm font-medium text-foreground">Add a product</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Product"
            placeholder="Select a product..."
            options={selectOptions}
            error={errors.product_id?.message}
            disabled={availableProducts.length === 0}
            {...register('product_id')}
          />
          <Input
            label="Minimum quantity"
            type="number"
            min="0"
            error={errors.minimum_quantity?.message}
            {...register('minimum_quantity')}
          />
          <Input
            label="Optimal quantity"
            type="number"
            min="0"
            error={errors.optimal_quantity?.message}
            {...register('optimal_quantity')}
          />
          <Input
            label="Unit price"
            type="number"
            step="0.01"
            min="0"
            error={errors.unit_price?.message}
            {...register('unit_price')}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          {linkMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {linkMutation.error?.message}
            </p>
          )}
          <Button type="submit" isLoading={linkMutation.isPending} className="ml-auto">
            {linkMutation.isPending ? 'Adding...' : 'Add product'}
          </Button>
        </div>
      </form>

      {/* Linked products table */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading products...</div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-destructive">
          Failed to load linked products. Check your connection.
        </div>
      ) : linkedProducts.length === 0 ? (
        <div className="rounded-md border border-border py-16 text-center text-sm text-muted-foreground">
          No products linked yet. Add one above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Min. Qty</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Optimal Qty</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {linkedProducts.map((product) => (
                <tr key={product.product.id} className="bg-card transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{product.product.name}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{product.product.sku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.product.unit}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{product.product.stock}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    ${Number(product.unit_price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {product.minimum_quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {product.optimal_quantity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      isLoading={unlinkMutation.isPending && unlinkingId === product.product.id}
                      onClick={() => handleUnlink(product.product.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
