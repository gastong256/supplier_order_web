import { Button } from '@/components/ui'
import type { Supplier } from '../types/supplier.types'

interface SupplierTableProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}

export function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
  isDeleting,
  deletingId,
}: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="rounded-md border border-border py-16 text-center text-sm text-muted-foreground">
        No suppliers yet. Add your first one.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Address</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="bg-card hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{supplier.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{supplier.email}</td>
              <td className="px-4 py-3 text-muted-foreground">{supplier.phone}</td>
              <td className="px-4 py-3 text-muted-foreground">{supplier.address}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(supplier)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    isLoading={isDeleting && deletingId === supplier.id}
                    onClick={() => onDelete(supplier.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
