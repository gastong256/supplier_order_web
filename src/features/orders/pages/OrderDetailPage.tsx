import { useParams, Link } from 'react-router'
import { cn } from '@/lib/utils'
import { useOrder } from '../hooks/useOrders'
import { useSupplierProducts } from '@/features/suppliers/hooks/useSupplierProducts'
import { OrderItemsPanel } from '../components/OrderItemsPanel'
import type { OrderState } from '../types/order.types'

const stateBadge: Record<OrderState, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  CONFIRMED: 'bg-primary/10 text-primary',
}

export function OrderDetailPage() {
  const { orderId = '' } = useParams<{ orderId: string }>()

  const { data: order, isLoading, isError } = useOrder(orderId)
  const { data: supplierProducts = [] } = useSupplierProducts(order?.supplier_id ?? '')

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground p-6">
        Loading order...
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="p-6 py-16 text-center text-sm text-destructive">
        Failed to load order. Check your connection.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <Link
          to="/orders"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Orders
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">
            Order — {order.supplier?.name ?? `Supplier #${order.supplier_id}`}
          </h1>
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
              stateBadge[order.status]
            )}
          >
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Created {new Date(order.created_at).toLocaleDateString()}
          {order.status === 'CONFIRMED' &&
            ` · Confirmed total: $${Number(order.total).toFixed(2)}`}
        </p>
      </div>

      <OrderItemsPanel
        orderId={order.id}
        items={order.items}
        supplierProducts={supplierProducts}
        isDraft={order.status === 'DRAFT'}
      />
    </div>
  )
}
