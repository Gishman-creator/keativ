import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';
import { router } from './routes';
import toast, { Toaster } from 'react-hot-toast';
import './styles/globals.css';
import AppInitializer from './AppInitializer'; // Import the new initializer component
import { useState } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  const handleInitializationComplete = () => {
    setIsAppInitialized(true);
  };

  // If app is not initialized yet, show initializer
  if (!isAppInitialized) {
    return (
      <Provider store={store}>
        <AppInitializer onComplete={handleInitializationComplete} />
      </Provider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
