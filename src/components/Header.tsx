import { Link } from '@tanstack/react-router'

import ClerkHeader from '../integrations/clerk/header-user.tsx'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/api-request">Start - API Request</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/clerk">Clerk</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/neon">Neon</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/sentry/testing">Sentry</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query">TanStack Query</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/trpc-todo">tRPC Todo</Link>
        </div>

        <div className='px-2 font-bold'>
          <Link to="/games">Games</Link>
        </div>
      </nav>

      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
