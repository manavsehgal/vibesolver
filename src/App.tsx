import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { VibeSolver, SolutionLibrary, Layout } from './components';
import { HistoryPage } from './components/HistoryPage';
import { HelpPage } from './components/HelpPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const path = window.location.pathname;
  
  const renderContent = () => {
    switch (path) {
      case '/library':
        return (
          <Layout>
            <SolutionLibrary />
          </Layout>
        );
      
      case '/history':
        return (
          <Layout>
            <HistoryPage />
          </Layout>
        );
      
      case '/help':
        return (
          <Layout>
            <HelpPage />
          </Layout>
        );
      
      default:
        return <VibeSolver />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {renderContent()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
