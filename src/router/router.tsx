import { createBrowserRouter, RouterProvider } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage'
import { SupplierProductsPage } from '@/features/suppliers/pages/SupplierProductsPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: (
              <div className="p-6">
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Welcome! You are authenticated.</p>
              </div>
            ),
          },
          {
            path: '/suppliers',
            element: <SuppliersPage />,
          },
          {
            path: '/suppliers/:supplierId/products',
            element: <SupplierProductsPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
        ],
      },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
