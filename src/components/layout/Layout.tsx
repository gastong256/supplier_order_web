import { NavLink, Outlet } from 'react-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/components/ui'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
]

export function Layout() {
  const { user, clearAuth } = useAuthStore()

  function handleLogout() {
    clearAuth()
    localStorage.removeItem('access_token')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="text-sm font-semibold text-foreground">Supplier Orders</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="border-t border-border p-3">
            <p className="mb-2 truncate px-2 text-xs text-muted-foreground">{user.email}</p>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
