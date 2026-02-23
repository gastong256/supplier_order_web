import { useState } from 'react'
import { Button } from '@/components/ui'
import { ProductTable } from '../components/ProductTable'
import { ProductForm } from '../components/ProductForm'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProducts'
import type { Product } from '../types/product.types'
import type { ProductFormValues } from '../schemas/productSchema'

export function ProductsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: products = [], isLoading, isError } = useProducts()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  function handleNew() {
    setEditing(null)
    setShowForm(true)
  }

  function handleEdit(product: Product) {
    setEditing(product)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditing(null)
  }

  function handleSubmit(values: ProductFormValues) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: values },
        { onSuccess: handleCancel }
      )
    } else {
      createMutation.mutate(values, { onSuccess: handleCancel })
    }
  }

  function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeletingId(id)
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>New Product</Button>
        )}
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="rounded-md border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-medium text-foreground">
            {editing ? 'Edit Product' : 'New Product'}
          </h2>
          <ProductForm
            defaultValues={editing ?? undefined}
            onSubmit={handleSubmit}
            isPending={isMutating}
            onCancel={handleCancel}
          />
          {(createMutation.isError || updateMutation.isError) && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {(createMutation.error ?? updateMutation.error)?.message}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading products...</div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-destructive">
          Failed to load products. Check your connection.
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          deletingId={deletingId}
        />
      )}
    </div>
  )
}
