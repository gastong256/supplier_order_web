import { useState } from 'react'
import { Button, Select } from '@/components/ui'
import { OrdersTable } from '../components/OrdersTable'
import { useOrders, useCreateOrder, useDeleteOrder } from '../hooks/useOrders'
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers'

export function OrdersPage() {
  const [showNew, setShowNew] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: orders = [], isLoading, isError } = useOrders()
  const { data: suppliers = [] } = useSuppliers()
  const createMutation = useCreateOrder()
  const deleteMutation = useDeleteOrder()

  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.name }))

  function handleCreate() {
    if (!supplierId) return
    createMutation.mutate({ supplier_id: supplierId })
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this order?')) return
    setDeletingId(id)
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Buy Orders</h1>
          <p className="text-sm text-muted-foreground">Manage purchase orders by supplier</p>
        </div>
        {!showNew && (
          <Button onClick={() => setShowNew(true)}>New Order</Button>
        )}
      </div>

      {/* New order panel */}
      {showNew && (
        <div className="flex items-end gap-3 rounded-md border border-border bg-card p-4">
          <div className="w-64">
            <Select
              label="Supplier"
              placeholder="Select a supplier..."
              options={supplierOptions}
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            isLoading={createMutation.isPending}
            disabled={!supplierId}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Order'}
          </Button>
          <Button variant="outline" onClick={() => { setShowNew(false); setSupplierId('') }}>
            Cancel
          </Button>
          {createMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {createMutation.error?.message}
            </p>
          )}
        </div>
      )}

      {/* Orders table */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading orders...</div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-destructive">
          Failed to load orders. Check your connection.
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          deletingId={deletingId}
        />
      )}
    </div>
  )
}
