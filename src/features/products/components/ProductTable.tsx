import { Button } from '@/components/ui'
import type { Product } from '../types/product.types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  isDeleting: boolean
  deletingId: number | null
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  isDeleting,
  deletingId,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-border py-16 text-center text-sm text-muted-foreground">
        No products yet. Add your first one.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className="bg-card hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
              <td className="px-4 py-3 font-mono text-muted-foreground">{product.sku}</td>
              <td className="px-4 py-3 text-muted-foreground">{product.unit}</td>
              <td className="px-4 py-3 text-muted-foreground">{product.stock}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    isLoading={isDeleting && deletingId === product.id}
                    onClick={() => onDelete(product.id)}
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
