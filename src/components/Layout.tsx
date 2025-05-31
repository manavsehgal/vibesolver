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
  const currentPath = window.location.pathname;
  
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl">☁️</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VibeSolver</h1>
              <p className="text-sm text-gray-600">AI AWS Solutions Architect</p>
            </div>
          </button>
          
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => navigateTo('/library')}
              className={`transition-colors ${
                currentPath === '/library' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Solutions
            </button>
            <button 
              onClick={() => navigateTo('/help')}
              className={`transition-colors ${
                currentPath === '/help' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Help
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}