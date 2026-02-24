import { useNavigate } from 'react-router'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Order, OrderState } from '../types/order.types'

const stateBadge: Record<OrderState, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  CONFIRMED: 'bg-primary/10 text-primary',
}

interface OrdersTableProps {
  orders: Order[]
  onDelete: (id: string) => void
  isDeleting: boolean
  deletingId: string | null
}

export function OrdersTable({ orders, onDelete, isDeleting, deletingId }: OrdersTableProps) {
  const navigate = useNavigate()

  if (orders.length === 0) {
    return (
      <div className="rounded-md border border-border py-16 text-center text-sm text-muted-foreground">
        No orders yet. Create your first one.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="bg-card transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-foreground">
                {order.supplier?.name ?? `Supplier #${order.supplier_id}`}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    stateBadge[order.status]
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground">
                {order.status === 'CONFIRMED' ? `$${Number(order.total).toFixed(2)}` : '—'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                  {order.status === 'DRAFT' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      isLoading={isDeleting && deletingId === order.id}
                      onClick={() => onDelete(order.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
