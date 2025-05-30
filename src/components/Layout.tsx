import { type ReactNode } from 'react';
import { ToastContainer } from './ui';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">☁️</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VibeSolver</h1>
              <p className="text-sm text-gray-600">AI AWS Solutions Architect</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Solutions
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              History
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Help
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}