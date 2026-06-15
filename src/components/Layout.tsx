import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/clients', label: 'Clientes' },
  { to: '/analysis', label: 'Análises de Crédito' },
  { to: '/card-holders', label: 'Card Holders' },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-8">
          <span className="text-white font-bold text-lg tracking-tight">Card Holder UI</span>
          <nav className="flex gap-4">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
