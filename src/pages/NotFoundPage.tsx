import { Link } from 'react-router'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="space-y-2 text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button variant="outline">
        <Link to="/">Go back home</Link>
      </Button>
    </main>
  )
}
