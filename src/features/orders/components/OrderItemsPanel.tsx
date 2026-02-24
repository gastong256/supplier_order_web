import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select } from '@/components/ui'
import { useAddOrderItem, useUpdateOrderItem, useDeleteOrderItem, useConfirmOrder } from '../hooks/useOrders'
import type { OrderItem } from '../types/order.types'
import type { SupplierProduct } from '@/features/suppliers/types/supplier.types'

const itemSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().min(1, 'Must be at least 1'),
  unit_price: z.coerce.number().positive('Must be greater than 0'),
})

type ItemFormValues = z.infer<typeof itemSchema>

interface OrderItemsPanelProps {
  orderId: string
  items: OrderItem[]
  supplierProducts: SupplierProduct[]
  isDraft: boolean
}

export function OrderItemsPanel({ orderId, items, supplierProducts, isDraft }: OrderItemsPanelProps) {
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addMutation = useAddOrderItem(orderId)
  const updateMutation = useUpdateOrderItem(orderId)
  const deleteMutation = useDeleteOrderItem(orderId)
  const confirmMutation = useConfirmOrder(orderId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { product_id: '', quantity: 1, unit_price: 0 },
  })

  const selectedProductId = watch('product_id')

  // Pre-fill unit_price when product changes (only when adding, not editing)
  useEffect(() => {
    if (!editingItem && selectedProductId) {
      const sp = supplierProducts.find((p) => p.product_id === selectedProductId)
      if (sp) setValue('unit_price', sp.unit_price)
    }
  }, [selectedProductId, supplierProducts, editingItem, setValue])

  // Products already in the order (exclude when adding, include all when editing)
  const orderedProductIds = new Set(items.map((i) => i.product_id))
  const availableForAdd = supplierProducts.filter(
    (sp) => !orderedProductIds.has(sp.product_id) || sp.product_id === editingItem?.product_id
  )
  const selectOptions = availableForAdd.map((sp) => ({
    value: sp.product_id,
    label: `${sp.product.name} (${sp.product.sku})`,
  }))

  const selectedSP = supplierProducts.find((sp) => sp.product_id === selectedProductId)

  const runningTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0)

  function handleEdit(item: OrderItem) {
    setEditingItem(item)
    const sp = supplierProducts.find((p) => p.product_id === item.product_id)
    reset({ product_id: item.product_id, quantity: item.quantity, unit_price: sp?.unit_price })
  }

  function handleCancelEdit() {
    setEditingItem(null)
    reset({ product_id: '', quantity: 1, unit_price: 0 })
  }

  function handleDelete(productId: string) {
    setDeletingId(productId)
    deleteMutation.mutate(productId, { onSettled: () => setDeletingId(null) })
  }

  function onSubmit(values: ItemFormValues) {
    // Validate minimum_quantity
    const sp = supplierProducts.find((p) => p.product_id === values.product_id)
    if (sp && values.quantity < sp.minimum_quantity) {
      setError('quantity', { message: `Minimum quantity for this product is ${sp.minimum_quantity}` })
      return
    }

    if (editingItem) {
      updateMutation.mutate(
        { productId: editingItem.product_id, data: { quantity: values.quantity } },
        { onSuccess: handleCancelEdit }
      )
    } else {
      addMutation.mutate(values, { onSuccess: () => reset({ product_id: '', quantity: 1, unit_price: 0 }) })
    }
  }

  const isMutating = addMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      {/* Add / Edit form — DRAFT only */}
      {isDraft && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-md border border-border bg-card p-4"
          noValidate
        >
          <h2 className="mb-4 text-sm font-medium text-foreground">
            {editingItem ? 'Edit item' : 'Add item'}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Product"
              placeholder="Select a product..."
              options={selectOptions}
              error={errors.product_id?.message}
              disabled={!!editingItem}
              {...register('product_id')}
            />
            <div>
              <Input
                label="Quantity"
                type="number"
                min="1"
                error={errors.quantity?.message}
                {...register('quantity')}
              />
              {selectedSP && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Min: {selectedSP.minimum_quantity} · Optimal: {selectedSP.optimal_quantity}
                </p>
              )}
            </div>
            <Input
              label="Unit price"
              type="number"
              value={watch('unit_price') || ''}
              readOnly
              error={errors.unit_price?.message}
              {...register('unit_price')}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            {(addMutation.isError || updateMutation.isError) && (
              <p role="alert" className="text-sm text-destructive">
                {(addMutation.error ?? updateMutation.error)?.message}
              </p>
            )}
            <div className="ml-auto flex gap-2">
              {editingItem && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button type="submit" isLoading={isMutating}>
                {isMutating ? 'Saving...' : editingItem ? 'Update item' : 'Add item'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Items table */}
      {items.length === 0 ? (
        <div className="rounded-md border border-border py-16 text-center text-sm text-muted-foreground">
          No items yet.{isDraft ? ' Add one above.' : ''}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Subtotal</th>
                {isDraft && (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="bg-card transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {item.product?.name ?? `Product #${item.product_id}`}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {item.product?.sku ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    ${isDraft ? Number(supplierProducts.find((p) => p.product_id === item.product_id)?.unit_price ?? 0).toFixed(2) : Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    ${Number(item.subtotal).toFixed(2)}
                  </td>
                  {isDraft && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          disabled={!!editingItem}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          isLoading={deleteMutation.isPending && deletingId === item.product_id}
                          onClick={() => handleDelete(item.product_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-border bg-muted/30">
              <tr>
                <td
                  colSpan={isDraft ? 4 : 3}
                  className="px-4 py-3 text-right text-sm font-medium text-foreground"
                >
                  {isDraft ? 'Running Total' : 'Order Total'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  ${runningTotal.toFixed(2)}
                </td>
                {isDraft && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Confirm button — DRAFT only */}
      {isDraft && (
        <div className="flex justify-end">
          <Button
            onClick={() => confirmMutation.mutate()}
            isLoading={confirmMutation.isPending}
            disabled={items.length === 0}
          >
            {confirmMutation.isPending ? 'Confirming...' : 'Confirm Order'}
          </Button>
        </div>
      )}
    </div>
  )
}
