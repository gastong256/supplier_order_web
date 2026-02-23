import { useState } from 'react'
import { Button } from '@/components/ui'
import { SupplierTable } from '../components/SupplierTable'
import { SupplierForm } from '../components/SupplierForm'
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '../hooks/useSuppliers'
import type { Supplier } from '../types/supplier.types'
import type { SupplierFormValues } from '../schemas/supplierSchema'

export function SuppliersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: suppliers = [], isLoading, isError } = useSuppliers()
  const createMutation = useCreateSupplier()
  const updateMutation = useUpdateSupplier()
  const deleteMutation = useDeleteSupplier()

  function handleNew() {
    setEditing(null)
    setShowForm(true)
  }

  function handleEdit(supplier: Supplier) {
    setEditing(supplier)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditing(null)
  }

  function handleSubmit(values: SupplierFormValues) {
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
    if (!confirm('Are you sure you want to delete this supplier?')) return
    setDeletingId(id)
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground">Manage your supplier list</p>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>New Supplier</Button>
        )}
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="rounded-md border border-border bg-card p-6">
          <h2 className="mb-4 text-base font-medium text-foreground">
            {editing ? 'Edit Supplier' : 'New Supplier'}
          </h2>
          <SupplierForm
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
        <div className="py-16 text-center text-sm text-muted-foreground">Loading suppliers...</div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-destructive">
          Failed to load suppliers. Check your connection.
        </div>
      ) : (
        <SupplierTable
          suppliers={suppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          deletingId={deletingId}
        />
      )}
    </div>
  )
}
