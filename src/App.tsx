import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { VibeSolver, SolutionLibrary, Layout } from './components';
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
    if (path === '/library') {
      return (
        <Layout>
          <SolutionLibrary />
        </Layout>
      );
    }
    
    if (path === '/help') {
      return (
        <Layout>
          <HelpPage />
        </Layout>
      );
    }
    
    // Handle solution loading from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const solutionId = urlParams.get('solution') || urlParams.get('edit');
    const isEditMode = urlParams.has('edit');
    
    return <VibeSolver solutionId={solutionId} editMode={isEditMode} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      {renderContent()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
